import React, { useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

import { colors } from '@src/config/theme/colors/colors';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { GradientCard } from '@src/shared/components/GradientCard';
import { IonIcon } from '@src/shared/components/IonIcon';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface TVDeviceItemProps extends RokuDeviceInfo {
    index?: number;
    onPress?: (device: RokuDeviceInfo) => void;

    selected?: boolean;
    disabled?: boolean;
    showChevron?: boolean;

    containerStyle?: ViewStyle;
}

export function RokuTVItem({
    index = 0,
    onPress,
    containerStyle,

    selected = false,
    disabled = false,
    showChevron = true,

    ip,
    friendlyDeviceName,
    modelName,
    softwareVersion,
}: TVDeviceItemProps) {
    const scale = useSharedValue(1);
    const selectedAnim = useSharedValue(selected ? 1 : 0);
    const activeDeviceBG = withOpacityHex(colors.green.base, .18)

    useEffect(() => {
        selectedAnim.value = withTiming(selected ? 1 : 0, {
            duration: 220,
        })
    }, [selected]);

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        backgroundColor: interpolateColor(
            selectedAnim.value,
            [0, 1],
            [colors.white.base, 'rgba(77, 109, 79, 0.08)']
        ),
        borderColor: interpolateColor(
            selectedAnim.value,
            [0, 1],
            ['transparent', colors.green.base]
        ),
        opacity: disabled ? 0.45 : 1,
    }));

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            selectedAnim.value,
            [0, 1],
            [colors.white.base, activeDeviceBG]
        ),
        borderColor: interpolateColor(
            selectedAnim.value,
            [0, 1],
            [colors.dark.base, colors.green.base]
        )
    }));

    return (
        <Animated.View entering={FadeInUp.delay(index * 40)}>
            <Animated.View
                style={[containerStyle, animatedCardStyle, { borderRadius: radius.lg }]}>
                <GradientCard>
                    <Animated.View>
                        <Pressable
                        disabled={disabled}
                        onPress={() =>
                            onPress?.({
                                ip,
                                friendlyDeviceName,
                                modelName,
                                softwareVersion,
                            } as RokuDeviceInfo)
                        }
                        onPressIn={() => {
                            if (!disabled) {
                                scale.value = withTiming(0.97, { duration: 90 })
                            }
                        }}
                        onPressOut={() => {
                            scale.value = withTiming(1, { duration: 120 })
                        }}
                        style={styles.card}>
                            <Animated.View style={[styles.icon, iconAnimatedStyle]}>
                                <IonIcon
                                    name="tv"
                                    size={18}
                                    color={selected ? colors.green.base : colors.dark.base}
                                />
                            </Animated.View>

                            <View style={styles.info}>
                                <Text
                                    style={[
                                        styles.name,
                                        selected && { color: '#2F4F2F' },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {friendlyDeviceName}
                                </Text>

                                <Text style={styles.subtitle} numberOfLines={1}>
                                    {ip}
                                </Text>
                            </View>

                            {showChevron && !disabled && (
                                <IonIcon
                                    name="chevron-forward"
                                    size={18}
                                    color={withOpacityHex(colors.dark.base, .35)}
                                />
                            )}
                        </Pressable>
                    </Animated.View>
                </GradientCard>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .6
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark.base,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
        color: withOpacityHex(colors.dark.base, .6),
    },
})
