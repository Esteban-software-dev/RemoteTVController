import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, PanResponder, Pressable, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MAX_DRAG = 12;

const EXPANDED_WIDTH = SCREEN_WIDTH - 20;
const EXPANDED_HEIGHT = 70;
const COLLAPSED_HEIGHT = 50;
const COLLAPSED_WIDTH = 200;
const AUTO_COLLAPSE_DELAY = 5000;

const applyResistance = (value: number) => {
    const abs = Math.abs(value);
    const sign = Math.sign(value);
    if (abs < MAX_DRAG) return value;
    return sign * (MAX_DRAG + (abs - MAX_DRAG) * 0.15);
};

export function AppBar() {
    const insets = useSafeAreaInsets();

    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);
    const width = useSharedValue(EXPANDED_WIDTH);
    const height = useSharedValue(EXPANDED_HEIGHT);
    const collapsedAnim = useSharedValue(0);

    const collapseTimeout = useRef<any | null>(null);
    const isPressed = useRef(false);

    const startCollapseTimer = () => {
        if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
        collapseTimeout.current = setTimeout(() => {
            if (!isPressed.current) {
                width.value = withSpring(COLLAPSED_WIDTH);
                height.value = withSpring(COLLAPSED_HEIGHT);
                collapsedAnim.value = withTiming(1, { duration: 300 });
            }
        }, AUTO_COLLAPSE_DELAY);
    };

    useEffect(() => {
        startCollapseTimer();
        return () => {
            if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
        };
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dx) > 1 || Math.abs(g.dy) > 1,

            onPanResponderGrant: () => {
                isPressed.current = true;
                width.value = withSpring(EXPANDED_WIDTH);
                height.value = withSpring(EXPANDED_HEIGHT);
                collapsedAnim.value = withTiming(0, { duration: 200 });
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
    }));

    const collapsedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(interpolate(collapsedAnim.value, [0, 1], [0, 1], Extrapolation .CLAMP), { duration: 200 }),
        transform: [
            { translateY: withTiming(interpolate(collapsedAnim.value, [0, 1], [10, 0], Extrapolation .CLAMP), { duration: 200 }) }
        ],
    }));

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
                if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
            }}
            onPressOut={() => {
                isPressed.current = false;
                startCollapseTimer();
            }}>
                <Animated.View
                {...panResponder.panHandlers}
                style={[styles.bar, animatedStyle]}>
                    {/* Expanded content */}
                    <Animated.View style={[styles.content, expandedStyle]}>
                        <View style={styles.row}>
                            <View style={styles.icon} />
                            <View style={{ marginLeft: spacing.sm }}>
                                <Text>
                                    Contenido Expandido
                                </Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Collapsed content */}
                    <Animated.View style={[styles.content, collapsedStyle]}>
                        <View style={styles.row}>
                            <View style={styles.icon} />
                            <View style={{ marginLeft: spacing.sm }}>
                                <Text>
                                    Modo compacto
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bar: {
        backgroundColor: '#fff',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: withOpacityHex('#1D1D1D', .2),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: '#E5E5E5',
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
    
});
