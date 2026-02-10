import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ViewStyle,
} from 'react-native';
import React from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { radius, spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { SmallButton } from '@src/shared/components/SmallButton';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionItemProps {
    id: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;

    /** Opcional */
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: (id: string) => void;

    containerStyle?: ViewStyle;
}

export function ActionItem({
    id,
    title,
    subtitle,
    icon,
    onPress,
    actionLabel,
    onAction,
    containerStyle,
}: ActionItemProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
        onPressIn={() => {
            scale.value = withTiming(0.985, { duration: 80 });
        }}
        onPressOut={() => {
            scale.value = withTiming(1, { duration: 120 });
        }}
        onPress={onPress}
        style={[styles.container, animatedStyle, containerStyle]}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}

            <View style={styles.textZone}>
                <Text style={styles.name} numberOfLines={1}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={styles.subtext} numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {/* Action */}
            {actionLabel && onAction && (
                <SmallButton
                    label={actionLabel}
                    size="sm"
                    variant="outline"
                    color={colors.gradient[2]}
                    onPress={() => onAction(id)}
                />
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: withOpacityHex(colors.dark.base, 0.035),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.06),
    },
    iconWrapper: {
        width: 42,
        height: 42,
        borderRadius: radius.lg,
        backgroundColor: withOpacityHex(colors.white.base, 0.04),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    textZone: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.dark.base,
    },
    subtext: {
        fontSize: 12,
        color: withOpacityHex(colors.dark.base, 0.5),
    },
});
