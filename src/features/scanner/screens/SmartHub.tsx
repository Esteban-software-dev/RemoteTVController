import { View } from 'react-native';
import React, { useEffect } from 'react';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { SmartHubSectionType } from '../interfaces/section.types';
import { SmartHubSectionList } from '../components/SmartHubSectionList';
import { defaultApps } from '@src/default-apps';
import { NoRokuDevice } from '../components/NoRokuDevice';
import { colors } from '@src/config/theme/colors/colors';
import { useBottomtabNavigation } from '@src/navigation/hooks/useBottomtabNavigation';

export function SmartHub() {
    const { navigation } = useBottomtabNavigation();
    const { apps, setApps } = useRokuSessionStore();
    const { selectedDevice } = useRokuSessionStore();
    const sections: SmartHubSectionType[] = [
        {
            type: 'favorites',
            data: apps && apps.length ? [apps[4], apps[2], apps[6]] : [],
            title: 'Tus favoritos',
            subtitle: 'Apps marcadas como favoritas',
            iconName: 'heart',
            scrollType: 'horizontal'
        },
        {
            type: 'apps',
            data: apps ?? [],
            title: 'Aplicaciones',
            subtitle: 'Todas las apps disponibles en este dispositivo',
            iconName: 'apps',
        }
    ];

    useEffect(() => {
        if (!selectedDevice) return;
        if (apps && apps.length > 0) return;
        setApps(defaultApps);
    }, []);

    if (!apps || !apps.length) {
        return (
            <NoRokuDevice
                title='Selecciona un Roku para empezar'
                subtitle='Conéctate a un dispositivo Roku para ver y abrir tus apps desde aquí.'
                iconName='tv-outline'
                actionButton={{
                    label: 'Buscar dispositivos Roku',
                    iconName: 'search',
                    variant: 'outline',
                    color: colors.gradient[2],
                    onPress: () => navigation.navigate('Tv scanner')
                }}
            />
        );
    }

    return (
        <View style={[globalStyles.container, globalStyles.horizontalAppPadding]}>
            <SmartHubSectionList sections={sections} />
        </View>
    )
}
