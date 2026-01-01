import React, { useEffect } from 'react'
import { Pressable, PressableProps, Text, ViewStyle, TextStyle } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated'
import { colors } from '@src/config/theme/colors/colors'
import { radius } from '@src/config/theme/tokens'
import { IonIcon } from './IonIcon'
import { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { getContrastColor } from '@src/config/theme/utils/contrast-color'

type Variant = 'filled' | 'outline'
type Size = 'sm' | 'md'

interface SmallButtonProps extends PressableProps {
    label?: string
    iconName?: IoniconsIconName
    iconSize?: number
    iconColor?: string
    color?: string;
    variant?: Variant
    size?: Size

    containerStyle?: ViewStyle
    textStyle?: TextStyle
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SmallButton({
    label,
    iconName,
    iconSize = 15,

    color = colors.dark.base,
    variant = 'outline',
    size = 'sm',

    disabled,
    containerStyle,
    textStyle,

    ...pressableProps
}: SmallButtonProps) {
    const isIconOnly = !!iconName && !label;

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const contentColor =
        variant === 'filled'
            ? getContrastColor(color)
            : color;

    useEffect(() => {
        opacity.value = withTiming(disabled ? 0.6 : 1, { duration: 180 });
    }, [disabled]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

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
            : {
                backgroundColor: colors.white.base,
                borderWidth: 1,
                borderColor: color,
            };

    return (
        <AnimatedPressable
            disabled={disabled}
            onPressIn={() => {
                scale.value = withTiming(0.96, { duration: 90 });
            }}
            onPressOut={() => {
                scale.value = withTiming(1, { duration: 120 });
            }}
            style={[
                baseStyle,
                variantStyle,
                animatedStyle,
                containerStyle,
            ]}
            {...pressableProps}
        >
            {iconName && (
                <IonIcon
                    name={iconName}
                    size={iconSize}
                    color={contentColor}
                />
            )}

            {label && (
                <Text
                    style={[
                        {
                            fontSize: 13,
                            fontWeight: '500',
                            color: contentColor,
                        },
                        textStyle,
                    ]}
                >
                    {label}
                </Text>
            )}
        </AnimatedPressable>
    );
}

