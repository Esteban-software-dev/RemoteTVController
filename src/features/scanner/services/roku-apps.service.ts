import { ROKU_API } from '@src/shared/constants/roku-endpoints.const';

export async function launchRokuApp(ip: string, appId: string): Promise<void> {
    if (!ip || !appId) return;
    try {
        await fetch(
            `${ROKU_API.BASE_URL(ip)}${ROKU_API.LAUNCH.APP(appId)}`,
            { method: 'POST' }
        );
    } catch (error) {}
}

export function getAppIcon(ip: string, appId: string): string {
    if (!ip || !appId) return '';

    return `${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.ICON(appId)}`;
}