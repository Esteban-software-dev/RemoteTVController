import React, { ReactNode, useEffect, useMemo } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { t } from 'i18next';

export type ToastType = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'dark' | 'medium' | 'light';
export type ToastAlign = 'top' | 'bottom' | 'center' | 'custom';
export type ToastPosition = {
    top?: number;
    bottom?: number;
};

export type ToastActionButton = {
    label?: string;
    iconName?: IoniconsIconName;
    iconPosition?: 'left' | 'right';
    onPress?: (closeToast: () => void) => void;
    closeOnPress?: boolean;
};

export interface ToastProps {
    visible: boolean;
    title?: string;
    subtitle?: string;
    iconName?: IoniconsIconName;
    iconSource?: ImageSourcePropType;
    iconElement?: ReactNode;
    iconBlurRadius?: number;
    type?: ToastType;
    align?: ToastAlign;
    position?: ToastPosition;
    onClose: () => void;
    renderContent?: ReactNode;
    actionButton?: ToastActionButton | ToastActionButton[];
    showCloseButton?: boolean;
    closeLabel?: string;
    stackOffset?: number;
    stackScale?: number;
    onHoldStart?: () => void;
    onHoldEnd?: () => void;
}

const SPRING = {
    damping: 22,
    stiffness: 220,
    mass: 0.9,
};

const MAX_DRAG = 80;
const applyResistance = (value: number) => {
    'worklet';
    const abs = Math.abs(value);
    const sign = Math.sign(value);
    if (abs < MAX_DRAG) return value;
    return sign * (MAX_DRAG + (abs - MAX_DRAG) * 0.2);
};
const TYPE_STYLES: Record<ToastType, { bg: string; border: string; icon: string; text: string; action: string }> = {
    default: colors.toast.default,
    info: colors.toast.info,
    success: colors.toast.success,
    warning: colors.toast.warning,
    danger: colors.toast.danger,
    primary: colors.toast.primary,
    dark: colors.toast.dark,
    medium: colors.toast.medium,
    light: colors.toast.light,
};

