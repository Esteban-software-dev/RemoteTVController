import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { IonIcon } from '@src/shared/components/IonIcon';
import { VerticalProgressBar } from '@src/shared/components/VerticalProgressBar';
import { roundToLayoutPixel } from '@src/config/theme/utils/normalize-size';

const SHELL_WIDTH_DESIGN = 58;
const TRACK_HEIGHT_DESIGN = 172;
const TRACK_WIDTH_DESIGN = 22;
const ICON_BUTTON_DESIGN = 40;
const ICON_GLYPH_DESIGN = 18;
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
    /** Shell width from navigation layout (default 58). Scales track + buttons on narrow screens. */
    layoutWidth?: number;
}

export function VerticalVolumeControl({
    onVolumeUp,
    onVolumeDown,
    disabled = false,
    value,
    initialValue = DEFAULT_VALUE,
    onPreviewChange,
    layoutWidth,
}: VerticalVolumeControlProps) {
    const { t } = useTranslation();

    const metrics = useMemo(() => {
        const shellW = layoutWidth ?? SHELL_WIDTH_DESIGN;
        const s = shellW / SHELL_WIDTH_DESIGN;
        const trackHeight = Math.max(100, roundToLayoutPixel(TRACK_HEIGHT_DESIGN * s));
        const trackWidth = Math.max(14, roundToLayoutPixel(TRACK_WIDTH_DESIGN * s));
        const iconButtonSize = Math.max(30, roundToLayoutPixel(ICON_BUTTON_DESIGN * s));
        const iconGlyph = Math.max(14, roundToLayoutPixel(ICON_GLYPH_DESIGN * s));
        const padV = Math.max(spacing.xs, roundToLayoutPixel(spacing.sm * s));
        const padH = Math.max(2, roundToLayoutPixel(spacing.xs * s));
        const gap = Math.max(spacing.xs, roundToLayoutPixel(spacing.sm * s));
        return {
            shellW,
            trackHeight,
            trackWidth,
            iconButtonSize,
            iconGlyph,
            padV,
            padH,
            gap,
        };
    }, [layoutWidth]);
    const initialProgress = clamp(value ?? initialValue);

    const progressRef = useRef(initialProgress);
    const commandStepRef = useRef(Math.round(initialProgress * STEP_COUNT));
    const lastEmitAtRef = useRef(0);

    const progressSV = useSharedValue(initialProgress);
    const dragStartProgressSV = useSharedValue(initialProgress);
    const trackHeightSV = useSharedValue(metrics.trackHeight);

    useEffect(() => {
        trackHeightSV.value = metrics.trackHeight;
    }, [metrics.trackHeight, trackHeightSV]);

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
            'worklet';
            const rawNext =
                dragStartProgressSV.value - event.translationY / trackHeightSV.value;
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

    const volumeRipple = androidRipple({ color: withOpacityHex(colors.accent.teal.strong, 0.28) });

    return (
        <View
            style={[
                styles.root,
                {
                    width: metrics.shellW,
                    paddingVertical: metrics.padV,
                    paddingHorizontal: metrics.padH,
                    gap: metrics.gap,
                },
                disabled ? styles.rootDisabled : null,
            ]}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('remoteControl.actions.volumeUp')}
                accessibilityHint={t('remoteControl.actions.volumeUpHint')}
                accessibilityState={{ disabled }}
                disabled={disabled}
                hitSlop={10}
                android_ripple={volumeRipple}
                onPress={() => {
                    void handleButtonPress('up');
                }}
                style={({ pressed }) => [
                    styles.iconButton,
                    {
                        width: metrics.iconButtonSize,
                        height: metrics.iconButtonSize,
                    },
                    disabled ? null : iosPressOpacity(pressed, false),
                ]}>
                <IonIcon name="add" size={metrics.iconGlyph} color={colors.accent.teal.strong} />
            </Pressable>

            <GestureDetector gesture={panGesture}>
                <View
                    accessibilityRole="adjustable"
                    accessibilityLabel={t('remoteControl.actions.volumeSlider')}
                    accessibilityHint={t('remoteControl.actions.volumeSliderHint')}
                    style={styles.sliderWrap}>
                    <VerticalProgressBar
                        progress={progressRef.current}
                        animatedProgress={progressSV}
                        height={metrics.trackHeight}
                        width={metrics.trackWidth}
                        trackColor={withOpacityHex(colors.accent.gray.base, 0.22)}
                        fillColor={colors.accent.teal.strong}
                    />
                </View>
            </GestureDetector>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('remoteControl.actions.volumeDown')}
                accessibilityHint={t('remoteControl.actions.volumeDownHint')}
                accessibilityState={{ disabled }}
                disabled={disabled}
                hitSlop={10}
                android_ripple={volumeRipple}
                onPress={() => {
                    void handleButtonPress('down');
                }}
                style={({ pressed }) => [
                    styles.iconButton,
                    {
                        width: metrics.iconButtonSize,
                        height: metrics.iconButtonSize,
                    },
                    disabled ? null : iosPressOpacity(pressed, false),
                ]}>
                <IonIcon name="remove" size={metrics.iconGlyph} color={colors.accent.teal.strong} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        alignSelf: 'center',
        borderRadius: radius.xl,
        alignItems: 'center',
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
        borderRadius: radius.pill,
        overflow: 'hidden',
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
