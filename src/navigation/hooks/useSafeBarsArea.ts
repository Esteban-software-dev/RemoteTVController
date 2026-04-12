import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppBarPadding } from './useAppbarPadding';
import { spacing } from '@src/config/theme/tokens';
import { normalizeSize, roundToLayoutPixel } from '@src/config/theme/utils/normalize-size';

export function useSafeBarsArea() {
    const insets = useSafeAreaInsets();
    const { appBarHeight } = useAppBarPadding();
    const tabBarHeight = useBottomTabBarHeight();

    return {
        top: appBarHeight,
        bottom: roundToLayoutPixel(tabBarHeight + (insets.bottom + insets.top === 0 ? spacing.xl * 3 : insets.bottom)),
        total: normalizeSize(appBarHeight + tabBarHeight),
    };
}
