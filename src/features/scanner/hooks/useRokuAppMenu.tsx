import { useCallback } from 'react';
import { useContextMenu } from '@src/shared/context/ContextMenu';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { RokuApp } from '../interfaces/roku-app.interface';
import { rokuPreferencesService } from '../services/roku-preferences.service';
import { AppItem } from '../components/AppItem';
import { getAppIconCached } from '../services/roku-apps.service';
import { useToast } from '@src/shared/context/ToastContext';
import { t } from 'i18next';
import { AppIcon } from '../components/AppIcon';


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
                <AppItem
                    appId={app.id}
                    name={app.name}
                    selected
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
                                        })
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
    }, [selectedDevice]);

    return {
        openMenu
    };
}
