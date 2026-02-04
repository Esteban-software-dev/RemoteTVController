export const smartHubResources = {
    es: {
        translation: {
            smartHub: {
                sections: {
                    favorites: {
                        title: 'Tus favoritos',
                        count_one: '{{count}} app favorita',
                        count_other: '{{count}} apps favoritas',
                    },
                    inputs: {
                        title: 'Entradas',
                        subtitle: 'HDMI, TV y fuentes externas',
                    },
                    apps: {
                        title: 'Entretenimiento',
                        subtitle: 'Series, películas, música y streaming',
                    },
                    system: {
                        title: 'Sistema',
                        subtitle: 'Configuración y servicios del Roku',
                    },
                },
                noDevice: {
                    title: 'Selecciona un Roku para empezar',
                    subtitle:
                        'Conéctate a un dispositivo Roku para ver y abrir tus apps desde aquí.',
                    action: {
                        label: 'Buscar dispositivos Roku',
                    },
                },
                emptyGrid: {
                    title: 'Sin apps disponibles',
                    subtitle: 'Esta sección no tiene apps para mostrar.',
                },
            },
        },
    },
    en: {
        translation: {
            smartHub: {
                sections: {
                    favorites: {
                        title: 'Your favorites',
                        count_one: '{{count}} favorite app',
                        count_other: '{{count}} favorite apps',
                    },
                    inputs: {
                        title: 'Inputs',
                        subtitle: 'HDMI, TV and external sources',
                    },
                    apps: {
                        title: 'Entertainment',
                        subtitle: 'Movies, series, music and streaming',
                    },
                    system: {
                        title: 'System',
                        subtitle: 'Roku settings and services',
                    },
                },
                noDevice: {
                    title: 'Select a Roku to get started',
                    subtitle:
                        'Connect to a Roku device to view and launch your apps from here.',
                    action: {
                        label: 'Search Roku devices',
                    },
                },
                emptyGrid: {
                    title: 'No apps available',
                    subtitle: 'This section has no apps to display.',
                },
            },
        },
    },
} as const;
