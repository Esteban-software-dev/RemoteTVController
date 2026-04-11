import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
    ActivityIndicator,
    Insets,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from 'react-native';

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

    const ripple = filled
        ? androidRipple({ color: withOpacityHex(colors.white.base, 0.22) })
        : androidRipple({ color: withOpacityHex(color, 0.16) });

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            android_ripple={ripple}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            hitSlop={hitSlop}
            style={({ pressed }) => [
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
                isDisabled ? null : iosPressOpacity(pressed, false),
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={contentColor} />
            ) : (
                <IonIcon name={iconName} size={sizeMap.icon} color={contentColor} />
            )}
            {label ? <Text style={[styles.label, { color: contentColor }]}>{label}</Text> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: radius.md,
        overflow: 'hidden',
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
