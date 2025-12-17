import { TVScanner } from '@src/features/scanner/screens/TVScanner';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '@src/config/theme/colors/colors';
import { ScreenLayout } from '../layouts/ScreenLayout';

const Stack = createStackNavigator();

export function StackNavigator() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: {
                backgroundColor: colors.bone.base
            }
        }}>
            <Stack.Screen
                name="TVScanner"
                children={() => (
                    <ScreenLayout>
                        <TVScanner />
                    </ScreenLayout>
                )}
            />
        </Stack.Navigator>
    );
}