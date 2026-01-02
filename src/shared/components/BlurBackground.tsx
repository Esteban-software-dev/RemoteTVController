import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { colors } from '@src/config/theme/colors/colors';

interface BlurBackgroundProps {
    blurType?: 'light' | 'dark' | 'extraDark';
    blurAmount?: number;
    tintColor?: string;
    style?: ViewStyle | ViewStyle[];
}

export function BlurBackground({
    blurType = 'light',
    blurAmount = 5,
    tintColor = 'rgba(255, 255, 255, 0.09)',
    style,
}: BlurBackgroundProps) {
    return (
        <View style={[StyleSheet.absoluteFill, style]}>
            <BlurView
                blurType={blurType}
                blurAmount={blurAmount}
                reducedTransparencyFallbackColor={colors.white.base}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }]}
            />
        </View>
    );
}
