import { TFunction } from 'i18next';
import { RokuApp } from '../interfaces/roku-app.interface';
import { SmartHubSectionType } from '../interfaces/section.types';
import { classifyRokuApp } from './app-clasifier';

export function buildAppsSections(
    apps: RokuApp[],
    t: TFunction
): SmartHubSectionType[] {
    const buckets: Record<'inputs' | 'system' | 'apps', RokuApp[]> = {
        inputs: [],
        system: [],
        apps: [],
    };

    for (const app of apps) {
        const category = classifyRokuApp(app);
        if (!category) continue;
        buckets[category].push(app);
    }

    const sections: SmartHubSectionType[] = [
        {
            type: 'apps',
            title: t('smartHub.sections.inputs.title'),
            subtitle: t('smartHub.sections.inputs.subtitle'),
            iconName: 'tv',
            data: buckets.inputs,
            scrollType: 'vertical',
        },
        {
            type: 'apps',
            title: t('smartHub.sections.apps.title'),
            subtitle: t('smartHub.sections.apps.subtitle'),
            iconName: 'play',
            data: buckets.apps,
            scrollType: 'vertical',
        },
        {
            type: 'apps',
            title: t('smartHub.sections.system.title'),
            subtitle: t('smartHub.sections.system.subtitle'),
            iconName: 'settings',
            data: buckets.system,
            scrollType: 'vertical',
        },
    ];

    return sections.filter(s => s.data.length > 0);
}
