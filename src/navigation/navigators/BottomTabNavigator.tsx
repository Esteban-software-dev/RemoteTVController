import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false
        }}>
            <Tab.Screen name="Home" component={StackNavigator} />
        </Tab.Navigator>
    );
}