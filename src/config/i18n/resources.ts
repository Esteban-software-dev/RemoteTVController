import { emptyListResources } from '@src/features/scanner/i18n/components.i18n';
import { hiddenAppsResources } from '@src/features/scanner/i18n/hidden-apps.i18n';
import { smartHubResources } from '@src/features/scanner/i18n/smarthub.i18n';
import { tvScannerResources } from '@src/features/scanner/i18n/tv-scanner.i18n';
import { settingsResources } from '@src/features/settings/i18n/settings.i18n';
import { navigatorResources } from '@src/navigation/i18n/navigator.i18n';

export const resources = {
    es: {
        translation: {
            ...hiddenAppsResources.es.translation,
            ...smartHubResources.es.translation,
            ... emptyListResources.es.translation,
            ... tvScannerResources.es.translation,
            ... settingsResources.es.translation,
            ... navigatorResources.es.translation,
        },
    },
    en: {
        translation: {
            ...hiddenAppsResources.en.translation,
            ...smartHubResources.en.translation,
            ... emptyListResources.en.translation,
            ... tvScannerResources.en.translation,
            ... settingsResources.en.translation,
            ... navigatorResources.en.translation,
        },
    },
} as const;

export type AppLanguages = keyof typeof resources;
