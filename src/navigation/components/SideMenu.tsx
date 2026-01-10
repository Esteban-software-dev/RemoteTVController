import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    useAnimatedReaction,
    interpolate,
} from 'react-native-reanimated';
import {
    DrawerContentComponentProps,
    useDrawerProgress,
} from '@react-navigation/drawer';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { BlurBackground } from '@src/shared/components/BlurBackground';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SideMenu({ navigation }: DrawerContentComponentProps) {
    const progress = useDrawerProgress();
    const blurOpacity = useSharedValue(0);

    useAnimatedReaction(
        () => progress.value,
        (value, prev) => {
            if (value > 0 && (prev &&prev < 1)) {
                if (value === 1)  blurOpacity.value = withTiming(1, { duration: 500 });
            }
            if ((value < 1) && (prev && prev > 0)) {
                blurOpacity.value = withTiming(0, { duration: 50 });
            }
        }
    );

    const blurStyle = useAnimatedStyle(() => ({
        opacity: blurOpacity.value,
    }));

    const animatedContainer = useAnimatedStyle(() => ({
        transform: [{
            scale: interpolate(progress.value, [0, 1], [.5, 1])
        }]
    }));

    return (
        <View style={[StyleSheet.absoluteFill, {flex: 1, justifyContent: 'center'}]}>
            <AnimatedPressable
            style={[StyleSheet.absoluteFill, blurStyle]}
            onPress={() => {
                navigation.closeDrawer();
                blurOpacity.value = withTiming(0, { duration: 50 });
            }}>
                <BlurBackground blurType="dark" />
            </AnimatedPressable>

            <Animated.View style={[styles.root, animatedContainer]}>
                <View style={styles.panel}>
                    {/* contenido */}
                </View>
            </Animated.View>
        </View>
    );
}
const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        paddingLeft: spacing.sm,
        width: 300,
        height: '70%'
    },
    panel: {
        width: 300,
        height: '100%',
        backgroundColor: colors.white.base,
        padding: spacing.sm,
        borderRadius: radius.xl
    },
});