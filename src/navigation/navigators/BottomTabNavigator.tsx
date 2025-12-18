import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';
import ThemeConfiguration from '@src/features/theme/screens/ThemeConfiguration';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { BottomTabBar } from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {

    return (
        <Tab.Navigator
        tabBar={(props: BottomTabBarProps) => <BottomTabBar {... props} />}
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}>
            <Tab.Screen
                name="Home"
                component={StackNavigator}
            />
            <Tab.Screen
            name="Theme"
            component={() => {
                return (
                    <ScreenLayout>
                        <ThemeConfiguration />
                    </ScreenLayout>
                )
            }} />
            <Tab.Screen
            name="Profile"
            component={() => {
                return (
                    <ScreenLayout>
                        <ThemeConfiguration />
                    </ScreenLayout>
                )
            }} />
        </Tab.Navigator>
    );
}