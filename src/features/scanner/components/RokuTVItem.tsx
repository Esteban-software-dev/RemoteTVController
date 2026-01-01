import React from 'react'
import { View, Text, Pressable, ViewStyle, StyleSheet } from 'react-native'
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated'
import { colors } from '@src/config/theme/colors/colors'
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor'
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types'
import { GradientCard } from '@src/shared/components/GradientCard'
import { IonIcon } from '@src/shared/components/IonIcon'
import { radius, spacing } from '@src/config/theme/tokens'

interface TVDeviceItemProps extends RokuDeviceInfo {
    index?: number
    onPress?: (device: RokuDeviceInfo) => void
    containerStyle?: ViewStyle
    showChevron?: boolean
}

export function TVDeviceItem({
    index = 0,
    onPress,
    containerStyle,
    showChevron = true,

    ip,
    friendlyDeviceName,
    modelName,
    softwareVersion,
}: TVDeviceItemProps) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
        entering={FadeInUp.delay(index * 40)}
        style={[containerStyle, animatedStyle]}>
            <GradientCard>
                <Animated.View>
                    <Pressable
                    onPress={() =>
                        onPress?.({
                            ip,
                            friendlyDeviceName,
                            modelName,
                            softwareVersion,
                        } as RokuDeviceInfo)
                    }
                    onPressIn={() => {
                        scale.value = withTiming(0.98, { duration: 90 })
                    }}
                    onPressOut={() => {
                        scale.value = withTiming(1, { duration: 120 })
                    }}
                    style={styles.card}>
                        <View style={styles.icon}>
                            <IonIcon name="tv" size={18} />
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.name} numberOfLines={1}>
                                {friendlyDeviceName}
                            </Text>

                            <Text style={styles.subtitle} numberOfLines={1}>
                                {ip}
                            </Text>
                        </View>

                        {showChevron && (
                            <IonIcon
                                name="chevron-forward"
                                size={18}
                                color={withOpacityHex(colors.dark.base, 0.4)}
                            />
                        )}
                    </Pressable>
                </Animated.View>
            </GradientCard>
        </Animated.View>
    )
}

export const styles = StyleSheet.create({
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
        backgroundColor: colors.white.base,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: withOpacityHex(colors.dark.base, 0.6),
    },
});
