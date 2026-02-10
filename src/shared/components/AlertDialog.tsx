import React, { ReactNode, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { IonIcon } from '@src/shared/components/IonIcon';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';

export type AlertRole = 'cancel' | 'destructive' | 'default';

export type AlertButton = {
    label: string;
    role?: AlertRole;
    onPress?: () => void;
    color?: string;
};

export type AlertPreset = 'default' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertDialogProps {
    visible: boolean;
    title?: string;
    message?: string;
    content?: ReactNode;
    iconName?: IoniconsIconName;
    iconColor?: string;
    preset?: AlertPreset;
    buttons?: AlertButton[];
    backdropDismiss?: boolean;
    onDidDismiss?: () => void;
    onClose: () => void;
}

export function AlertDialog({
    visible,
    title,
    message,
    content,
    iconName,
    iconColor = colors.accent.purple.base,
    preset = 'default',
    buttons = [],
    backdropDismiss = true,
    onDidDismiss,
    onClose,
}: AlertDialogProps) {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.96);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 180 });
            scale.value = withTiming(1, { duration: 180 });
            return;
        }
        opacity.value = withTiming(0, { duration: 140 });
        scale.value = withTiming(0.96, { duration: 140 });
        const id = setTimeout(() => onDidDismiss?.(), 160);
        return () => clearTimeout(id);
    }, [visible, onDidDismiss]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const presetConfig = getPresetConfig(preset);
    const resolvedIcon = iconName ?? presetConfig.iconName;
    const resolvedIconColor = iconColor ?? presetConfig.iconColor;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.container}>
                <Pressable
                    style={styles.backdrop}
                    onPress={backdropDismiss ? onClose : undefined}
                />
                <Animated.View style={[styles.card, animatedStyle]}>
                    {resolvedIcon ? (
                        <View style={[styles.iconWrap, { backgroundColor: presetConfig.iconBg }]}>
                            <IonIcon name={resolvedIcon} size={20} color={resolvedIconColor} />
                        </View>
                    ) : null}
                    {title ? <Text style={styles.title}>{title}</Text> : null}
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    {content ? <View style={styles.content}>{content}</View> : null}

                    {buttons.length > 0 ? (
                        <View style={styles.actions}>
                            {buttons.map((btn, idx) => (
                                <Pressable
                                key={`${btn.label}-${idx}`}
                                onPress={() => {
                                    btn.onPress?.();
                                    onClose();
                                }}
                                style={({ pressed }) => ([
                                    styles.actionButton,
                                    pressed ? styles.actionPressed : null,
                                    btn.role === 'destructive' ? styles.actionDanger : null,
                                    btn.color ? { backgroundColor: btn.color, borderColor: btn.color } : null,
                                ])}>
                                    <Text style={[
                                        styles.actionText,
                                        btn.role === 'destructive' ? styles.actionDangerText : null,
                                        btn.role === 'cancel' ? styles.actionCancelText : null,
                                        btn.color ? { color: getContrastColor(btn.color) } : null,
                                    ]}>
                                        {btn.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    card: {
        width: '85%',
        borderRadius: radius.lg,
        padding: spacing.lg,
        backgroundColor: colors.bone.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.08),
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.semibold,
        color: colors.dark.base,
        marginBottom: spacing.xs,
    },
    message: {
        fontSize: typography.size.md,
        color: withOpacityHex(colors.dark.base, 0.7),
        marginBottom: spacing.md,
    },
    content: {
        marginBottom: spacing.md,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
    },
    actionButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        backgroundColor: colors.accent.gray.base,
    },
    actionPressed: {
        opacity: 0.85,
    },
    actionText: {
        fontSize: typography.size.sm,
        fontFamily: typography.fontFamily.semibold,
        color: colors.dark.base,
    },
    actionCancelText: {
        color: colors.accent.gray.text,
    },
    actionDanger: {
        backgroundColor: withOpacityHex(colors.state.danger, 0.12),
    },
    actionDangerText: {
        color: colors.state.danger,
    },
});

function getPresetConfig(preset: AlertPreset) {
    switch (preset) {
        case 'info':
            return {
                iconName: 'information-circle-outline' as IoniconsIconName,
                iconColor: colors.state.info,
                iconBg: withOpacityHex(colors.state.info, 0.12),
            };
        case 'success':
            return {
                iconName: 'checkmark-circle-outline' as IoniconsIconName,
                iconColor: colors.state.success,
                iconBg: withOpacityHex(colors.state.success, 0.12),
            };
        case 'warning':
            return {
                iconName: 'warning-outline' as IoniconsIconName,
                iconColor: colors.state.warning,
                iconBg: withOpacityHex(colors.state.warning, 0.12),
            };
        case 'danger':
            return {
                iconName: 'close-circle-outline' as IoniconsIconName,
                iconColor: colors.state.danger,
                iconBg: withOpacityHex(colors.state.danger, 0.12),
            };
        default:
            return {
                iconName: 'alert-circle-outline' as IoniconsIconName,
                iconColor: colors.accent.purple.base,
                iconBg: withOpacityHex(colors.accent.purple.base, 0.12),
            };
    }
}
