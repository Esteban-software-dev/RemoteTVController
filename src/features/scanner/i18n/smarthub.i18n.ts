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
                context: {
                    favorite: {
                        add: 'Agregar a favoritos',
                        remove: 'Quitar de favoritos',
                    },
                    pin: {
                        add: 'Anclar app',
                        remove: 'Desanclar app',
                    },
                    hide: {
                        add: 'Ocultar app',
                        remove: 'Mostrar app',
                    },
                    toast: {
                        favorites: {
                            added: {
                                title: 'Añadido a favoritos',
                                subtitle: '{{app}} ahora está en tus favoritos.',
                            },
                            removed: {
                                title: 'Quitado de favoritos',
                                subtitle: '{{app}} ya no está en favoritos.',
                            },
                        },
                        pinned: {
                            added: {
                                title: 'App anclada',
                                subtitle: 'Acceso rápido a {{app}}.',
                            },
                            removed: {
                                title: 'App desanclada',
                                subtitle: '{{app}} ya no está anclada.',
                            },
                        },
                        hidden: {
                            added: {
                                title: 'App oculta',
                                subtitle: '{{app}} se ocultó de tu lista.',
                            },
                            removed: {
                                title: 'App visible',
                                subtitle: '{{app}} volvió a mostrarse.',
                            },
                        },
                    },
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
                context: {
                    favorite: {
                        add: 'Add to favorites',
                        remove: 'Remove from favorites',
                    },
                    pin: {
                        add: 'Pin app',
                        remove: 'Unpin app',
                    },
                    hide: {
                        add: 'Hide app',
                        remove: 'Show app',
                    },
                    toast: {
                        favorites: {
                            added: {
                                title: 'Added to favorites',
                                subtitle: '{{app}} is now in your favorites.',
                            },
                            removed: {
                                title: 'Removed from favorites',
                                subtitle: '{{app}} is no longer a favorite.',
                            },
                        },
                        pinned: {
                            added: {
                                title: 'App pinned',
                                subtitle: 'Quick access to {{app}}.',
                            },
                            removed: {
                                title: 'App unpinned',
                                subtitle: '{{app}} is no longer pinned.',
                            },
                        },
                        hidden: {
                            added: {
                                title: 'App hidden',
                                subtitle: '{{app}} was hidden from your list.',
                            },
                            removed: {
                                title: 'App visible',
                                subtitle: '{{app}} is visible again.',
                            },
                        },
                    },
                },
            },
        },
    },
} as const;
