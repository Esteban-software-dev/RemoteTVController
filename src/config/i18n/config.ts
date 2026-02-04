import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { AppLanguages } from './resources';

export const LANG_STORAGE_KEY = '@app_language';

export const getDeviceLanguage = () => {
    const locales = RNLocalize.getLocales();
    return locales[0]?.languageCode ?? 'en';
};

export const languageDetector = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
        const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
        callback(stored ?? getDeviceLanguage());
    },
    init: () => {},
    cacheUserLanguage: async (lang: string) => {
        await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
    },
};

export const changeLanguage = async (lang: AppLanguages) => {
    await i18n.changeLanguage(lang);
};