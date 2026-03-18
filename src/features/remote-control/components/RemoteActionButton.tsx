import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import React, { useEffect } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
    mass: 0.8,
};

interface RemoteActionButtonProps {
    iconName: IoniconsIconName;
    label?: string;
    onPress?: () => void;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'soft' | 'filled';
    iconOnly?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function RemoteActionButton({
    iconName,
    label,
    onPress,
    color = colors.accent.purple.base,
    size = 'md',
    variant = 'soft',
    iconOnly = false,
    style,
}: RemoteActionButtonProps) {
    const sizeMap = {
        sm: { height: 42, minWidth: 42, icon: 16, px: spacing.sm },
        md: { height: 50, minWidth: 50, icon: 18, px: spacing.md },
        lg: { height: 56, minWidth: 56, icon: 19, px: spacing.md },
    }[size];

    const filled = variant === 'filled';
    const contentColor = filled ? getContrastColor(color) : color;

    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, SPRING_CONFIG);
        opacity.value = withTiming(1, { duration: 150 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={() => {
                scale.value = withSpring(0.94, SPRING_CONFIG);
            }}
            onPressOut={() => {
                scale.value = withSpring(1, SPRING_CONFIG);
            }}
            style={[
                styles.button,
                {
                    minHeight: sizeMap.height,
                    minWidth: sizeMap.minWidth,
                    paddingHorizontal: iconOnly ? 0 : sizeMap.px,
                    borderColor: withOpacityHex(color, filled ? 0.88 : 0.45),
                    backgroundColor: filled ? color : withOpacityHex(color, 0.1),
                    borderRadius: size === 'lg' ? radius.lg : radius.md,
                    shadowColor: color,
                    shadowOpacity: filled ? 0.25 : 0,
                    shadowRadius: filled ? 10 : 0,
                    shadowOffset: { width: 0, height: filled ? 4 : 0 },
                    elevation: filled ? 6 : 0,
                },
                animatedStyle,
                style,
            ]}
        >
            <IonIcon name={iconName} size={sizeMap.icon} color={contentColor} />
            {label ? <Text style={[styles.label, { color: contentColor }]}>{label}</Text> : null}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: radius.md,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
    },
});
