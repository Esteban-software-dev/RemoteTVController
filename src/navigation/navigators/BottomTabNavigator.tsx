import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigator } from './StackNavigator';
import ThemeConfiguration from '@src/features/theme/screens/ThemeConfiguration';
import { BottomTabBar } from '../components/BottomTabBar';
import { IonIcon } from '@src/shared/components/IonIcon';
import { SmartHub } from '@src/features/scanner/screens/SmartHub';

const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {

    return (
        <Tab.Navigator
        tabBar={BottomTabBar}
        initialRouteName='Tv scanner'
        screenOptions={{
            headerShown: false,
            animation: 'fade',
        }}>
            <Tab.Screen
                name="Smarthub"
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
                component={SmartHub}
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
            component={ThemeConfiguration} />
        </Tab.Navigator>
    );
}
