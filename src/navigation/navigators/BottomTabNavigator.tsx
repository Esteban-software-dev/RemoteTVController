import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemeConfiguration from '@src/features/theme/screens/ThemeConfiguration';
import { BottomTabBar } from '../components/BottomTabBar';
import { IonIcon } from '@src/shared/components/IonIcon';
import { SmartHub } from '@src/features/scanner/screens/SmartHub';
import { TVScanner } from '@src/features/scanner/screens/TVScanner';
import { useTranslation } from 'react-i18next';

export type RootBottomtabs = {
    'Tv scanner': undefined;
    Profile: undefined;
    Smarthub: undefined;
}
const Tab = createBottomTabNavigator();

export function BottomTabsNavigator() {
    const { t } = useTranslation();

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
                    tabBarLabel: t('tabs.smartHub'),
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
                tabBarLabel: t('tabs.tvScanner'),
                tabBarIcon: ({ focused, size }) => {
                    return (
                        <IonIcon
                            name={focused ? 'tv' : 'tv-outline'}
                            size={size}
                        />
                    )
                }
            }}
            component={TVScanner} />

            <Tab.Screen
            name="Profile"
            options={{
                tabBarLabel: t('tabs.profile'),
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
