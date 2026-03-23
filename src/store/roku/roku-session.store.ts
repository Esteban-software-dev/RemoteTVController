import { create } from 'zustand';
import {
    RokuSessionPersistedState,
    rokuStorageService,
} from './roku-storage.service';

type RokuSessionStore = RokuSessionPersistedState & {
    isHydrated: boolean;

    hydrate: () => Promise<void>;
    selectDevice: (device: NonNullable<RokuSessionPersistedState['selectedDevice']>) => void;
    setActiveApp: (app: NonNullable<RokuSessionPersistedState['activeApp']>) => void;
    setApps: (apps: NonNullable<RokuSessionPersistedState['apps']>) => void;
    clearSession: () => void;
};

const defaultSessionState: RokuSessionPersistedState = {
    selectedDevice: null,
    activeApp: null,
    apps: null,
    isOnline: false,
    isLoading: false,
};

const persistSession = (session: RokuSessionPersistedState) =>
    rokuStorageService.saveSession(session);

export const useRokuSessionStore = create<RokuSessionStore>()((set) => ({
    ...defaultSessionState,
    isHydrated: false,

    hydrate: async () => {
        const storedState = await rokuStorageService.loadSession();

        set({
            ...defaultSessionState,
            ...storedState,
            isHydrated: true,
        });
    },

    selectDevice: (device) =>
        set(state => {
            const nextState = {
                ...state,
                selectedDevice: device,
                apps: null,
                isOnline: true,
            };

            void persistSession({
                selectedDevice: nextState.selectedDevice,
                activeApp: nextState.activeApp,
                apps: nextState.apps,
                isOnline: nextState.isOnline,
                isLoading: nextState.isLoading,
            });

            return nextState;
        }),

    setActiveApp: (app) =>
        set(state => {
            const nextState = {
                ...state,
                activeApp: app,
            };

            void persistSession({
                selectedDevice: nextState.selectedDevice,
                activeApp: nextState.activeApp,
                apps: nextState.apps,
                isOnline: nextState.isOnline,
                isLoading: nextState.isLoading,
            });

            return nextState;
        }),

    setApps: (apps) =>
        set(state => {
            const nextState = {
                ...state,
                apps,
            };

            void persistSession({
                selectedDevice: nextState.selectedDevice,
                activeApp: nextState.activeApp,
                apps: nextState.apps,
                isOnline: nextState.isOnline,
                isLoading: nextState.isLoading,
            });

            return nextState;
        }),

    clearSession: () => {
        void rokuStorageService.clearSession();
        set({
            ...defaultSessionState,
            isHydrated: true,
        });
    },
}));
