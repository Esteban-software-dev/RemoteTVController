import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types'
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface'
import { ActiveApp } from '@src/features/scanner/interfaces/active-app.interface'

type RokuSessionStore = {
    selectedDevice: RokuDeviceInfo | null;
    activeApp: ActiveApp | null;
    apps: RokuApp[] | null;
    isOnline: boolean;
    isLoading: boolean;

    selectDevice: (device: RokuDeviceInfo) => void;
    setActiveApp: (app: ActiveApp) => void;
    setApps: (apps: RokuApp[]) => void;
    clearSession: () => void;
}

export const useRokuSessionStore = create<RokuSessionStore>()(
    persist(
        (set) => ({
            selectedDevice: null,
            activeApp: null,
            apps: null,
            isOnline: false,
            isLoading: false,

            selectDevice: (device) =>
                set({
                    selectedDevice: device,
                    apps: null,
                    isOnline: true,
                }),

            setActiveApp: (app) => set({activeApp: app}),

            setApps: (apps) => set({ apps }),

            clearSession: () =>
                set({
                    selectedDevice: null,
                    apps: null,
                    isOnline: false,
                    isLoading: false,
                }),
        }),
        {
            name: 'roku-session',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
