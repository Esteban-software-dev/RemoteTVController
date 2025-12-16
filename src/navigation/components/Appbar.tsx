import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

const HEADER_HEIGHT = 70;
const MAX_DRAG = 12;
const applyResistance = (value: number) => {
    const abs = Math.abs(value);
    const sign = Math.sign(value);

    if (abs < MAX_DRAG) return value;

    return sign * (MAX_DRAG + (abs - MAX_DRAG) * 0.25);
};

export function AppBar() {
    const insets = useSafeAreaInsets();

    const dragX = useSharedValue(0);
    const dragY = useSharedValue(0);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) =>
                Math.abs(g.dx) > 1 || Math.abs(g.dy) > 1,

            onPanResponderMove: (_, g) => {
                dragX.value = applyResistance(g.dx);
                dragY.value = applyResistance(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                dragX.value = withSpring(0, {
                    velocity: g.vx * 300,
                    damping: 14,
                    stiffness: 180,
                    mass: 0.8,
                });

                dragY.value = withSpring(0, {
                    velocity: g.vy * 300,
                    damping: 14,
                    stiffness: 180,
                    mass: 0.8,
                });
            },

            onPanResponderTerminate: () => {
                dragX.value = withSpring(0);
                dragY.value = withSpring(0);
            },
        })
    ).current;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: dragX.value },
            { translateY: dragY.value },
        ],
    }));

    return (
        <View style={[styles.container,
        {
            paddingTop: insets.top === 0 ? spacing.sm : insets.top,
            paddingBottom: insets.top === 0 ? spacing.sm : insets.top
        }]}>
            <Animated.View
            {...panResponder.panHandlers}
            style={animatedStyle}>
                <View style={styles.bar}>
                    <View style={styles.icon} />
                    <View style={styles.icon} />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
    },

    bar: {
        height: HEADER_HEIGHT,
        marginHorizontal: spacing.md,

        backgroundColor: '#fff',
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: withOpacityHex('#1D1D1D', .2),

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,

        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: '#E5E5E5',
    },
});
