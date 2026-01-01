// useRokuScanner.ts
import { useRokuStore } from '@src/store/roku/roku.store';
import { useCallback, useState } from 'react';
import { scanAndFetchRokus } from '../services/roku-scanner.service';

export function useRokuScanner() {
    const devices = useRokuStore(state => state.devices);
    const clear = useRokuStore(state => state.clearDevices);

    const [scanning, setScanning] = useState(false);

    const scan = useCallback(async () => {
        if (scanning) return;

        setScanning(true);
        clear();

        try {
            await scanAndFetchRokus();
        } finally {
            setScanning(false);
        }
    }, [scanning, clear]);

    return {
        devices,
        scanning,
        scan,
    };
}
