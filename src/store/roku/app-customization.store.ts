import AsyncStorage from '@react-native-async-storage/async-storage';
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import { SmartHubSectionType } from '@src/features/scanner/interfaces/section.types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type DeviceAppCustomization = {
    pinned: RokuApp[];
    favorites: RokuApp[];
    hidden: RokuApp[];

    layout: {
        pinned: 'grid' | 'list';
        favorites: 'grid' | 'carousel';
    };
};

type AppCustomizationStore = {
    byDevice: Record<string, DeviceAppCustomization>;

    getDeviceConfig: (deviceId: string) => DeviceAppCustomization;

    pinApp: (deviceId: string, app: RokuApp) => void;
    unpinApp: (deviceId: string, appId: string) => void;

    addFavorite: (deviceId: string, app: RokuApp) => void;
    removeFavorite: (deviceId: string, appId: string) => void;

    hideApp: (deviceId: string, app: RokuApp) => void;
    showApp: (deviceId: string, appId: string) => void;

    setLayout: (
        deviceId: string,
        section: Exclude<SmartHubSectionType['type'], 'recent' | 'apps'>,
        layout: DeviceAppCustomization['layout'][keyof DeviceAppCustomization['layout']]
    ) => void;

    clearDeviceConfig: (deviceId: string) => void;
};

const defaultDeviceConfig = {
    pinned: [],
    favorites: [],
    hidden: [],
    layout: {
        pinned: 'grid',
        favorites: 'grid',
    },
};


const upsertById = (list: RokuApp[], app: RokuApp) => {
    const exists = list.some(item => item.id === app.id);
    return exists
        ? list.map(item => (item.id === app.id ? app : item))
        : [...list, app];
};

export const useAppCustomizationStore = create<AppCustomizationStore>()(
    persist(
        (set, get) => ({
            byDevice: {},

            getDeviceConfig: (deviceId) =>
                get().byDevice[deviceId] ?? defaultDeviceConfig,

            pinApp: (deviceId, app) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                            ...state.byDevice,
                            [deviceId]: {
                                ...device,
                                pinned: upsertById(device.pinned, app),
                            },
                        },
                    };
                }),

            unpinApp: (deviceId, appId) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            pinned: device.pinned.filter(app => app.id !== appId),
                        },
                        },
                    };
                }),

            addFavorite: (deviceId, app) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            favorites: upsertById(device.favorites, app),
                        },
                        },
                    };
                }),

            removeFavorite: (deviceId, appId) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            favorites: device.favorites.filter(app => app.id !== appId),
                        },
                        },
                    };
                }),

            hideApp: (deviceId, app) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            hidden: upsertById(device.hidden, app),
                        },
                        },
                    };
                }),

            showApp: (deviceId, appId) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            hidden: device.hidden.filter(app => app.id !== appId),
                        },
                        },
                    };
                }),

            setLayout: (deviceId, section, layout) =>
                set(state => {
                    const device = state.byDevice[deviceId] ?? defaultDeviceConfig;

                    return {
                        byDevice: {
                        ...state.byDevice,
                        [deviceId]: {
                            ...device,
                            layout: {
                            ...device.layout,
                            [section]: layout,
                            },
                        },
                        },
                    };
                }),

            clearDeviceConfig: (deviceId) =>
                set(state => {
                    const { [deviceId]: _, ...rest } = state.byDevice;
                    return { byDevice: rest };
                }),
        }),
        {
            name: 'app-customization',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
