import { RokuApp } from '../interfaces/roku-app.interface';
import { SmartHubSectionType } from '../interfaces/section.types';
import { classifyRokuApp } from './app-clasifier';

export function buildAppsSections(apps: RokuApp[]): SmartHubSectionType[] {
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
            title: 'Entradas',
            subtitle: 'HDMI, TV y fuentes externas',
            iconName: 'tv',
            data: buckets.inputs,
            scrollType: 'vertical',
        },
        {
            type: 'apps',
            title: 'Entretenimiento',
            subtitle: 'Series, películas, música y streaming',
            iconName: 'play',
            data: buckets.apps,
            scrollType: 'vertical',
        },
        {
            type: 'apps',
            title: 'Sistema',
            subtitle: 'Configuración y servicios del Roku',
            iconName: 'settings',
            data: buckets.system,
            scrollType: 'vertical',
        },
    ];

    return sections.filter(s => s.data.length > 0);
}
