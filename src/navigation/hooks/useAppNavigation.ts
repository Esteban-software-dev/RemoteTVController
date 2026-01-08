import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootBottomtabs } from '../navigators/BottomTabNavigator';

export function useAppNavigation<T extends keyof RootBottomtabs>() {
    const navigation = useNavigation<NavigationProp<RootBottomtabs>>();
    const route = useRoute<RouteProp<RootBottomtabs, T>>();
    
    return {
        navigation,
        route,
        params: route.params,
    };
};
