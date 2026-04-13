import React from 'react';
import {
    View,
    Text,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import { colors } from '@src/config/theme/colors/colors';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { GradientCard } from '@src/shared/components/GradientCard';
import { IonIcon } from '@src/shared/components/IonIcon';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { androidRippleLightInkForeground, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';

interface TVDeviceItemProps extends RokuDeviceInfo {
    index?: number;
    onPress?: (device: RokuDeviceInfo) => void;

    selected?: boolean;
    disabled?: boolean;
    showChevron?: boolean;

    containerStyle?: ViewStyle;
}

export function RokuTVItem({
    index: _index = 0,
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
    const activeDeviceBG = withOpacityHex(colors.green.base, 0.18);
    const iconBg = disabled
        ? withOpacityHex(colors.accent.gray.base, 0.22)
        : selected
            ? activeDeviceBG
            : colors.white.base;
    const iconBorder = disabled
        ? withOpacityHex(colors.dark.base, 0.08)
        : selected
            ? colors.green.base
            : withOpacityHex(colors.dark.base, 0.12);
    const iconColor = disabled
        ? colors.accent.gray.icon
        : selected
            ? colors.green.base
            : colors.dark.base;

    return (
        <View>
            <View
                style={[
                    containerStyle,
                    styles.cardContainer,
                    disabled ? styles.cardOuterDisabled : null,
                    { borderRadius: radius.lg },
                ]}>
                <GradientCard>
                    <View>
                        <PressableFeedback
                        disabled={disabled}
                        feedbackDisabled={disabled || selected}
                        onPress={() => {
                            onPress?.({
                                ip,
                                friendlyDeviceName,
                                modelName,
                                softwareVersion,
                            } as RokuDeviceInfo)
                        }}
                        android_ripple={androidRippleLightInkForeground({color: withOpacityHex(colors.dark.base, 0.1)})}
                        style={({ pressed }) => [
                            styles.card,
                            disabled ? styles.cardInnerDisabled : null,
                            disabled ? null : iosPressOpacity(pressed, false),
                        ]}>
                            <View
                                style={[
                                    styles.icon,
                                    { backgroundColor: iconBg, borderColor: iconBorder },
                                    selected && !disabled ? styles.iconSelected : null,
                                ]}>
                                <IonIcon name="tv" size={18} color={iconColor} />
                            </View>

                            <View style={styles.info}>
                                <Text
                                    style={[
                                        styles.name,
                                        disabled ? styles.nameDisabled : null,
                                        selected && !disabled ? styles.nameSelected : null,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {friendlyDeviceName}
                                </Text>

                                <Text
                                    style={[styles.subtitle, disabled ? styles.subtitleDisabled : null]}
                                    numberOfLines={1}>
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
                        </PressableFeedback>
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
    /** Borde y marco apagados — sin bajar opacidad de todo el bloque */
    cardOuterDisabled: {
        borderColor: withOpacityHex(colors.accent.gray.base, 0.55),
        backgroundColor: colors.bone.soft,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    cardInnerDisabled: {
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.12),
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.6,
    },
    iconSelected: {
        borderWidth: 1,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark.base,
    },
    nameSelected: {
        color: '#2F4F2F',
    },
    nameDisabled: {
        color: colors.accent.gray.text,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
        color: withOpacityHex(colors.dark.base, 0.6),
    },
    subtitleDisabled: {
        color: withOpacityHex(colors.accent.gray.text, 0.85),
    },
})
