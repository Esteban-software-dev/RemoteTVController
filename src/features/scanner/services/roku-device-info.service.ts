import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

export const fetchRokuDeviceInfo = async (
    ip: string
): Promise<any> => {
    const response = await fetch(`http://${ip}:8060/query/device-info`);
    console.log({response})
    const xml = await response.text();

    const json = parser.parse(xml)['device-info'];

    return {
        friendlyDeviceName: json['friendly-device-name'],
        modelName: json['model-name'],
        serialNumber: json['serial-number'],
        softwareVersion: json['software-version'],
    };
};
