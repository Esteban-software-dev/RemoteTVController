import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { VerticalProgressBar } from '@src/shared/components/VerticalProgressBar';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TRACK_HEIGHT = 172;
const DEFAULT_VALUE = 0.55;
const STEP_COUNT = 12;
const EMIT_INTERVAL_MS = 120;

const clamp = (value: number) => Math.max(0, Math.min(1, value));

interface VerticalVolumeControlProps {
    onVolumeUp: () => void | Promise<void>;
    onVolumeDown: () => void | Promise<void>;
    disabled?: boolean;
    value?: number;
    initialValue?: number;
    onPreviewChange?: (value: number) => void;
}

export function VerticalVolumeControl({
    onVolumeUp,
    onVolumeDown,
    disabled = false,
    value,
    initialValue = DEFAULT_VALUE,
    onPreviewChange,
}: VerticalVolumeControlProps) {
    const { t } = useTranslation();
    const initialProgress = clamp(value ?? initialValue);

    const progressRef = useRef(initialProgress);
    const commandStepRef = useRef(Math.round(initialProgress * STEP_COUNT));
    const lastEmitAtRef = useRef(0);

    const progressSV = useSharedValue(initialProgress);
    const dragStartProgressSV = useSharedValue(initialProgress);
    const upScale = useSharedValue(1);
    const downScale = useSharedValue(1);

    useEffect(() => {
        if (typeof value !== 'number') return;

        const next = clamp(value);
        progressRef.current = next;
        commandStepRef.current = Math.round(next * STEP_COUNT);
        progressSV.value = withTiming(next, { duration: 90 });
        dragStartProgressSV.value = next;
        onPreviewChange?.(next);
    }, [dragStartProgressSV, onPreviewChange, progressSV, value]);

    const emitDirectionalStep = async (direction: 'up' | 'down') => {
        if (disabled) return;

        const now = Date.now();
        if (now - lastEmitAtRef.current < EMIT_INTERVAL_MS) return;
        lastEmitAtRef.current = now;

        if (direction === 'up') {
            commandStepRef.current = Math.min(STEP_COUNT, commandStepRef.current + 1);
            progressRef.current = clamp(Math.max(progressRef.current, commandStepRef.current / STEP_COUNT));
            progressSV.value = withTiming(progressRef.current, { duration: 90 });
            onPreviewChange?.(progressRef.current);
            await onVolumeUp();
            return;
        }

        commandStepRef.current = Math.max(0, commandStepRef.current - 1);
        progressRef.current = clamp(Math.min(progressRef.current, commandStepRef.current / STEP_COUNT));
        progressSV.value = withTiming(progressRef.current, { duration: 90 });
        onPreviewChange?.(progressRef.current);
        await onVolumeDown();
    };

    const handleButtonPress = async (direction: 'up' | 'down') => {
        if (disabled) return;

        if (direction === 'up') {
            progressRef.current = clamp(progressRef.current + 1 / STEP_COUNT);
        } else {
            progressRef.current = clamp(progressRef.current - 1 / STEP_COUNT);
        }

        progressSV.value = withTiming(progressRef.current, { duration: 80 });
        onPreviewChange?.(progressRef.current);

        await emitDirectionalStep(direction);
    };

    const beginDrag = () => {
        commandStepRef.current = Math.round(progressRef.current * STEP_COUNT);
        dragStartProgressSV.value = progressRef.current;
    };

    const handleDragProgress = (next: number) => {
        if (disabled) return;

        const clamped = clamp(next);
        progressRef.current = clamped;
        onPreviewChange?.(clamped);

        const targetStep = Math.round(clamped * STEP_COUNT);
        const delta = targetStep - commandStepRef.current;

        if (delta > 0) {
            void emitDirectionalStep('up');
        } else if (delta < 0) {
            void emitDirectionalStep('down');
        }
    };

    const endDrag = () => {
        dragStartProgressSV.value = progressRef.current;
    };

    const panGesture = Gesture.Pan()
        .enabled(!disabled)
        .onBegin(() => {
            runOnJS(beginDrag)();
        })
        .onUpdate((event) => {
            const rawNext = dragStartProgressSV.value - event.translationY / TRACK_HEIGHT;
            const next = Math.max(0, Math.min(1, rawNext));
            progressSV.value = next;
            runOnJS(handleDragProgress)(next);
        })
        .onEnd(() => {
            runOnJS(endDrag)();
        })
        .onFinalize(() => {
            runOnJS(endDrag)();
        });

    const upButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: upScale.value }],
    }));

    const downButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: downScale.value }],
    }));

    return (
        <View style={[styles.root, disabled ? styles.rootDisabled : null]}>
            <AnimatedPressable
                accessibilityRole="button"
                accessibilityLabel={t('remoteControl.actions.volumeUp')}
                accessibilityHint={t('remoteControl.actions.volumeUpHint')}
                accessibilityState={{ disabled }}
                disabled={disabled}
                hitSlop={10}
                onPress={() => {
                    void handleButtonPress('up');
                }}
                onPressIn={() => {
                    upScale.value = withTiming(1.08, { duration: 90 });
                }}
                onPressOut={() => {
                    upScale.value = withTiming(1, { duration: 120 });
                }}
                style={[styles.iconButton, upButtonStyle]}>
                <IonIcon name="add" size={18} color={colors.accent.teal.strong} />
            </AnimatedPressable>

            <GestureDetector gesture={panGesture}>
                <View
                    accessibilityRole="adjustable"
                    accessibilityLabel={t('remoteControl.actions.volumeSlider')}
                    accessibilityHint={t('remoteControl.actions.volumeSliderHint')}
                    style={styles.sliderWrap}>
                    <VerticalProgressBar
                        progress={progressRef.current}
                        animatedProgress={progressSV}
                        height={TRACK_HEIGHT}
                        width={22}
                        trackColor={withOpacityHex(colors.accent.gray.base, 0.22)}
                        fillColor={colors.accent.teal.strong}
                    />
                </View>
            </GestureDetector>

            <AnimatedPressable
                accessibilityRole="button"
                accessibilityLabel={t('remoteControl.actions.volumeDown')}
                accessibilityHint={t('remoteControl.actions.volumeDownHint')}
                accessibilityState={{ disabled }}
                disabled={disabled}
                hitSlop={10}
                onPress={() => {
                    void handleButtonPress('down');
                }}
                onPressIn={() => {
                    downScale.value = withTiming(1.08, { duration: 90 });
                }}
                onPressOut={() => {
                    downScale.value = withTiming(1, { duration: 120 });
                }}
                style={[styles.iconButton, downButtonStyle]}>
                <IonIcon name="remove" size={18} color={colors.accent.teal.strong} />
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: 58,
        borderRadius: radius.xl,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.icon, 0.14),
        shadowColor: colors.accent.teal.strong,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    rootDisabled: {
        opacity: 0.55,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: withOpacityHex(colors.accent.teal.strong, 0.08),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.teal.strong, 0.18),
    },
    sliderWrap: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: radius.xl,
    },
});
