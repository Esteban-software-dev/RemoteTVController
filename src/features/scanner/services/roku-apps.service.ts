import { ROKU_API } from '@src/shared/constants/roku-endpoints.const';
const iconCache = new Map<string, string>();

export async function powerRokuDevice(ip: string) {
    try {
        await fetch(
            `${ROKU_API.BASE_URL(ip)}${ROKU_API.KEY_PRESS.POWER}`,
            { method: 'POST' }
        );
    } catch (error) {}
}

export async function launchRokuApp(ip: string, appId: string): Promise<boolean> {
    if (!ip || !appId) return false;
    try {
        const response = await fetch(
            `${ROKU_API.BASE_URL(ip)}${ROKU_API.LAUNCH.APP(appId)}`,
            { method: 'POST' }
        );

        return response.ok;
    } catch (error) {
        return false;
    }
}

export function getAppIconCached(
    deviceId: string,
    appId: string,
    ip?: string
) {
    const key = `${deviceId}:${appId}`;

    if (iconCache.has(key)) {
        return iconCache.get(key)!;
    }

    if (!ip) return '';

    const url = `http://${ip}:8060/query/icon/${appId}`;

    iconCache.set(key, url);
    return url;
}
