import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { rokuPreferencesService } from '../services/roku-preferences.service';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useContextMenu } from '@src/shared/context/ContextMenu';
import { getAppIconCached } from '../services/roku-apps.service';
import { useToast } from '@src/shared/context/ToastContext';
import { RokuApp } from '../interfaces/roku-app.interface';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { AppItem } from '../components/AppItem';
import { useCallback, memo } from 'react';
import { t } from 'i18next';
import { getContextMenuPreviewTileSize } from '@src/config/theme/utils/normalize-size';

/** Square hero tile so aspectRatio + borderRadius match the Smart Hub grid, without selection ring. */
const ContextMenuAppPreview = memo(function ContextMenuAppPreview({
    app,
    deviceId,
    deviceIp,
}: {
    app: RokuApp;
    deviceId: string;
    deviceIp: string;
}) {
    const { width: winW, height: winH } = useWindowDimensions();
    const size = getContextMenuPreviewTileSize(winW, winH);

    return (
        <View pointerEvents="none" style={[styles.previewWrap, { width: size, height: size }]}>
            <AppItem
                appId={app.id}
                name={app.name}
                deviceId={deviceId}
                deviceIp={deviceIp}
                compact
                appType={app.type}
                version={app.version}
            />
        </View>
    );
});

export function useRokuAppMenu() {
    const { open } = useContextMenu<RokuApp>();
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);

    const { show: showToast } = useToast();

    const openMenu = useCallback((app: RokuApp) => {
        if (!selectedDevice) return;

        const deviceId = selectedDevice.deviceId;
        const appIcon = getAppIconCached(deviceId, app.id, selectedDevice.ip);
        const deviceConfig = useAppCustomizationStore
            .getState()
            .getDeviceConfig(deviceId);

        const isFavorite = rokuPreferencesService.existsInList(deviceConfig?.favorites ?? [], app.id);
        const isPinned = rokuPreferencesService.existsInList(deviceConfig?.pinned ?? [], app.id);
        const isHidden = rokuPreferencesService.existsInList(deviceConfig?.hidden ?? [], app.id);

        open({
            payload: app,
            renderTarget: () => (
                <ContextMenuAppPreview
                    app={app}
                    deviceId={selectedDevice.deviceId}
                    deviceIp={selectedDevice.ip}
                />
            ),
            actions: [
                {
                    key: 'favorite',
                    label: isFavorite ? t('smartHub.context.favorite.remove') : t('smartHub.context.favorite.add'),
                    icon: isFavorite ? 'star' : 'star-outline',
                    onPress: () => {
                        rokuPreferencesService.toggleFavorite(deviceId, app);
                        showToast({
                            type: isFavorite ? 'medium' : 'success',
                            title: t(`smartHub.context.toast.favorites.${isFavorite ? 'removed' : 'added'}.title`),
                            subtitle: t(`smartHub.context.toast.favorites.${isFavorite ? 'removed' : 'added'}.subtitle`, {
                                app: app.name,
                            }),
                            iconSource: appIcon ? { uri: appIcon } : undefined,
                        });
                    },
                },
                {
                    key: 'pin',
                    label: isPinned ? t('smartHub.context.pin.remove') : t('smartHub.context.pin.add'),
                    icon: isPinned ? 'pin' : 'pin-outline',
                    disabled: !isPinned && deviceConfig.pinned.length >= 5,
                    onPress: () => {
                        rokuPreferencesService.togglePinned(deviceId, app);
                        showToast({
                            type: isPinned ? 'medium' : 'success',
                            title: t(`smartHub.context.toast.pinned.${isPinned ? 'removed' : 'added'}.title`),
                            subtitle: t(`smartHub.context.toast.pinned.${isPinned ? 'removed' : 'added'}.subtitle`, {
                                app: app.name,
                            }),
                            iconSource: appIcon ? { uri: appIcon } : undefined,
                        });
                    },
                },
                {
                    key: 'hide',
                    label: isHidden ? t('smartHub.context.hide.remove') : t('smartHub.context.hide.add'),
                    icon: isHidden ? 'eye' : 'eye-off',
                    destructive: !isHidden,
                    onPress: () => {
                        rokuPreferencesService.toggleHidden(deviceId, app);
                        showToast({
                            type: isHidden ? 'info' : 'dark',
                            title: t(`smartHub.context.toast.hidden.${isHidden ? 'removed' : 'added'}.title`),
                            subtitle: t(`smartHub.context.toast.hidden.${isHidden ? 'removed' : 'added'}.subtitle`, {
                                app: app.name,
                            }),
                            actionButton: [
                                {
                                    label: t('components.toast.restore'),
                                    onPress: (closeToast) => {
                                        rokuPreferencesService.toggleHidden(deviceId, app);
                                        closeToast();
                                        showToast({
                                            type: 'success',
                                            title: t(`smartHub.context.toast.hidden.${isHidden ? 'added' : 'removed'}.title`),
                                            subtitle: t(`smartHub.context.toast.hidden.${isHidden ? 'added' : 'removed'}.subtitle`, {
                                                app: app.name,
                                            }),
                                            iconSource: appIcon ? { uri: appIcon } : undefined,
                                        });
                                    }
                                }
                            ],
                            iconSource: appIcon ? { uri: appIcon } : undefined,
                            iconBlurRadius: isHidden ? 0 : 10,
                        });
                    },
                },
            ],
        });
    }, [selectedDevice, open, showToast]);

    return {
        openMenu
    };
}

const styles = StyleSheet.create({
    previewWrap: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});