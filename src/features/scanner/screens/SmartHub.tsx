import { View } from 'react-native';
import React, { useEffect } from 'react';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { SmartHubSectionType } from '../interfaces/section.types';
import { SmartHubSectionList } from '../components/SmartHubSectionList';

export function SmartHub() {
    const { apps } = useRokuSessionStore();
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
        console.log({apps})
    }, [apps]);

    return (
        <View style={[globalStyles.container, globalStyles.horizontalAppPadding]}>
            <SmartHubSectionList sections={sections} />
        </View>
    )
}
