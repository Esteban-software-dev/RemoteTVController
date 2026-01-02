import { StyleSheet } from 'react-native';
import { spacing } from '../tokens';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalAppPadding: {
        paddingHorizontal: spacing.sm,
    }
});