import React from 'react';
import { Pressable, PressableProps, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors } from '@src/config/theme/colors/colors';
import { radius } from '@src/config/theme/tokens';
import { IonIcon } from './IonIcon';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

type Variant = 'filled' | 'outline' | 'ghost';
type Size = 'sm' | 'md';

export interface SmallButtonProps extends PressableProps {
    label?: string;
    iconName?: IoniconsIconName;
    iconSize?: number;
    iconColor?: string;
    color?: string;
    variant?: Variant;
    size?: Size;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
    stopPropagation?: boolean;
    reduceAnimations?: boolean;
}

export function SmallButton({
    label,
    iconName,
    iconSize = 15,
    color = colors.dark.base,
    variant = 'outline',
    size = 'sm',
    disabled = false,
    containerStyle,
    textStyle,
    stopPropagation = false,
    reduceAnimations = false,
    ...pressableProps
}: SmallButtonProps) {
    const isIconOnly = !!iconName && !label;

    const contentColor = variant === 'filled' ? getContrastColor(color) : color;
    const outlineBg = withOpacityHex(color, 0.05);

    const sizeStyles = {
        sm: {
            height: 30,
            paddingHorizontal: isIconOnly ? 0 : 12,
            minWidth: 30,
        },
        md: {
            height: 38,
            paddingHorizontal: isIconOnly ? 0 : 16,
            minWidth: 38,
        },
    }[size];

    const baseStyle: ViewStyle = {
        ...sizeStyles,
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
    };

    const variantStyle: ViewStyle =
        variant === 'filled'
            ? {
                backgroundColor: color,
            }
            : variant === 'outline'
                ? {
                    backgroundColor: outlineBg,
                    borderWidth: 1,
                    borderColor: color,
                }
                : {
                    backgroundColor: outlineBg,
                    borderWidth: 0,
                };

    return (
        <Pressable
        disabled={disabled}
        onPressIn={(e) => {
            if (stopPropagation) {
                e.stopPropagation();
            }
        }}
        style={({ pressed }) => [
            baseStyle,
            variantStyle,
            disabled ? { opacity: 0.6 } : null,
            pressed
                ? reduceAnimations
                    ? { opacity: 0.95 }
                    : { transform: [{ scale: 0.98 }], opacity: 0.9 }
                : null,
            containerStyle,
        ]}
        {...pressableProps}>
            {iconName ? (
                <IonIcon
                    name={iconName}
                    size={iconSize}
                    color={contentColor}
                />
            ) : null}

            {label ? (
                <Text
                style={[
                    {
                        fontSize: 13,
                        fontWeight: '500',
                        color: contentColor,
                    },
                    textStyle,
                ]}>
                    {label}
                </Text>
            ) : null}
        </Pressable>
    );
}
