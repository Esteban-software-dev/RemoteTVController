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
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { buildAppsSections } from '../helpers/build-apps-section';


export function SmartHub() {
    const { navigation } = useBottomtabNavigation();
    const { apps, setApps } = useRokuSessionStore();
    const { selectedDevice } = useRokuSessionStore();
    const deviceId = useRokuSessionStore(s => s.selectedDevice?.deviceId);
    const config = useAppCustomizationStore(s => deviceId ? s.byDevice[deviceId] : null);

    const sections: SmartHubSectionType[] = React.useMemo(() => {
        return [
            {
                type: 'favorites',
                data: config?.favorites ?? [],
                title: 'Tus favoritos',
                subtitle: 'Apps marcadas como favoritas',
                iconName: 'heart',
                scrollType: 'horizontal',
            },
            ...buildAppsSections(apps ?? []),
        ];
    }, [deviceId, config, apps]);

    useEffect(() => {
        if (!selectedDevice) return;
        if (apps && apps.length > 0) return;

        setApps(defaultApps);
    }, [selectedDevice]);

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
