import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabsNavigator } from './BottomTabNavigator';
import { SideMenu } from '../components/SideMenu';

export type RootDrawerParamList = {
    Home: undefined;
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
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
}