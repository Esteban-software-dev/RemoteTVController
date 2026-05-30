import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootDrawerParamList } from '../navigators/DrawerNavigator';

export function useDrawerNavigation<T extends keyof RootDrawerParamList>() {
    const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
    const route = useRoute<RouteProp<RootDrawerParamList, T>>();
    
    return {
        navigation,
        route,
        params: route.params,
    };
};
