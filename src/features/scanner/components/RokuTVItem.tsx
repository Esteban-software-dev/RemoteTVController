import React from 'react';
import {
    View,
    Text,
    Pressable,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import { colors } from '@src/config/theme/colors/colors';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { GradientCard } from '@src/shared/components/GradientCard';
import { IonIcon } from '@src/shared/components/IonIcon';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';

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
    const activeDeviceBG = withOpacityHex(colors.green.base, .18)
    return (
        <View>
            <View
                style={[
                    containerStyle,
                    styles.cardContainer,
                    disabled ? styles.cardDisabled : null,
                    { borderRadius: radius.lg },
                ]}>
                <GradientCard>
                    <View>
                        <Pressable
                        disabled={disabled}
                        onPress={() => {
                            onPress?.({
                                ip,
                                friendlyDeviceName,
                                modelName,
                                softwareVersion,
                            } as RokuDeviceInfo)
                        }}
                        android_ripple={androidRipple({ color: withOpacityHex(colors.dark.base, 0.1) })}
                        style={({ pressed }) => [
                            styles.card,
                            disabled ? null : iosPressOpacity(pressed, false),
                        ]}>
                            <View
                                style={[
                                    styles.icon,
                                    selected ? styles.iconSelected : null,
                                    { backgroundColor: selected ? activeDeviceBG : colors.white.base }
                                ]}>
                                <IonIcon
                                    name="tv"
                                    size={18}
                                    color={selected ? colors.green.base : colors.dark.base}
                                />
                            </View>

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
                    </View>
                </GradientCard>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardDisabled: {
        opacity: 0.45,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .6
    },
    iconSelected: {
        borderColor: colors.green.base,
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
