export const hiddenAppsResources = {
    es: {
        translation: {
            hiddenApps: {
                header: {
                    title: 'Apps ocultas',
                    subtitle: 'Estas aplicaciones no aparecen en la vista principal.',
                },
                list: {
                    itemSubtitle: 'App oculta',
                    restoreAction: 'Restaurar',
                },
                empty: {
                    title: 'No hay apps ocultas',
                    description: 'Todas tus aplicaciones están visibles.',
                },
                search: {
                    placeholder: 'Buscar apps ocultas...',
                    collapsed: 'Buscar',
                },
                alert: {
                    restore: {
                        title: '¿Quieres mostrar {{appName}} de nuevo?',
                        message: 'Al mostrar esta app, volverá a aparecer en la vista principal.',
                        cancel: 'Cancelar',
                        confirm: 'Mostrar',
                    },
                    openHidden: {
                        title: 'Abrir app',
                        message: 'Esta app está oculta. Si continúas, se abrirá en la pantalla principal de tu TV.',
                        cancel: 'Cancelar',
                        confirm: 'Abrir app',
                    },
                }
            },
        },
    },
    en: {
        translation: {
            hiddenApps: {
                header: {
                    title: 'Hidden apps',
                    subtitle: 'These applications do not appear on the main view.',
                },
                list: {
                    itemSubtitle: 'Hidden app',
                    restoreAction: 'Restore',
                },
                empty: {
                    title: 'No hidden apps',
                    description: 'All your applications are visible.',
                },
                search: {
                    placeholder: 'Search hidden apps...',
                    collapsed: 'Search',
                },
                alert: {
                    restore: {
                        title: 'Show {{appName}} again?',
                        message: 'This app will reappear in the main view.',
                        cancel: 'Cancel',
                        confirm: 'Show app',
                    },
                    openHidden: {
                        title: 'Open app',
                        message: 'This app is hidden. If you continue, it will open on your TV main screen.',
                        cancel: 'Cancel',
                        confirm: 'Open app',
                    },
                }
            },
        },
    },
} as const;
