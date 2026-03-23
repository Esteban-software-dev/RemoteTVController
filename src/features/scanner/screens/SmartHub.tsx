import { View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { SmartHubSectionType } from '../interfaces/section.types';
import { SmartHubSectionList } from '../components/SmartHubSectionList';
import { defaultApps } from '@src/default-apps';
import { NoRokuDevice } from '../components/NoRokuDevice';
import { colors } from '@src/config/theme/colors/colors';
import { useBottomtabNavigation } from '@src/navigation/hooks/useBottomtabNavigation';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { buildAppsSections } from '../helpers/build-apps-section';
import { PinnedFabMenu } from '../components/PinnedAppsBar';
import { launchRokuApp } from '../services/roku-apps.service';
import { fetchActiveRokuApp } from '../services/roku-device-info.service';
import { ActiveApp } from '../interfaces/active-app.interface';
import { AppBackground } from '@src/shared/components/AppBackground';
import { buildHiddenAppIds, filterAppsByHiddenIds } from '../services/roku-preferences.service';
import { useTranslation } from 'react-i18next';


const EMPTY_APPS: typeof defaultApps = [];

export function SmartHub() {
    const { t } = useTranslation();

    const { navigation } = useBottomtabNavigation();
    const apps = useRokuSessionStore(s => s.apps ?? EMPTY_APPS);
    const setApps = useRokuSessionStore(s => s.setApps);
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);
    const setActiveApp = useRokuSessionStore(s => s.setActiveApp);

    const deviceId = selectedDevice?.deviceId ?? '';
    const deviceIp = selectedDevice?.ip ?? '';

    const favorites = useAppCustomizationStore(s =>
        s.byDevice[deviceId]?.favorites ?? EMPTY_APPS
    );
    const pinned = useAppCustomizationStore(s =>
        s.byDevice[deviceId]?.pinned ?? EMPTY_APPS
    );
    const hidden = useAppCustomizationStore(s =>
        s.byDevice[deviceId]?.hidden ?? EMPTY_APPS
    );

    const onAppPress = async (deviceIp: string, appId: string) => {
        await launchRokuApp(deviceIp, appId);
        const launchedApp = await fetchActiveRokuApp(deviceIp);
        setActiveApp(launchedApp ?? ({} as ActiveApp));
    };

    const hiddenIds = useMemo(() => buildHiddenAppIds(hidden), [hidden]);
    const visibleFavorites = useMemo(() => filterAppsByHiddenIds(favorites, hiddenIds), [favorites, hiddenIds]);
    const visiblePinned = useMemo(() => filterAppsByHiddenIds(pinned, hiddenIds), [pinned, hiddenIds]);

    const sections: SmartHubSectionType[] = useMemo(() => {
        return [
            {
                type: 'favorites',
                data: visibleFavorites,
                title: t('smartHub.sections.favorites.title'),
                subtitle: t('smartHub.sections.favorites.subtitle'),
                iconName: 'heart',
                scrollType: 'horizontal',
            },
            ...buildAppsSections(filterAppsByHiddenIds(apps, hiddenIds), t),
        ];
    }, [apps, hiddenIds, t, visibleFavorites]);

    useEffect(() => {
        if (!selectedDevice) return;
        if (apps.length > 0) return;

        setApps(defaultApps);
    }, [apps.length, selectedDevice, setApps]);

    if (!apps.length) {
        return (
            <NoRokuDevice
                title={t('smartHub.noDevice.title')}
                subtitle={t('smartHub.noDevice.subtitle')}
                iconName="tv-outline"
                actionButton={{
                    label: t('smartHub.noDevice.action.label'),
                    iconName: 'search',
                    variant: 'outline',
                    color: colors.gradient[2],
                    onPress: () => navigation.navigate('Tv scanner'),
                }}
            />
        );
    }

    return (
        <View style={[globalStyles.container, globalStyles.horizontalAppPadding]}>
            <AppBackground />
            <SmartHubSectionList
                sections={sections}
                deviceId={deviceId}
                deviceIp={deviceIp}
            />
            <PinnedFabMenu
                apps={visiblePinned}
                deviceId={deviceId}
                deviceIp={deviceIp}
                onPress={app =>
                    onAppPress(deviceIp, app.id)
                }
            />
        </View>
    );
}
