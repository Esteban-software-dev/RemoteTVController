import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBar } from '../components/BottomTabBar';
import { IonIcon } from '@src/shared/components/IonIcon';
import { SmartHub } from '@src/features/scanner/screens/SmartHub';
import { TVScanner } from '@src/features/scanner/screens/TVScanner';
import { useTranslation } from 'react-i18next';
import { Settings } from '@src/features/settings/screens/Settings';

export type RootBottomtabs = {
    'Tv scanner': undefined;
    Smarthub: undefined;
    Settings: undefined;
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
            name="Settings"
            options={{
                tabBarLabel: t('tabs.settings'),
                tabBarIcon: ({ focused, size }) => {
                    return (
                        <IonIcon
                            name={focused ? 'settings' : 'settings-outline'}
                            size={size}
                        />
                    )
                }
            }}
            component={Settings} />
        </Tab.Navigator>
    );
}
