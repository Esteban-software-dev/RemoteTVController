import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabsNavigator } from './BottomTabNavigator';
import { AppBar } from '../components/Appbar';

export type RootDrawerParamList = {
    Home: undefined;
};
const Drawer = createDrawerNavigator();
export function DrawerNavigator() {
    return (
        <Drawer.Navigator
        screenOptions={{
            headerShown: false,
            drawerType: 'back',
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