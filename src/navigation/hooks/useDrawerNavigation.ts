import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootDrawerParamList } from '../navigators/DrawerNavigator';
import { RootBottomtabs } from '../navigators/BottomTabNavigator';

export function useDrawerNavigation<T extends keyof RootDrawerParamList>() {
    const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
    const route = useRoute<RouteProp<RootDrawerParamList, T>>();
    
    return {
        navigation,
        route,
        params: route.params,
    };
};
