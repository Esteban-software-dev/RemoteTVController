import { ActiveApp } from '@src/features/scanner/interfaces/active-app.interface';
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import { SmartHubSectionType } from '@src/features/scanner/interfaces/section.types';
import { asyncStorageService } from '@src/shared/services/async-storage.service';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';

const ROKU_SESSION_STORAGE_KEY = 'roku-session';
const APP_CUSTOMIZATION_STORAGE_KEY = 'app-customization';

export type DeviceAppCustomization = {
    pinned: RokuApp[];
    favorites: RokuApp[];
    hidden: RokuApp[];
    layout: {
        pinned: 'grid' | 'list';
        favorites: 'grid' | 'carousel';
    };
};

export type DeviceAppCustomizationLayoutSection = Exclude<
    SmartHubSectionType['type'],
    'recent' | 'apps'
>;

export type RokuSessionPersistedState = {
    selectedDevice: RokuDeviceInfo | null;
    activeApp: ActiveApp | null;
    apps: RokuApp[] | null;
    isOnline: boolean;
    isLoading: boolean;
};

export type AppCustomizationPersistedState = {
    byDevice: Record<string, DeviceAppCustomization>;
};

export const createDefaultDeviceConfig = (): DeviceAppCustomization => ({
    pinned: [],
    favorites: [],
    hidden: [],
    layout: {
        pinned: 'grid',
        favorites: 'grid',
    },
});

export const rokuStorageService = {
    loadSession() {
        return asyncStorageService.getJson<RokuSessionPersistedState>(ROKU_SESSION_STORAGE_KEY);
    },

    saveSession(session: RokuSessionPersistedState) {
        return asyncStorageService.setJson(ROKU_SESSION_STORAGE_KEY, session);
    },

    clearSession() {
        return asyncStorageService.removeItem(ROKU_SESSION_STORAGE_KEY);
    },

    loadAppCustomization() {
        return asyncStorageService.getJson<AppCustomizationPersistedState>(APP_CUSTOMIZATION_STORAGE_KEY);
    },

    saveAppCustomization(customization: AppCustomizationPersistedState) {
        return asyncStorageService.setJson(APP_CUSTOMIZATION_STORAGE_KEY, customization);
    },

    clearAppCustomization() {
        return asyncStorageService.removeItem(APP_CUSTOMIZATION_STORAGE_KEY);
    },
};
