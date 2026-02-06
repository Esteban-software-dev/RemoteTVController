import { View } from 'react-native';
import React, { useEffect } from 'react';
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
import { filterHiddenApps } from '../services/roku-preferences.service';
import { useTranslation } from 'react-i18next';


export function SmartHub() {
    const { t } = useTranslation();

    const { navigation } = useBottomtabNavigation();
    const { apps, setApps } = useRokuSessionStore();
    const { selectedDevice, setActiveApp } = useRokuSessionStore();

    const deviceId = useRokuSessionStore(s => s.selectedDevice?.deviceId);
    const config = useAppCustomizationStore(s =>
        deviceId ? s.byDevice[deviceId] : null,
    );

    const onAppPress = async (deviceIp: string, appId: string) => {
        await launchRokuApp(deviceIp, appId);
        const launchedApp = await fetchActiveRokuApp(deviceIp);
        setActiveApp(launchedApp ?? ({} as ActiveApp));
    };

    const sections: SmartHubSectionType[] = React.useMemo(() => {
        return [
            {
                type: 'favorites',
                data: filterHiddenApps(deviceId ?? '', config?.favorites ?? []),
                title: t('smartHub.sections.favorites.title'),
                subtitle: t('smartHub.sections.favorites.subtitle'),
                iconName: 'heart',
                scrollType: 'horizontal',
            },
            ...buildAppsSections(apps ?? [], t),
        ];
    }, [deviceId, config, apps, t]);

    useEffect(() => {
        if (!selectedDevice) return;
        if (apps && apps.length > 0) return;

        setApps(defaultApps);
    }, [selectedDevice]);

    if (!apps || !apps.length) {
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
            <SmartHubSectionList sections={sections} />
            <PinnedFabMenu
                apps={filterHiddenApps(deviceId ?? '', config?.pinned ?? [])}
                onPress={app =>
                    onAppPress(selectedDevice?.ip ?? '', app.id)
                }
            />
        </View>
    );
}
