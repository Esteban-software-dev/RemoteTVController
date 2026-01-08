import { XMLParser } from 'fast-xml-parser';
import { RokuApp } from '../interfaces/roku-app.interface';
import { ROKU_API } from '@src/shared/constants/roku-endpoints.const';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { ActiveApp } from '../interfaces/active-app.interface';

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    trimValues: true,
});

export const fetchRokuDeviceInfo = async (
    ip: string
): Promise<RokuDeviceInfo> => {
    const response = await fetch(`${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.DEVICE_INFO}`);
    const xml = await response.text();
    const raw = parser.parse(xml)['device-info'];

    return {
        ip,
        lastSeenAt: Date.now(),
    
        udn: raw.udn,
        serialNumber: raw['serial-number'],
        deviceId: raw['device-id'],
        advertisingId: raw['advertising-id'],
    
        userProfileType: raw['user-profile-type'],
        vendorName: raw['vendor-name'],
    
        modelName: raw['model-name'],
        modelNumber: raw['model-number'],
        modelRegion: raw['model-region'],
        isTv: Boolean(raw['is-tv']),
        isStick: Boolean(raw['is-stick']),
    
        screenSize: Number(raw['screen-size']),
        panelId: Number(raw['panel-id']),
    
        uiResolution: raw['ui-resolution'],
        tunerType: raw['tuner-type'],
    
        supportsEthernet: Boolean(raw['supports-ethernet']),
        wifiMac: raw['wifi-mac'],
        wifiDriver: raw['wifi-driver'],
        hasWifi5GSupport: Boolean(raw['has-wifi-5G-support']),
    
        networkType: raw['network-type'],
        networkName: raw['network-name'],
    
        friendlyDeviceName: raw['friendly-device-name'],
        friendlyModelName: raw['friendly-model-name'],
        defaultDeviceName: raw['default-device-name'],
        userDeviceName: raw['user-device-name'],
        userDeviceLocation: raw['user-device-location'],
    
        buildNumber: raw['build-number'],
        softwareVersion: raw['software-version'],
        softwareBuild: Number(raw['software-build']),
    
        uiBuildNumber: raw['ui-build-number'],
        uiSoftwareVersion: raw['ui-software-version'],
        uiSoftwareBuild: Number(raw['ui-software-build']),
    
        secureDevice: Boolean(raw['secure-device']),
        ecpSettingMode: raw['ecp-setting-mode'],
    
        language: raw.language,
        country: raw.country,
        locale: raw.locale,
    
        closedCaptionMode: raw['closed-caption-mode'],
    
        timeZoneAuto: Boolean(raw['time-zone-auto']),
        timeZone: raw['time-zone'],
        timeZoneName: raw['time-zone-name'],
        timeZoneTz: raw['time-zone-tz'],
        timeZoneOffset: Number(raw['time-zone-offset']),
    
        clockFormat: raw['clock-format'],
        uptime: Number(raw.uptime),
        powerMode: raw['power-mode'],
    
        supportsSuspend: Boolean(raw['supports-suspend']),
        supportsFindRemote: Boolean(raw['supports-find-remote']),
        supportsAudioGuide: Boolean(raw['supports-audio-guide']),
        supportsRva: Boolean(raw['supports-rva']),
        hasHandsFreeVoiceRemote: Boolean(raw['has-hands-free-voice-remote']),
    
        developerEnabled: Boolean(raw['developer-enabled']),
        keyedDeveloperId: raw['keyed-developer-id'],
    
        deviceAutomationBridgeEnabled: Boolean(
            raw['device-automation-bridge-enabled']
        ),
    
        searchEnabled: Boolean(raw['search-enabled']),
        searchChannelsEnabled: Boolean(raw['search-channels-enabled']),
        voiceSearchEnabled: Boolean(raw['voice-search-enabled']),
    
        supportsPrivateListening: Boolean(raw['supports-private-listening']),
        privateListeningBlocked: Boolean(raw['private-listening-blocked']),
        supportsPrivateListeningDtv: Boolean(
            raw['supports-private-listening-dtv']
        ),
    
        supportsWarmStandby: Boolean(raw['supports-warm-standby']),
        headphonesConnected: Boolean(raw['headphones-connected']),
    
        supportsAudioSettings: Boolean(raw['supports-audio-settings']),
        supportsEcsTextedit: Boolean(raw['supports-ecs-textedit']),
        supportsEcsMicrophone: Boolean(raw['supports-ecs-microphone']),
        supportsWakeOnWlan: Boolean(raw['supports-wake-on-wlan']),
        supportsAirplay: Boolean(raw['supports-airplay']),
    
        hasPlayOnRoku: Boolean(raw['has-play-on-roku']),
        hasMobileScreensaver: Boolean(raw['has-mobile-screensaver']),
    
        supportUrl: raw['support-url'],
    
        grandcentralVersion: raw['grandcentral-version'],
        supportsTrc: Boolean(raw['supports-trc']),
        trcVersion: Number(raw['trc-version']),
        trcChannelVersion: raw['trc-channel-version'],
    
        avSyncCalibrationEnabled: Number(
            raw['av-sync-calibration-enabled']
        ),
        brightscriptDebuggerVersion: raw['brightscript-debugger-version'],
    };
};

export const fetchSelectedRokuApps = async (ip: string): Promise<RokuApp[] | undefined> => {
    try {
        const response = await fetch(`${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.APPS}`);
        const xml = await response.text();
    
        const parsed = parser.parse(xml);

        console.log({
            appRes: parsed
        })
    
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

export const fetchActiveRokuApp = async (ip: string): Promise<ActiveApp | undefined> => {
    try {
        const response = await fetch(`${ROKU_API.BASE_URL(ip)}${ROKU_API.QUERY.ACTIVE_APP}`);
        const xml = await response.text();
    
        const parsed = parser.parse(xml)['active-app'];
        const rawApp = parsed?.app;

        return {
            id: rawApp.id ?? 'unknown',
            text: rawApp['#text'].trim() || null,
            type: rawApp.type ?? 'unknown',
            uiLocation: rawApp['ui-location'] ?? null,
            version: rawApp.version ?? null,
        };
    } catch (error) {}
}

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
