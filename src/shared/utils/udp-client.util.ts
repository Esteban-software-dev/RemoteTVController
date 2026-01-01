import dgram from 'react-native-udp';

export const createUdpClient = () => {
    const socket = dgram.createSocket({ type: 'udp4' }) as any;
    socket.bind(0);
    return socket;
};
