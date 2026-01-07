import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types'
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface'

type RokuSessionStore = {
    selectedDevice: RokuDeviceInfo | null;
    apps: RokuApp[] | null;
    isOnline: boolean;
    isLoading: boolean;

    selectDevice: (device: RokuDeviceInfo) => void;
    setApps: (apps: RokuApp[]) => void;
    clearSession: () => void;
}

export const useRokuSessionStore = create<RokuSessionStore>()(
    persist(
        (set) => ({
            selectedDevice: null,
            apps: null,
            isOnline: false,
            isLoading: false,

            selectDevice: (device) =>
                set({
                    selectedDevice: device,
                    apps: null,
                    isOnline: true,
                }),

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
