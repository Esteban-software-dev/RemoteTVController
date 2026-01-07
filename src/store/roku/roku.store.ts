import { create } from 'zustand';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';

type RokuStore = {
    devices: RokuDeviceInfo[];
    setDevice: (device: RokuDeviceInfo) => void;
    clearDevices: () => void;
};

export const useRokuStore = create<RokuStore>((set, get) => ({
    devices: [],

    setDevice: (device) => {
        const exists = get().devices.some(d => d.ip === device.ip);
        if (exists) return;

        set(state => ({
            devices: [...state.devices, device],
        }));
    },

    clearDevices: () => set({ devices: [] }),
}));
