import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { spacing, radius, shadows } from '@src/config/theme/tokens';
import { colors, component_colors } from '@src/config/theme/colors/colors';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { useEffect } from 'react';

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.wrapper}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                return (
                <TabItem
                    key={route.key}
                    label={route.name}
                    active={isFocused}
                    onPress={() => {
                    if (!isFocused) navigation.navigate(route.name);
                    }}
                />
                );
            })}
        </View>
    );
}


interface TabItemProps {
    label: string;
    active: boolean;
    onPress: (event: GestureResponderEvent) => void;
}

function TabItem({ label, active, onPress }: TabItemProps) {
    const progress = useSharedValue(active ? 1 : 0);
    const gradientRotation = useSharedValue(0);

    progress.value = withSpring(active ? 1 : 0, {
        damping: 22,
        stiffness: 260,
        mass: 0.6,
    });

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(progress.value, [0, 1], [1, 1.02]) },
        ],
    }));

    const borderStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(progress.value, [0, 1], [1, 1.15]) },
            {
                translateY: interpolate(
                    progress.value,
                    [0, 1],
                    [-8, -14],
                    Extrapolation.CLAMP
                ),
            },
        ],
        marginTop: interpolate(progress.value, [0, 1], [0, 4])
    }));

    const labelStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    progress.value,
                    [0, 1],
                    [6, 0],
                    Extrapolation.CLAMP
                ),
            },
        ],
    }));

    useEffect(() => {
        if (active) {
            gradientRotation.value = withTiming(360, {
                duration: 2000,
            });
        } else {
            gradientRotation.value = withTiming(180, {duration: 200});
        }
    }, [active]);

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${gradientRotation.value}deg` },
        ],
    }));

    return (
        <Pressable style={styles.tabWrapper} onPress={onPress}>
            <Animated.View style={[styles.tabContainer, containerStyle]}>
                <Animated.View style={[styles.activeBorder, borderStyle]}>
                    <Animated.View
                    style={[StyleSheet.absoluteFill, gradientStyle]}
                    pointerEvents="none">
                        <LinearGradient
                            colors={[
                                withOpacityHex(colors.gradient[1], .6),
                                withOpacityHex(colors.gradient[2], .6),
                                withOpacityHex(colors.gradient[3], .6),
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>

                    <View style={{
                        backgroundColor: colors.bone.base,
                        borderRadius: radius.xl,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: spacing.xxs
                    }} />
                </Animated.View>

                <Animated.View style={[styles.icon, iconStyle]} />

                <Animated.Text style={[ styles.label, labelStyle, { fontWeight: active ? '700' : '500' } ]}
                numberOfLines={1}>
                    {label}
                </Animated.Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: spacing.sm,
        left: spacing.sm,
        right: spacing.sm,
        height: 64,
        flexDirection: 'row',
        backgroundColor: colors.white.base,
        borderRadius: radius.lg,
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
    },
    tabWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabContainer: {
        width: 100,
        height: 44,
        borderRadius: 999,
        backgroundColor: colors.white.base,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 6,
    },

    activeBorder: {
        ...StyleSheet.absoluteFill,
        borderRadius: 999,
        padding: 1,
        overflow: 'hidden',
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: radius.sm,
        backgroundColor: '#E6E6E6',
        position: 'absolute',
        top: 6,
        zIndex: 2,
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    label: {
        fontSize: 11,
        color: colors.dark.base,
        marginBottom: 2,
    },
});
