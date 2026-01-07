import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import { colors } from '@src/config/theme/colors/colors';
import { radius } from '@src/config/theme/tokens';

interface GradientProps {
    colors?: string[];
    start?: LinearGradientProps['start'];
    end?: LinearGradientProps['end'];
    style?: any;
}

export function Gradient({
    colors: gradientColors = [
        colors.gradient[1],
        colors.gradient[2],
        colors.gradient[3],
    ],
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    style,
}: GradientProps) {
    return (
        <LinearGradient
            colors={gradientColors}
            start={start}
            end={end}
            style={[StyleSheet.absoluteFill, styles.gradient, style]}
        />
    );
}

const styles = StyleSheet.create({
    gradient: {
        borderRadius: radius.lg
    }
});