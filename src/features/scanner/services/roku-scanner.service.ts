import { createSSDPClient } from '@src/shared/ssdp/ssdp.client';
import { RokuDevice } from '@src/shared/ssdp/types/ssdp.types';
import { fetchRokuDeviceInfo } from './roku-device-info.service';
import { useRokuStore } from '@src/store/roku/roku.store';

export function scanRokuDevices(timeout = 5000): Promise<RokuDevice[]> {
    return new Promise((resolve) => {
        const found: RokuDevice[] = [];

        const socket = createSSDPClient((raw, rinfo) => {
            if (!raw.includes('roku:ecp')) return;

            if (found.some(d => d.ip === rinfo.address)) return;

            const headers = parseHeaders(raw);

            found.push({
                ip: rinfo.address,
                location: headers.LOCATION || headers.location,
                st: headers.ST || headers.st,
                usn: headers.USN || headers.usn,
            });
        });

        setTimeout(() => {
            try {
                socket.close();
            } catch {}
            resolve(found);
        }, timeout);
    });
}

export async function scanAndFetchRokus() {
    const devices = await scanRokuDevices();
    const { setDevice } = useRokuStore.getState();

    await Promise.all(
        devices.map(async (device) => {
            try {
                const info = await fetchRokuDeviceInfo(device.ip);

                setDevice({
                    ip: device.ip,
                    ...info,
                });
            } catch {
                console.warn(`[Roku] No se pudo obtener info de ${device.ip}`);
            }
        })
    );
}

function parseHeaders(raw: string): Record<string, string> {
    return raw
        .split('\r\n')
        .reduce<Record<string, string>>((acc, line) => {
            const [key, value] = line.split(': ');
            if (key && value) acc[key.trim()] = value.trim();
            return acc;
        }, {});
}
