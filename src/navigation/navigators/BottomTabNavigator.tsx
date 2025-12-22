import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';
import ThemeConfiguration from '@src/features/theme/screens/ThemeConfiguration';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { BottomTabBar } from '../components/BottomTabBar';
import { IonIcon } from '@src/shared/components/IonIcon';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {

    return (
        <Tab.Navigator
        tabBar={BottomTabBar}
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}>
            <Tab.Screen
                name="Home"
                options={{
                    tabBarIcon: ({ focused, size }) => {
                        return (
                            <IonIcon
                                name={focused ? 'home' : 'home-outline'}
                                size={size}
                            />
                        )
                    }
                }}
                component={() => {
                    return (
                        <ScreenLayout>
                            <ThemeConfiguration />
                        </ScreenLayout>
                    )
                }}
            />

            <Tab.Screen
            name="Tv scanner"
            options={{
                tabBarIcon: ({ focused, size }) => {
                    return (
                        <IonIcon
                            name={focused ? 'tv' : 'tv-outline'}
                            size={size}
                        />
                    )
                }
            }}
            component={StackNavigator} />

            <Tab.Screen
            name="Profile"
            options={{
                tabBarIcon: ({ focused, size }) => {
                    return (
                        <IonIcon
                            name={focused ? 'people' : 'people-outline'}
                            size={size}
                        />
                    )
                }
            }}
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

