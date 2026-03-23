import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorageService = {
    getItem(key: string) {
        return AsyncStorage.getItem(key);
    },

    setItem(key: string, value: string) {
        return AsyncStorage.setItem(key, value);
    },

    removeItem(key: string) {
        return AsyncStorage.removeItem(key);
    },

    async getJson<T>(key: string): Promise<T | null> {
        try {
            const rawValue = await AsyncStorage.getItem(key);

            if (!rawValue) {
                return null;
            }

            return JSON.parse(rawValue) as T;
        } catch {
            await AsyncStorage.removeItem(key);
            return null;
        }
    },

    setJson<T>(key: string, value: T) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    },
};
