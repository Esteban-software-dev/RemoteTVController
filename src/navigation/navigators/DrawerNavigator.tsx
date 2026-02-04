import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabsNavigator } from './BottomTabNavigator';
import { SideMenu } from '../components/SideMenu';
import { HiddenApps } from '@src/features/scanner/screens/HiddenApps';
import { IonIcon } from '@src/shared/components/IonIcon';
import { useTranslation } from 'react-i18next';

export type RootDrawerParamList = {
    Home: undefined;
    HiddenApps: undefined;
};

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
    const { t } = useTranslation();

    return (
        <Drawer.Navigator
        drawerContent={(props) => <SideMenu {...props} />}
        screenOptions={{
            drawerStatusBarAnimation: 'fade',
            
            headerShown: false,
            drawerType: 'front',
            drawerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                flex: 1
            },
            overlayColor: 'transparent',
        }}>
            <Drawer.Screen
                name="Home"
                component={BottomTabsNavigator}
                options={{
                    title: t('drawer.home.title'),
                    drawerIcon: ({ color, size }) => (
                        <IonIcon name="home" color={color} size={size} />
                    ),
                }}
            />
            <Drawer.Screen
                name="HiddenApps"
                component={HiddenApps}
                options={{
                    title: t('drawer.hiddenApps.title'),
                    drawerIcon: ({ color, size }) => (
                        <IonIcon name="eye-off" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}
