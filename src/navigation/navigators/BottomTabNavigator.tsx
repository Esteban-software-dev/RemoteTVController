import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';
import ThemeConfiguration from '@src/features/theme/screens/ThemeConfiguration';
import { ScreenLayout } from '../layouts/ScreenLayout';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            animation: 'fade'
        }}>
            <Tab.Screen name="Home" component={StackNavigator} />
            <Tab.Screen name="Theme" children={() => {
                return (
                    <ScreenLayout>
                        <ThemeConfiguration />
                    </ScreenLayout>
                )
            }} />
        </Tab.Navigator>
    );
}