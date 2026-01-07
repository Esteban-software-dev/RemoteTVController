import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import { SSDP_MULTICAST, SSDP_PORT } from './constants/ssdp.constants';

export function createSSDPClient(
    onMessage: (msg: string, rinfo: any) => void
) {
    const socket = dgram.createSocket({ type: 'udp4' }) as any;

    socket.bind(0);

    socket.on('message', (msg: any, rinfo: any) => {
        onMessage(msg.toString(), rinfo);
    });

    socket.on('error', () => {
        try {
            socket.close();
        } catch {}
    });

    socket.on('listening', () => {
        socket.setBroadcast(true);

        const message = Buffer.from(
            `M-SEARCH * HTTP/1.1\r\n` +
            `HOST: ${SSDP_MULTICAST}:${SSDP_PORT}\r\n` +
            `MAN: "ssdp:discover"\r\n` +
            `MX: 2\r\n` +
            `ST: roku:ecp\r\n\r\n`
        );

        // 🔁 SSDP necesita insistencia
        socket.send(message, 0, message.length, SSDP_PORT, SSDP_MULTICAST);
        setTimeout(() => socket.send(message, 0, message.length, SSDP_PORT, SSDP_MULTICAST), 300);
        setTimeout(() => socket.send(message, 0, message.length, SSDP_PORT, SSDP_MULTICAST), 800);
    });

    return socket;
}
