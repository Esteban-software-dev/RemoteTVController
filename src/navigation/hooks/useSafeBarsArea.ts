import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppBarPadding } from './useAppbarPadding';
import { spacing } from '@src/config/theme/tokens';
import { roundToLayoutPixel } from '@src/config/theme/utils/normalize-size';

/**
 * Matches `BottomTabBar`: `height: 64` + `bottom: spacing.sm` (tab floats above the edge).
 * Do not use `useBottomTabBarHeight()` here — with a custom tab bar RN still uses ~49 + inset,
 * which is shorter than the real pill and makes lists end under the bar.
 */
const TAB_BAR_BODY_HEIGHT = 64;
const TAB_BAR_FLOAT_BOTTOM_OFFSET = spacing.sm;
const TAB_BAR_VISUAL_STACK = TAB_BAR_BODY_HEIGHT + TAB_BAR_FLOAT_BOTTOM_OFFSET;

/**
 * Some devices report `insets.bottom === 0` or a value that is too small.
 * We clamp to a platform floor, and when the OS reports exactly 0 we also enforce a minimum
 * gesture/home band (without the old ad-hoc `spacing.xl * 3` patch).
 */
function effectiveBottomInset(bottom: number): number {
    const floor = Platform.select({ ios: 20, android: 16, default: 16 });
    let v = Math.max(bottom, floor);
    if (bottom === 0) {
        v = Math.max(v, spacing.lg);
    }
    return v;
}

/**
 * Stable padding for tab screens: top (app bar + status) and bottom (tab bar + float gap + safe home/gesture area).
 */
export function useSafeBarsArea() {
    const insets = useSafeAreaInsets();
    const { appBarHeight } = useAppBarPadding();

    const safeBottom = effectiveBottomInset(insets.bottom);
    const bottom = roundToLayoutPixel(TAB_BAR_VISUAL_STACK + safeBottom);

    return {
        top: appBarHeight,
        bottom,
        /** Sum of top + bottom insets for full-screen layouts (no normalize/window scale). */
        total: roundToLayoutPixel(appBarHeight + bottom),
    };
}
