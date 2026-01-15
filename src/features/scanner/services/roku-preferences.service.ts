import { RokuApp } from '../interfaces/roku-app.interface';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';

export const rokuPreferencesService = {
    existsInList(list: RokuApp[], appId: string): boolean {
        return list.some(app => app.id === appId);
    },
    
    toggleFavorite(deviceId: string, app: RokuApp) {
        const { getDeviceConfig, addFavorite, removeFavorite } = useAppCustomizationStore.getState();
    
        const { favorites } = getDeviceConfig(deviceId);
    
        this.existsInList(favorites, app.id)
            ? removeFavorite(deviceId, app.id)
            : addFavorite(deviceId, app);
    },
    
    togglePinned(deviceId: string, app: RokuApp) {
        const { getDeviceConfig, pinApp, unpinApp } = useAppCustomizationStore.getState();
    
        const { pinned } = getDeviceConfig(deviceId);
    
        this.existsInList(pinned, app.id)
            ? unpinApp(deviceId, app.id)
            : pinApp(deviceId, app);
    },
    
    toggleHidden(deviceId: string, app: RokuApp) {
        const { getDeviceConfig, hideApp, showApp } = useAppCustomizationStore.getState();
    
        const { hidden } = getDeviceConfig(deviceId);
    
        this.existsInList(hidden, app.id)
            ? showApp(deviceId, app.id)
            : hideApp(deviceId, app);
    },
};
