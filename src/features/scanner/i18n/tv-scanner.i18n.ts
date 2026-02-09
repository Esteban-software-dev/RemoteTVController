export const tvScannerResources = {
    es: {
        translation: {
            tvScanner: {
                connected: {
                    title: 'Dispositivo conectado',
                    subtitle: 'Listo para usarse',
                    disconnect: 'Desconectar',
                },
                devices: {
                    title: 'Dispositivos Roku',
                    scanning: 'Buscando en tu red local…',
                    found_zero: '0 encontrados',
                    found_one: '1 encontrado',
                    found_other: '{{count}} encontrados',
                    scanAction: 'Escanear red',
                },
                empty: {
                    title: 'No se encontró ningún Roku',
                    subtitle: 'Verifica que tu celular y tu TV estén en la misma red Wi-Fi',
                    retry: 'Volver a buscar',
                },
            },
            toast: {
                deviceConnected: {
                    title: 'TV conectada',
                }
            }
        },
    },
    en: {
        translation: {
            tvScanner: {
                connected: {
                    title: 'Connected device',
                    subtitle: 'Ready to use',
                    disconnect: 'Disconnect',
                },
                devices: {
                    title: 'Roku devices',
                    scanning: 'Searching your local network…',
                    found_zero: '0 found',
                    found_one: '1 found',
                    found_other: '{{count}} found',
                    scanAction: 'Scan network',
                },
                empty: {
                    title: 'No Roku device found',
                    subtitle: 'Make sure your phone and TV are on the same Wi-Fi network',
                    retry: 'Search again',
                },
            },
            toast: {
                deviceConnected: {
                    title: 'TV connected',
                }
            }
        },
    },
} as const;
