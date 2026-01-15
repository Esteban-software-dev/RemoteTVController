import { AppCategory } from '../constants/app-category.constant';
import { RokuApp } from '../interfaces/roku-app.interface';

const INPUT_NAMES = [
    'hdmi',
    'av',
    'tv',
    'live',
    'en vivo',
];

export function classifyRokuApp(app: RokuApp): AppCategory | null {
    if (!app.isLaunchable) return null;
    if (app.type === 'screensaver') return null;

    const name = app.name.toLowerCase();

    if (
        app.isSystem &&
        app.type === 'menu' &&
        INPUT_NAMES.some(k => name.includes(k))
    ) {
        return 'inputs';
    }

    if (app.isSystem || app.type === 'menu') {
        return 'system';
    }

    return 'apps';
}