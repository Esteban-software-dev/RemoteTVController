import { StyleSheet, View } from 'react-native';
import { Gradient } from './Gradient';
import { radius, shadows } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';

export function GradientCard({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.wrapper}>
            <Gradient />
            <View style={styles.inner}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: radius.lg,
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
    },
    inner: {
        backgroundColor: colors.white.base,
        borderRadius: radius.lg,
        margin: 1,
        overflow: 'hidden',
    },    
})