import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';

export const getDisplayName = (d?: RokuDeviceInfo | null) =>
    d
        ? d.friendlyDeviceName ||
        d.userDeviceName ||
        d.defaultDeviceName ||
        d.modelName ||
        'Roku'
        : 'Sin dispositivo conectado';

export const getModelInfo = (d?: RokuDeviceInfo | null) =>
    d ? d.friendlyModelName || d.modelName || '' : '';

export const getLocation = (d?: RokuDeviceInfo | null) =>
    d ? d.userDeviceLocation || '' : '';

export const getNetwork = (d?: RokuDeviceInfo | null) =>
    d ? d.networkName || '' : '';
