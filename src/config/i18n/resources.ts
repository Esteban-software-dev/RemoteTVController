import { hiddenAppsResources } from '@src/features/scanner/i18n/hidden-apps.i18n';

export const resources = {
    ...hiddenAppsResources,
} as const;

export type AppLanguages = keyof typeof resources;
