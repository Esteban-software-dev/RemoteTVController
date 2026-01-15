import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SCALE = 1.25;
const EXTRA_X = width * (SCALE - 1);
const EXTRA_Y = height * (SCALE - 1);

export function AppBackground() {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 90000 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            progress.value,
            [0, 1],
            [-EXTRA_X / 2, EXTRA_X / 2]
        );

        const translateY = interpolate(
            progress.value,
            [0, 1],
            [-EXTRA_Y / 2, EXTRA_Y / 2]
        );

        return {
            transform: [
                { translateX },
                { translateY },
                { scale: SCALE },
            ],
        };
    });

    return (
        <Animated.Image
            source={require('@src/assets/backgrounds/background-image.png')}
            style={[styles.image, animatedStyle]}
            resizeMode="cover"
            blurRadius={10}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        width,
        height,
        top: 0,
        left: 0,
    },
});
