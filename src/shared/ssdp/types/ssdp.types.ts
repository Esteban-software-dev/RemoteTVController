export interface RokuDevice {
    ip: string;
    location?: string;
    st?: string;
    usn?: string;
}

export interface RokuDeviceInfo {
    ip: string;
    lastSeenAt: number;
    udn: string;
    serialNumber: string;
    deviceId: string;
    advertisingId: string;

    userProfileType: string;
    vendorName: string;

    modelName: string;
    modelNumber: string;
    modelRegion: string;
    isTv: boolean;
    isStick: boolean;

    screenSize: number;
    panelId: number;

    uiResolution: string;
    tunerType: string;

    supportsEthernet: boolean;
    wifiMac: string;
    wifiDriver: string;
    hasWifi5GSupport: boolean;

    networkType: string;
    networkName: string;

    friendlyDeviceName: string;
    friendlyModelName: string;
    defaultDeviceName: string;
    userDeviceName: string;
    userDeviceLocation: string;

    buildNumber: string;
    softwareVersion: string;
    softwareBuild: number;

    uiBuildNumber: string;
    uiSoftwareVersion: string;
    uiSoftwareBuild: number;

    secureDevice: boolean;
    ecpSettingMode: string;

    language: string;
    country: string;
    locale: string;

    closedCaptionMode: string;

    timeZoneAuto: boolean;
    timeZone: string;
    timeZoneName: string;
    timeZoneTz: string;
    timeZoneOffset: number;

    clockFormat: string;
    uptime: number;
    powerMode: string;

    supportsSuspend: boolean;
    supportsFindRemote: boolean;
    supportsAudioGuide: boolean;
    supportsRva: boolean;
    hasHandsFreeVoiceRemote: boolean;

    developerEnabled: boolean;
    keyedDeveloperId: string;

    deviceAutomationBridgeEnabled: boolean;

    searchEnabled: boolean;
    searchChannelsEnabled: boolean;
    voiceSearchEnabled: boolean;

    supportsPrivateListening: boolean;
    privateListeningBlocked: boolean;
    supportsPrivateListeningDtv: boolean;

    supportsWarmStandby: boolean;
    headphonesConnected: boolean;

    supportsAudioSettings: boolean;
    supportsEcsTextedit: boolean;
    supportsEcsMicrophone: boolean;
    supportsWakeOnWlan: boolean;
    supportsAirplay: boolean;

    hasPlayOnRoku: boolean;
    hasMobileScreensaver: boolean;

    supportUrl: string;

    grandcentralVersion: string;
    supportsTrc: boolean;
    trcVersion: number;
    trcChannelVersion: string;

    avSyncCalibrationEnabled: number;
    brightscriptDebuggerVersion: string;
}
