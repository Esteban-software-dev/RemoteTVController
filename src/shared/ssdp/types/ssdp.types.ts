export interface RokuDevice {
    ip: string;
    location?: string;
    st?: string;
    usn?: string;
}

export interface RokuDeviceInfo {
    ip: string;
    friendlyDeviceName: string;
    modelName: string;
    serialNumber: string;
    softwareVersion: string;
    lastSeenAt: number;
}
