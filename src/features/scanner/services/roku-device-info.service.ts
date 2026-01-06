import { XMLParser } from 'fast-xml-parser';
import { RokuApp } from '../interfaces/roku-app.interface';
import { ROKU_API } from '@src/shared/constants/roku-endpoints.const';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    trimValues: true,
});

export const fetchRokuDeviceInfo = async (
    ip: string
): Promise<any> => {
    const response = await fetch(`${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.DEVICE_INFO}`);
    const xml = await response.text();

    const json = parser.parse(xml)['device-info'];

    return {
        friendlyDeviceName: json['friendly-device-name'],
        modelName: json['model-name'],
        serialNumber: json['serial-number'],
        softwareVersion: json['software-version'],
    };
};

export const fetchSelectedRokuApps = async (ip: string): Promise<RokuApp[] | undefined> => {
    try {
        const response = await fetch(`${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.APPS}`);
        const xml = await response.text();
    
        const parsed = parser.parse(xml);
    
        const rawApps = parsed?.apps?.app;
    
        if (!rawApps) return [];
    
        const appsArray = Array.isArray(rawApps) ? rawApps : [rawApps];
    
        return appsArray.map((app: any): RokuApp => ({
            id: app.id,
            name: app['#text'] ?? 'Unknown',
            type: app.type,
            version: app.version,
            isSystem: isSystemApp(app),
            isLaunchable: app.type === 'appl',
        }));
    } catch (error) {}
};

const SYSTEM_APP_IDS = new Set([
    '151908',
    '184661',
    '683311',
]);

const isSystemApp = (app: any): boolean => {
    if (SYSTEM_APP_IDS.has(app.id)) return true;

    const name = (app['#text'] || '').toLowerCase();
    return (
        name.includes('roku') ||
        name.includes('guía') ||
        name.includes('channel')
    );
};
