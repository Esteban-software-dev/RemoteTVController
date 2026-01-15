import { useCallback } from 'react';
import { useContextMenu } from '@src/shared/context/ContextMenu';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { RokuApp } from '../interfaces/roku-app.interface';
import { rokuPreferencesService } from '../services/roku-preferences.service';
import { AppItem } from '../components/AppItem';
import { getAppIconCached } from '../services/roku-apps.service';


export function useRokuAppMenu() {
    const { open } = useContextMenu<RokuApp>();
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);

    const openMenu = useCallback((app: RokuApp) => {
        if (!selectedDevice) return;

        const deviceId = selectedDevice.deviceId;
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
                    label: isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos',
                    icon: isFavorite ? 'star' : 'star-outline',
                    onPress: () => rokuPreferencesService.toggleFavorite(deviceId, app),
                },
                {
                    key: 'pin',
                    label: isPinned ? 'Desanclar app' : 'Anclar app',
                    icon: isPinned ? 'pin' : 'pin-outline',
                    disabled: !isPinned && deviceConfig.pinned.length >= 5,
                    onPress: () => rokuPreferencesService.togglePinned(deviceId, app),
                },
                {
                    key: 'hide',
                    label: isHidden ? 'Mostrar app' : 'Ocultar app',
                    icon: isHidden ? 'eye' : 'eye-off',
                    destructive: !isHidden,
                    onPress: () => rokuPreferencesService.toggleHidden(deviceId, app),
                },
            ],
        });
    }, [selectedDevice]);

    return {
        openMenu
    };
}
