import { StyleSheet } from 'react-native';
import { shadows, spacing } from '../tokens';

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
    }
});