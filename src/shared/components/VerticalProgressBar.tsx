import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { colors } from '@src/config/theme/colors/colors';
import { radius } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface VerticalProgressBarProps {
    progress: number;
    height?: number;
    width?: number;
    style?: StyleProp<ViewStyle>;
    trackColor?: string;
    fillColor?: string;
    showThumb?: boolean;
    animatedProgress?: SharedValue<number>;
}

export function VerticalProgressBar({
    progress,
    height = 168,
    width = 20,
    style,
    trackColor = withOpacityHex(colors.accent.gray.base, 0.28),
    fillColor = colors.accent.teal.strong,
    showThumb = true,
    animatedProgress,
}: VerticalProgressBarProps) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const progressSV = useSharedValue(clampedProgress);

    useEffect(() => {
        if (animatedProgress) return;
        progressSV.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 110 });
    }, [animatedProgress, progress, progressSV]);

    const fillStyle = useAnimatedStyle(() => {
        const rawProgress = animatedProgress ? animatedProgress.value : progressSV.value;
        const p = Math.max(0, Math.min(1, rawProgress));

        return {
            height: Math.max(8, height * p),
        };
    });

    const thumbStyle = useAnimatedStyle(() => {
        const rawProgress = animatedProgress ? animatedProgress.value : progressSV.value;
        const p = Math.max(0, Math.min(1, rawProgress));

        return {
            bottom: Math.max(4, height * p - 10),
        };
    });

    return (
        <View
            style={[
                styles.track,
                {
                    height,
                    width,
                    borderRadius: width / 2,
                    backgroundColor: trackColor,
                },
                style,
            ]}>
            <Animated.View
                style={[
                    styles.fill,
                    {
                        backgroundColor: fillColor,
                        borderRadius: width / 2,
                    },
                    fillStyle,
                ]}
            />
            {showThumb ? (
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: width + 8,
                            height: 10,
                            borderRadius: radius.pill,
                            backgroundColor: colors.white.base,
                            shadowColor: fillColor,
                        },
                        thumbStyle,
                    ]}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        justifyContent: 'flex-end',
        overflow: 'visible',
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.icon, 0.2),
    },
    fill: {
        width: '100%',
        minHeight: 8,
        alignSelf: 'center',
    },
    thumb: {
        position: 'absolute',
        left: -4,
        shadowOpacity: 0.14,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
});
