import React from 'react';
import { PressableProps, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { androidRippleLightInkForeground, rippleClipStyle } from '@src/shared/ui/pressFeedback';
import { colors } from '@src/config/theme/colors/colors';
import { radius } from '@src/config/theme/tokens';
import { IonIcon } from './IonIcon';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { PressableFeedback } from './PressableFeedback';

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
        ...rippleClipStyle,
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

    const ripple =
        variant === 'filled'
            ? androidRippleLightInkForeground({ color: withOpacityHex(colors.dark.base, 0.22) })
            : androidRippleLightInkForeground({ color: withOpacityHex(color, 0.18) });

    return (
        <PressableFeedback
        disabled={disabled}
        pressDelayMs={20}
        android_ripple={ripple}
        onPressIn={(e) => {
            if (stopPropagation) {
                e.stopPropagation();
            }
        }}
        style={[
            baseStyle,
            variantStyle,
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
        </PressableFeedback>
    );
}
