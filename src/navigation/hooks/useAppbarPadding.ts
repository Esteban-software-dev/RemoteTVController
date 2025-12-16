import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBarLayoutContext } from '@src/navigation/context/AppbarLayoutContext';
import { spacing } from '@src/config/theme/tokens';

export function useAppBarPadding() {
    const { height } = useContext(AppBarLayoutContext);
    const insets = useSafeAreaInsets();

    return {
        paddingTop: height + (insets.top === 0 ? spacing.md : insets.top),
    };
}
