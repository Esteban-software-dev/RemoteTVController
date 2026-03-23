import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { IonIcon } from '@src/shared/components/IonIcon';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Insets,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RemoteActionButtonProps {
    iconName: IoniconsIconName;
    label?: string;
    onPress?: () => void;
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'soft' | 'filled';
    iconOnly?: boolean;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    loading?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    hitSlop?: number | Insets;
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
    disabled = false,
    loading = false,
    accessibilityLabel,
    accessibilityHint,
    hitSlop,
}: RemoteActionButtonProps) {
    const sizeMap = {
        sm: { height: 42, minWidth: 42, icon: 16, px: spacing.sm },
        md: { height: 50, minWidth: 50, icon: 18, px: spacing.md },
        lg: { height: 56, minWidth: 56, icon: 19, px: spacing.md },
    }[size];

    const filled = variant === 'filled';
    const contentColor = filled ? getContrastColor(color) : color;
    const isDisabled = disabled || loading;

    const scale = useSharedValue(0.96);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withTiming(1, { duration: 140 });
        opacity.value = withTiming(1, { duration: 140 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedPressable
            disabled={isDisabled}
            onPress={onPress}
            onPressIn={() => {
                if (isDisabled) return;
                scale.value = withTiming(0.96, { duration: 90 });
            }}
            onPressOut={() => {
                if (isDisabled) return;
                scale.value = withTiming(1, { duration: 120 });
            }}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            hitSlop={hitSlop}
            style={[
                styles.button,
                isDisabled ? styles.buttonDisabled : null,
                {
                    minHeight: sizeMap.height,
                    minWidth: sizeMap.minWidth,
                    paddingHorizontal: iconOnly ? 0 : sizeMap.px,
                    borderColor: color,
                    backgroundColor: filled ? color : colors.white.base,
                    borderRadius: size === 'lg' ? radius.lg : radius.md,
                    shadowColor: color,
                    shadowOpacity: filled ? 0.22 : 0.12,
                    shadowRadius: filled ? 10 : 8,
                    shadowOffset: { width: 0, height: filled ? 4 : 3 },
                    elevation: filled ? 6 : 3,
                },
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={contentColor} />
            ) : (
                <IonIcon name={iconName} size={sizeMap.icon} color={contentColor} />
            )}
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
    buttonDisabled: {
        opacity: 0.58,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
    },
});
