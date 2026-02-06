import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { View, Pressable, StyleSheet, GestureResponderEvent, Platform } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
    interpolateColor,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { spacing, radius, shadows } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { useEffect } from 'react';
import { BlurBackground } from '@src/shared/components/BlurBackground';

export function BottomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
    const isAndroid = Platform.OS === 'android';

    return (
        <View style={styles.wrapper}>
            {/* <BlurBackground style={{borderRadius: radius.lg}} blurAmount={isAndroid ? 3 : 8} /> */}
            {/* {!isAndroid && (
                <BlurBackground blurAmount={6} />
            )}

            {isAndroid && (
                <View
                    style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        borderRadius: radius.lg,
                    },
                    ]}
                />
            )} */}

            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const { options } = descriptors[route.key];
                const label =
                    typeof options.tabBarLabel === 'string'
                        ? options.tabBarLabel
                        : typeof options.title === 'string'
                        ? options.title
                        : route.name;

                return (
                    <TabItem
                        key={route.key}
                        label={label}
                        active={isFocused}
                        icon={options.tabBarIcon}
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
    icon?: BottomTabNavigationOptions['tabBarIcon'];
}

function TabItem({
    label,
    active,
    onPress,
    icon
}: TabItemProps) {
    const progress = useSharedValue(active ? 1 : 0);
    const gradientRotation = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(progress.value, [0, 1], [1, 1.02]) },
        ],
    }));
    const inactiveBorderStyle = useAnimatedStyle(() => ({
        borderWidth: active ? 0 : 1,
        borderColor: 'rgba(206, 206, 206, 0.59)',
        borderRadius: radius.xl,
    }));

    const borderStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: interpolate(progress.value, [0, 1], [1, 1.1]) },
            {
                translateY: interpolate(
                    progress.value,
                    [0, 1],
                    [0, -1],
                    Extrapolation.CLAMP
                ),
            },
        ],
        borderWidth: interpolate(progress.value, [0, 1], [0, 1]),
        backgroundColor: interpolateColor(progress.value, [0, 1], [colors.bone.base, colors.bone.base]),
    }));

    const labelStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    progress.value,
                    [0, 1],
                    [2, 0],
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

    useEffect(() => {
        progress.value = withSpring(active ? 1 : 0, {
            damping: 22,
            stiffness: 260,
            mass: 0.6,
        });
    }, [active]);

    const gradientStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${gradientRotation.value}deg` },
        ],
        opacity: progress.value,
    }));

    return (
        <Pressable style={styles.tabWrapper} onPress={onPress}>
            <Animated.View style={[styles.tabContainer, containerStyle]}>
                {!active && <Animated.View style={[StyleSheet.absoluteFill, inactiveBorderStyle]} />}
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

                <Animated.View style={[styles.icon, iconStyle]}>
                    {icon?.({
                        focused: active,
                        color: colors.dark.base,
                        size: active ? 19 : 18,
                    })}
                </Animated.View>

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
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, .02),
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
        backgroundColor: colors.white.base
    },
    tabWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tabContainer: {
        width: 100,
        height: 44,
        borderRadius: radius.xl,
        backgroundColor: colors.white.base,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 6,
    },

    activeBorder: {
        ...StyleSheet.absoluteFill,
        borderRadius: radius.xl,
        padding: 1,
        overflow: 'hidden',
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
    },
    icon: {
        width: 26,
        height: 26,
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: withOpacityHex(colors.dark.base, .1),
    },

    label: {
        fontSize: 11,
        color: colors.dark.base,
        marginBottom: 2,
    },
});
