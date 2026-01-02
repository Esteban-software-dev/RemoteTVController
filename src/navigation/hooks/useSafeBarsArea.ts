import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppBarPadding } from './useAppbarPadding';

export function useSafeBarsArea() {
    const { appBarHeight } = useAppBarPadding();
    const tabBarHeight = useBottomTabBarHeight();

    return {
        top: appBarHeight,
        bottom: tabBarHeight,
        total: appBarHeight + tabBarHeight,
    };
}
