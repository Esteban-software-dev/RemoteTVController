import { AUTO_COLLAPSE_DELAY, COLLAPSED_HEIGHT, COLLAPSED_WIDTH, EXPANDED_HEIGHT, EXPANDED_WIDTH, MAX_DRAG } from '../constants/appbarDimensions.constant';
import { View, StyleSheet, PanResponder, Pressable, Text } from 'react-native';
import React, { useContext, useEffect, useRef } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation,
    useDerivedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, shadows, spacing } from '@src/config/theme/tokens';
import { AppBarLayoutContext } from '../context/AppbarLayoutContext';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '@src/config/theme/colors/colors';
import  { scheduleOnRN } from 'react-native-worklets'
import { IonIcon } from '@src/shared/components/IonIcon';
import { useNavigation } from '@react-navigation/native';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

const applyResistance = (value: number) => {
    const abs = Math.abs(value);
    const sign = Math.sign(value);
    if (abs < MAX_DRAG) return value;
    return sign * (MAX_DRAG + (abs - MAX_DRAG) * 0.15);
};

export function AppBar() {
    const { setHeight } = useContext(AppBarLayoutContext);
    const { navigate } = useNavigation();

    const insets = useSafeAreaInsets();

    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);
    const width = useSharedValue(EXPANDED_WIDTH);
    const height = useSharedValue(EXPANDED_HEIGHT);
    const collapsedAnim = useSharedValue(0);
    const gradientRotation = useSharedValue(0);
    const gradientColors = [colors.gradient[1], colors.gradient[2], colors.gradient[3]];

    const collapseTimeout = useRef<any | null>(null);
    const isPressed = useRef(false);

    const startCollapseTimer = () => {
        if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
        collapseTimeout.current = setTimeout(() => {
            if (!isPressed.current) {
                width.value = withSpring(COLLAPSED_WIDTH);
                height.value = withSpring(COLLAPSED_HEIGHT);
                collapsedAnim.value = withTiming(1, { duration: 300 });
                scheduleOnRN(setHeight, COLLAPSED_HEIGHT);
            }
        }, AUTO_COLLAPSE_DELAY);
    };

    useEffect(() => {
        startCollapseTimer();
        return () => {
            if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
        };
    }, []);

    useDerivedValue(() => {
        if (collapsedAnim.value) {
            gradientRotation.value = withTiming(360, {
                duration: 2000,
            });
        } else {
            gradientRotation.value = withTiming(180, {duration: 200});
        }
    });

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 2,
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dx) > 1 || Math.abs(g.dy) > 1,

            onPanResponderGrant: () => {
                isPressed.current = true;
                width.value = withSpring(EXPANDED_WIDTH);
                height.value = withSpring(EXPANDED_HEIGHT);
                collapsedAnim.value = withTiming(0, { duration: 200 });
                scheduleOnRN(setHeight, EXPANDED_HEIGHT);
                if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
            },

            onPanResponderMove: (_, g) => {
                dragX.value = applyResistance(g.dx);
                dragY.value = applyResistance(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                dragX.value = withSpring(0, { velocity: g.vx * 300, damping: 14, stiffness: 180, mass: 0.8 });
                dragY.value = withSpring(0, { velocity: g.vy * 300, damping: 14, stiffness: 180, mass: 0.8 });
                isPressed.current = false;
                startCollapseTimer();
            },
            onPanResponderTerminate: () => {
                dragX.value = withSpring(0);
                dragY.value = withSpring(0);
                isPressed.current = false;
                startCollapseTimer();
            },
        })
    ).current;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: dragX.value },
            { translateY: dragY.value },
        ],
        width: width.value,
        height: height.value,
    }));

    const expandedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(interpolate(collapsedAnim.value, [0, 1], [1, 0], Extrapolation.CLAMP), { duration: 200 }),
        transform: [
            { translateY: withTiming(interpolate(collapsedAnim.value, [0, 1], [0, -10], Extrapolation .CLAMP), { duration: 200 }) }
        ],
        pointerEvents: collapsedAnim.value === 0 ? 'auto' : 'none',
    }));

    const collapsedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(interpolate(collapsedAnim.value, [0, 1], [0, 1], Extrapolation .CLAMP), { duration: 200 }),
        transform: [
            { translateY: withTiming(interpolate(collapsedAnim.value, [0, 1], [10, 0], Extrapolation .CLAMP), { duration: 200 }) }
        ],
        pointerEvents: collapsedAnim.value === 1 ? 'auto' : 'none',
    }));

    const gradientStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                collapsedAnim.value,
                [0, 1],
                [0, 1],
                Extrapolation.CLAMP
            ),
            transform: [
                { rotate: `${gradientRotation.value}deg` },
            ],
        };
    });

    return (
        <View style={[styles.container, {
            paddingTop: insets.top === 0 ? spacing.sm : insets.top,
            paddingBottom: insets.top === 0 ? spacing.sm : insets.top
        }]}>
            <Pressable
            onPressIn={() => {
                isPressed.current = true;
                width.value = withSpring(EXPANDED_WIDTH);
                height.value = withSpring(EXPANDED_HEIGHT);
                collapsedAnim.value = withTiming(0, { duration: 200 });
                scheduleOnRN(setHeight, EXPANDED_HEIGHT);
                if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
            }}
            onPressOut={() => {
                isPressed.current = false;
                startCollapseTimer();
            }}>
                <Animated.View
                {...panResponder.panHandlers}
                style={[styles.bar, animatedStyle]}>
                    {/* Gradient border */}
                    <Animated.View
                    style={[
                        styles.gradientBorder,
                        gradientStyle,
                    ]}
                    pointerEvents="none">
                        <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    </Animated.View>
                    <View style={styles.barInner}>
                        {/* Expanded content */}
                        <Animated.View style={[styles.content, expandedStyle]}>
                            <View style={styles.row}>
                                <Pressable
                                onPress={() => navigate('Profile' as never)}
                                style={({ pressed }) => [
                                    styles.icon,
                                    pressed && {
                                        transform: [{ scale: 0.95 }],
                                    }
                                ]}>
                                    <IonIcon name='menu' size={20} />
                                </Pressable>
                                <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                                        <Text style={{ fontWeight: '600', fontSize: 14 }}>
                                            Hola, Juan
                                        </Text>
                                        <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
                                            {renderMiniAction('search')}
                                            <View style={{ width: spacing.sm }} />
                                            {renderMiniAction('qr-code')}
                                            <View style={{ marginLeft: 'auto' }}>
                                                {renderMiniAction('settings')}
                                            </View>
                                        </View>
                                    </View>
                            </View>
                        </Animated.View>

                        {/* Collapsed content */}
                        <Animated.View style={[styles.content, collapsedStyle]}>
                            <View style={styles.row}>
                                <Pressable
                                    onPress={() => navigate('Profile' as never)}
                                    style={({ pressed }) => [
                                        styles.icon,
                                        pressed && {
                                            transform: [{ scale: 0.95 }],
                                        }
                                    ]}>
                                        <IonIcon name='tv' size={20} />
                                </Pressable>
                                <View style={{ marginLeft: spacing.sm }}>
                                    <Text>
                                        Modo compacto
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const renderMiniAction = (icon: string) => (
    <Pressable
        onPress={() => console.log(icon)}
        style={({ pressed }) => [
            styles.miniAction,
            {
                transform: [{ scale: pressed ? 0.92 : 1 }],
            },
        ]}>
            <IonIcon
                name={icon as any}
                size={14}
                color={withOpacityHex(colors.dark.base, 0.85)}
            />
    </Pressable>
);


const styles = StyleSheet.create({
    container: {
        zIndex: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    bar: {
        backgroundColor: colors.white.base,
        borderRadius: radius.lg,
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: shadows.soft.shadowOpacity,
        shadowRadius: shadows.soft.shadowRadius,
        shadowOffset: { width: 0, height: 6 },
        elevation: shadows.soft.elevation,
        overflow: 'hidden',
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: withOpacityHex('#E5E5E5', .5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gradientBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: radius.lg,
    },
    barInner: {
        backgroundColor: colors.white.base,
        borderRadius: radius.lg,
        margin: 1,
        flex: 1,
        overflow: 'hidden',
    },
    miniAction: {
        width: 34,
        height: 34,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    
        backgroundColor: withOpacityHex('#E5E5E5', .5),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.06),
    },
});
