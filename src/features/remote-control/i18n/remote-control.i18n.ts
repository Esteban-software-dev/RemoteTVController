export const remoteControlResources = {
    es: {
        translation: {
            remoteControl: {
                title: 'Control remoto',
                subtitle: 'Controla tu TV con voz, touch y accesos rápidos',
                noDevice: {
                    title: 'No hay una TV conectada',
                    subtitle: 'Conecta un dispositivo Roku para habilitar el control remoto',
                    action: 'Ir a escáner',
                },
                connected: {
                    label: 'TV conectada',
                    unknownApp: 'Inicio',
                },
                modes: {
                    classic: 'Clásico',
                    touch: 'Touch',
                },
                sections: {
                    voice: 'Comandos por voz',
                    pinned: 'Apps rápidas',
                    controls: 'Controles',
                },
                controls: {
                    mute: 'Silencio',
                    power: 'Encendido',
                },
                pinned: {
                    empty: 'Aún no tienes apps fijas.',
                },
                voice: {
                    idle: 'Toca para escuchar',
                    listening: 'Escuchando...',
                    hint: 'Puedes ejecutar acciones rápidas sin salir del control.',
                    commandHome: 'Ir a inicio',
                    commandBack: 'Atrás',
                    commandPlay: 'Play / Pause',
                    commandMute: 'Silenciar',
                },
                toast: {
                    noDeviceTitle: 'Sin conexión',
                    noDeviceSubtitle: 'Primero conecta una TV en el escáner.',
                    sentTitle: 'Comando enviado',
                    sentSubtitle: 'Acción ejecutada en {{device}}',
                    launchedTitle: 'App abierta',
                    launchedSubtitle: '{{app}} se abrió en tu TV',
                },
            },
        },
    },
    en: {
        translation: {
            remoteControl: {
                title: 'Remote control',
                subtitle: 'Control your TV with voice, touch, and quick actions',
                noDevice: {
                    title: 'No TV connected',
                    subtitle: 'Connect a Roku device to enable remote control',
                    action: 'Go to scanner',
                },
                connected: {
                    label: 'Connected TV',
                    unknownApp: 'Home',
                },
                modes: {
                    classic: 'Classic',
                    touch: 'Touch',
                },
                sections: {
                    voice: 'Voice commands',
                    pinned: 'Quick apps',
                    controls: 'Controls',
                },
                controls: {
                    mute: 'Mute',
                    power: 'Power',
                },
                pinned: {
                    empty: 'No pinned apps yet.',
                },
                voice: {
                    idle: 'Tap to listen',
                    listening: 'Listening...',
                    hint: 'Trigger quick actions without leaving remote mode.',
                    commandHome: 'Go home',
                    commandBack: 'Back',
                    commandPlay: 'Play / Pause',
                    commandMute: 'Mute',
                },
                toast: {
                    noDeviceTitle: 'No connection',
                    noDeviceSubtitle: 'Connect a TV first from scanner.',
                    sentTitle: 'Command sent',
                    sentSubtitle: 'Action executed on {{device}}',
                    launchedTitle: 'App opened',
                    launchedSubtitle: '{{app}} opened on your TV',
                },
            },
        },
    },
} as const;
