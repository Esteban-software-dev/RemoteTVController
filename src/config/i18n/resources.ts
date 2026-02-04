export const resources = {
    es: {
        translation: {},
    },
    en: {
        translation: {},
    },
} as const;

export type AppLanguages = keyof typeof resources;
