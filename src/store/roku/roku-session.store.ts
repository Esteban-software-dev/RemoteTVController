import { create } from 'zustand'
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types'
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface'

type RokuSessionStore = {
    selectedDevice: RokuDeviceInfo | null

    apps: RokuApp[] | null
    isOnline: boolean
    isLoading: boolean

    selectDevice: (device: RokuDeviceInfo) => void
    clearSession: () => void
}

export const useRokuSessionStore = create<RokuSessionStore>((set) => ({
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
    clearSession: () =>
        set({
            selectedDevice: null,
            apps: null,
            isOnline: false,
            isLoading: false,
        }),
}))
