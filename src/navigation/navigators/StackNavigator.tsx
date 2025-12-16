import { TVScanner } from '@src/features/scanner/screens/TVScanner';
import { createStackNavigator } from '@react-navigation/stack';
import { radius } from '@src/config/theme/tokens';

const Stack = createStackNavigator();

export function StackNavigator() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="TVScanner" component={TVScanner} />
        </Stack.Navigator>
    );
}