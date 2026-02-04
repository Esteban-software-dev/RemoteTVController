import { StyleSheet } from 'react-native';
import { radius, shadows, spacing } from '../tokens';
import { colors } from '../colors/colors';
import { withOpacityHex } from '../utils/withOpacityHexColor';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalAppPadding: {
        paddingHorizontal: spacing.sm,
    },
    shadow: {
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
    },
    emptyContainer: {
        borderRadius: radius.lg,
        backgroundColor: colors.dark.surface,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.25),
        padding: spacing.lg,
    },
});