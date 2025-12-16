import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';
import { AppBar } from '../components/Appbar';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {
    return (
        <Tab.Navigator screenOptions={{
            header: () => <AppBar />
        }}>
            <Tab.Screen name="Home" component={StackNavigator} />
        </Tab.Navigator>
    );
}