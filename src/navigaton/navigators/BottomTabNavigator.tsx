import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={() => <Text>asd</Text>} />
        </Tab.Navigator>
    );
}