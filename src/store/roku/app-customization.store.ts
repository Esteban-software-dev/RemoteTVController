import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import { create } from 'zustand';
import {
    createDefaultDeviceConfig,
    DeviceAppCustomization,
    DeviceAppCustomizationLayoutSection,
    rokuStorageService,
} from './roku-storage.service';

type AppCustomizationStore = {
    byDevice: Record<string, DeviceAppCustomization>;
    isHydrated: boolean;

    hydrate: () => Promise<void>;
    getDeviceConfig: (deviceId: string) => DeviceAppCustomization;

    pinApp: (deviceId: string, app: RokuApp) => void;
    unpinApp: (deviceId: string, appId: string) => void;

    addFavorite: (deviceId: string, app: RokuApp) => void;
    removeFavorite: (deviceId: string, appId: string) => void;

    hideApp: (deviceId: string, app: RokuApp) => void;
    showApp: (deviceId: string, appId: string) => void;

    setLayout: (
        deviceId: string,
        section: DeviceAppCustomizationLayoutSection,
        layout: DeviceAppCustomization['layout'][keyof DeviceAppCustomization['layout']]
    ) => void;

    clearDeviceConfig: (deviceId: string) => void;
};

const upsertById = (list: RokuApp[], app: RokuApp) => {
    const exists = list.some(item => item.id === app.id);
    return exists
        ? list.map(item => (item.id === app.id ? app : item))
        : [...list, app];
};

export const useAppCustomizationStore = create<AppCustomizationStore>()((set, get) => ({
    byDevice: {},
    isHydrated: false,

    hydrate: async () => {
        const storedState = await rokuStorageService.loadAppCustomization();

        set({
            byDevice: storedState?.byDevice ?? {},
            isHydrated: true,
        });
    },

    getDeviceConfig: (deviceId) =>
        get().byDevice[deviceId] ?? createDefaultDeviceConfig(),

    pinApp: (deviceId, app) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    pinned: upsertById(device.pinned, app),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    unpinApp: (deviceId, appId) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    pinned: device.pinned.filter(app => app.id !== appId),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    addFavorite: (deviceId, app) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    favorites: upsertById(device.favorites, app),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    removeFavorite: (deviceId, appId) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    favorites: device.favorites.filter(app => app.id !== appId),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    hideApp: (deviceId, app) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    hidden: upsertById(device.hidden, app),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    showApp: (deviceId, appId) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    hidden: device.hidden.filter(app => app.id !== appId),
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    setLayout: (deviceId, section, layout) =>
        set(state => {
            const device = state.byDevice[deviceId] ?? createDefaultDeviceConfig();
            const byDevice = {
                ...state.byDevice,
                [deviceId]: {
                    ...device,
                    layout: {
                        ...device.layout,
                        [section]: layout,
                    },
                },
            };

            void rokuStorageService.saveAppCustomization({ byDevice });

            return { byDevice };
        }),

    clearDeviceConfig: (deviceId) =>
        set(state => {
            const { [deviceId]: _, ...rest } = state.byDevice;

            if (Object.keys(rest).length === 0) {
                void rokuStorageService.clearAppCustomization();
            } else {
                void rokuStorageService.saveAppCustomization({ byDevice: rest });
            }

            return { byDevice: rest };
        }),
}));
