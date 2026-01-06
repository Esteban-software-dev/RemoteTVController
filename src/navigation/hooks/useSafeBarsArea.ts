import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppBarPadding } from './useAppbarPadding';
import { spacing } from '@src/config/theme/tokens';

export function useSafeBarsArea() {
    const { appBarHeight } = useAppBarPadding();
    const tabBarHeight = useBottomTabBarHeight();

    return {
        top: appBarHeight,
        bottom: tabBarHeight + spacing.xs,
        total: appBarHeight + tabBarHeight,
    };
}
