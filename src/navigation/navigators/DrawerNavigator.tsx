import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabsNavigator } from './BottomTabNavigator';
import { SideMenu } from '../components/SideMenu';
import { HiddenApps } from '@src/features/scanner/screens/HiddenApps';
import { IonIcon } from '@src/shared/components/IonIcon';

export type RootDrawerParamList = {
    Home: undefined;
    "Hidden apps": undefined;
};
const Drawer = createDrawerNavigator();
export function DrawerNavigator() {
    return (
        <Drawer.Navigator
        drawerContent={(props) => <SideMenu {...props} />}
        screenOptions={{
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
                    title: 'Inicio',
                    drawerIcon: ({color, size}) => <IonIcon name={'home'} color={color} size={size} />
                }}
            />
            <Drawer.Screen
                name="Hidden apps"
                component={HiddenApps}
                options={{
                    title: 'Aplicaciones ocultas',
                    drawerIcon: ({color, size}) => <IonIcon name={'eye-off'} color={color} size={size} /> 
                }}
            />
        </Drawer.Navigator>
    );
}