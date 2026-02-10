import {
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { radius, spacing } from '@src/config/theme/tokens';
import { AppBackground } from '@src/shared/components/AppBackground';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { useAppBarPadding } from '@src/navigation/hooks/useAppbarPadding';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { ActionItem } from '../components/HiddenAppItem';
import { AppIcon } from '../components/AppIcon';
import { useMemo, useState } from 'react';
import { CollapsibleSearchBar } from '@src/shared/components/CollapsibleSearchBar';
import { EmptyList } from '../components/EmptyList';
import { useTranslation } from 'react-i18next';
import { useToast } from '@src/shared/context/ToastContext';
import { getAppIconCached, launchRokuApp } from '../services/roku-apps.service';
import { useAlert } from '@src/shared/context/AlertContext';
import { RokuApp } from '../interfaces/roku-app.interface';
import { colors } from '@src/config/theme/colors/colors';
import { fetchActiveRokuApp } from '../services/roku-device-info.service';
import { ActiveApp } from '../interfaces/active-app.interface';

export function HiddenApps() {
    const { appBarHeight } = useAppBarPadding();
    const { t } = useTranslation();
    const { show: showToast } = useToast();
    const { show: showAlert } = useAlert();

    const deviceId = useRokuSessionStore(s => s.selectedDevice?.deviceId);
    const deviceIp = useRokuSessionStore(s => s.selectedDevice?.ip);
    const setActiveApp = useRokuSessionStore(s => s.setActiveApp);
    const config = useAppCustomizationStore(s => deviceId ? s.byDevice[deviceId] : null);
    const showApp = useAppCustomizationStore(s => s.showApp);
    const hideApp = useAppCustomizationStore(s => s.hideApp);

    const [query, setQuery] = useState<string>('');

    const filteredHidden = useMemo(() => {
        const list = config?.hidden ?? [];
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter(item => item.name.toLowerCase().includes(q));
    }, [config?.hidden, query]);

    const handleRestore = async (app: RokuApp) => {
        if (!deviceIp) return;
        const appIcon = getAppIconCached(deviceId ?? '', app.id, deviceIp);
        showApp(deviceId ?? '', app.id);
        showToast({
            type: 'medium',
            title: t(`smartHub.context.toast.hidden.removed.title`),
            subtitle: t(`smartHub.context.toast.hidden.removed.subtitle`, {
                app: app.name,
            }),
            iconSource: appIcon ? { uri: appIcon } : undefined,
            showCloseButton: false,
            actionButton: [
                {
                    iconName: 'arrow-undo',
                    onPress: (closeToast) => {
                        hideApp(deviceId ?? '', app);
                        closeToast();
                        showToast({
                            type: 'dark',
                            title: t(`smartHub.context.toast.hidden.added.title`),
                            subtitle: t(`smartHub.context.toast.hidden.added.subtitle`, {
                                app: app.name,
                            }),
                            iconSource: appIcon ? { uri: appIcon } : undefined,
                        });
                    }
                }
            ]
        });
    }

    const handlePressHiddenApp = (appId: string) => {
        showAlert({
            title: t('hiddenApps.alert.openHidden.title'),
            message: t('hiddenApps.alert.openHidden.message'),
            iconName: 'alert-circle',
            iconColor: colors.state.danger,
            buttons: [
                {
                    label: t('hiddenApps.alert.openHidden.cancel'),
                    role: 'cancel',
                },
                {
                    label: t('hiddenApps.alert.openHidden.confirm'),
                    role: 'destructive',
                    onPress: async () => {
                        await launchRokuApp(deviceIp ?? '', appId);
                        const launchedApp = await fetchActiveRokuApp(deviceIp ?? '');
                        setActiveApp(launchedApp ?? ({} as ActiveApp));
                    },
                },
            ],
        });
    }

    return (
        <View
        style={[
            globalStyles.container,
            globalStyles.horizontalAppPadding,
        ]}>
            <AppBackground />
            <FlatList
                contentContainerStyle={{
                    paddingTop: appBarHeight,
                    paddingBottom: spacing.md,
                }}
                ListHeaderComponent={
                    <View style={{ marginBottom: spacing.md }}>
                        <SectionHeader
                            title={t('hiddenApps.header.title')}
                            subtitle={t('hiddenApps.header.subtitle')}
                        />
                        <CollapsibleSearchBar
                            value={query}
                            onChange={setQuery}
                            placeholder={t('hiddenApps.search.placeholder')}
                            collapsible
                        />
                    </View>
                }
                data={filteredHidden}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.appItemWrapper}>
                        <ActionItem
                            id={item.id}
                            title={`${index + 1}. ${item.name}`}
                            subtitle={t('hiddenApps.list.itemSubtitle')}
                            onPress={() => handlePressHiddenApp(item.id)}
                            icon={
                                <AppIcon
                                    appId={item.id}
                                    name={item.name}
                                    style={{ width: '90%', height: '90%', borderRadius: radius.sm }}
                                />
                            }
                            actionLabel={t('hiddenApps.list.restoreAction')}
                            onAction={() => {
                                showAlert({
                                    title: t('hiddenApps.alert.restore.title', {appName: item.name}),
                                    message: t('hiddenApps.alert.restore.message'),
                                    iconName: 'alert-circle',
                                    iconColor: colors.state.danger,
                                    buttons: [
                                        {
                                            label: t('hiddenApps.alert.restore.cancel'),
                                            role: 'cancel',
                                        },
                                        {
                                            label: t('hiddenApps.alert.restore.confirm'),
                                            role: 'destructive',
                                            onPress: () => handleRestore(item)
                                        },
                                    ],
                                    backdropDismiss: true
                                });
                            }}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={globalStyles.emptyContainer}>
                        <EmptyList
                            title={t('hiddenApps.empty.title')}
                            subtitle={t('hiddenApps.empty.description')}
                        />
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    appItemWrapper: {
        marginVertical: spacing.xs,
    },
});