export function Toast({
    visible,
    title,
    subtitle,
    iconName,
    iconSource,
    iconElement,
    iconBlurRadius,
    type = 'default',
    align = 'top',
    position,
    onClose,
    renderContent,
    actionButton,
    showCloseButton = true,
    closeLabel = t('components.toast.closeButton'),
    stackOffset = 0,
    stackScale = 1,
    onHoldStart,
    onHoldEnd,
}: ToastProps) {
    const initialOffset = align === 'top' ? -30 : 30;
    const translateY = useSharedValue(initialOffset);
    const opacity = useSharedValue(0);
    const startY = useSharedValue(0);
    const stackOffsetSV = useSharedValue(stackOffset);
    const stackScaleSV = useSharedValue(stackScale);
    const handleClosePress = () => {
        onClose();
    };
    const handleActionPress = (action: ToastActionButton) => {
        const shouldClose = action.closeOnPress !== false;
        if (action.onPress) {
            action.onPress(onClose);
            if (shouldClose) onClose();
            return;
        }
        if (shouldClose) onClose();
    };

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 180 });
            translateY.value = withSpring(0, SPRING);
            return;
        }
        opacity.value = withTiming(0, { duration: 160 });
        translateY.value = withTiming(initialOffset, { duration: 160 });
    }, [visible, initialOffset]);

    useEffect(() => {
        stackOffsetSV.value = withTiming(stackOffset, { duration: 220 });
        stackScaleSV.value = withTiming(stackScale, { duration: 220 });
    }, [stackOffset, stackScale]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value + stackOffsetSV.value },
            { scale: stackScaleSV.value },
        ],
        display: opacity.value === 0 ? 'none' : 'flex',
    }));

    const shouldCloseDown = align === 'bottom' || (align === 'custom' && position?.bottom !== undefined);
    const pan = Gesture.Pan()
        .activeOffsetY([-6, 6])
        .onBegin(() => {
            startY.value = translateY.value;
            if (onHoldStart) {
                runOnJS(onHoldStart)();
            }
        })
        .onUpdate((event) => {
            const drag = applyResistance(event.translationY);
            const damped = drag > 0 ? drag * 0.25 : drag;
            const next = startY.value + damped;
            // allow a tiny downward move, but focus on upward swipe to dismiss
            translateY.value = Math.max(-90, Math.min(next, 50));
        })
        .onEnd((event) => {
            const shouldClose = shouldCloseDown
                ? (event.translationY > 40 || event.velocityY > 900)
                : (event.translationY < -40 || event.velocityY < -900);
            if (shouldClose) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0, SPRING);
            }
        })
        .onFinalize(() => {
            if (onHoldEnd) {
                runOnJS(onHoldEnd)();
            }
        });

    const composedGesture = Gesture.Simultaneous(pan);

    const styleByType = TYPE_STYLES[type];
    const subtitleColor = useMemo(
        () => (type === 'warning' || type === 'light' ? withOpacityHex(styleByType.text, 0.8) : withOpacityHex(colors.white.base, 0.85)),
        [styleByType.text, type]
    );

    const actions = Array.isArray(actionButton) ? actionButton : (actionButton ? [actionButton] : []);
    const shouldRenderIcon = Boolean(iconElement || iconSource || iconName);

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.View
            style={[
                styles.toast,
                animatedStyle,
                getAlignStyle(align, position),
                {
                    backgroundColor: styleByType.bg,
                    borderColor: styleByType.border,
                },
            ]}
            >
                    {renderContent ? (
                        renderContent
                    ) : (
                        <View style={styles.row}>
                            {shouldRenderIcon ? (
                                <View style={styles.iconWrap}>
                                    {iconElement ? (
                                        iconElement
                                    ) : iconSource ? (
                                        <Image
                                            source={iconSource}
                                            style={styles.iconImage}
                                            resizeMode="contain"
                                            blurRadius={iconBlurRadius}
                                        />
                                    ) : (
                                        <IonIcon name={iconName!} size={18} color={styleByType.icon} />
                                    )}
                                </View>
                            ) : null}
                            <View style={styles.textBlock}>
                                {title ? (
                                    <Text style={[styles.title, { color: styleByType.text }]}>{title}</Text>
                                ) : null}
                                {subtitle ? (
                                    <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
                                ) : null}
                            </View>
                            {(actions.length > 0 || showCloseButton) ? (
                                <View style={styles.actions}>
                                    {actions
                                        .filter((action) => action.label || action.iconName)
                                        .map((action, index) => (
                                        <Pressable
                                        key={`${action.label ?? action.iconName ?? 'action'}-${index}`}
                                        onPress={() => handleActionPress(action)}
                                        style={({ pressed }) => ([
                                            styles.actionButton,
                                            pressed ? styles.actionButtonPressed : null,
                                        ])}>
                                            <View style={styles.actionContent}>
                                                {action.iconName && action.iconPosition !== 'right' && (
                                                    <IonIcon name={action.iconName} size={16} color={styleByType.action} />
                                                )}
                                                {action.label ? (
                                                    <Text style={[styles.actionText, { color: styleByType.action }]}>
                                                        {action.label}
                                                    </Text>
                                                ) : null}
                                                {action.iconName && action.iconPosition === 'right' && (
                                                    <IonIcon name={action.iconName} size={16} color={styleByType.action} />
                                                )}
                                            </View>
                                        </Pressable>
                                    ))}
                                    {showCloseButton ? (
                                        <Pressable
                                        onPress={handleClosePress}
                                        style={({ pressed }) => ([
                                            styles.actionButton,
                                            pressed ? styles.actionButtonPressed : null,
                                        ])}>
                                            <Text style={[styles.actionText, { color: styleByType.action }]}>
                                                {closeLabel}
                                            </Text>
                                        </Pressable>
                                    ) : null}
                                </View>
                            ) : null}
                        </View>
                    )}
            </Animated.View>
        </GestureDetector>
    );
}

function getAlignStyle(align: ToastAlign, position?: ToastPosition) {
    if (align === 'top') {
        return { top: 6 };
    }
    if (align === 'center') {
        return { top: '45%' as unknown as number };
    }
    if (align === 'custom' && position) {
        return position.top !== undefined ? { top: position.top } : { bottom: position.bottom ?? 18 };
    }
    return { bottom: 6 };
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        left: spacing.sm,
        right: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        shadowColor: colors.dark.base,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
        zIndex: 9999,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: withOpacityHex(colors.white.base, 0.15),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    iconImage: {
        width: 20,
        height: 20,
        borderRadius: 6,
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontSize: typography.size.md,
        fontFamily: typography.fontFamily.semibold,
    },
    subtitle: {
        marginTop: 2,
        fontSize: typography.size.sm,
    },
    actionButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
        backgroundColor: 'transparent',
    },
    actionButtonPressed: {
        opacity: 0.8,
    },
    actionText: {
        fontSize: typography.size.sm,
        fontFamily: typography.fontFamily.semibold,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});
