import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import {
    androidRipple,
    AndroidRippleOptions,
    withIosPressFeedback,
} from '@src/shared/ui/pressFeedback';

export { PRESS_DELAY_SCROLL_FRIENDLY_MS } from '@src/shared/ui/pressFeedback';

export type PressableFeedbackProps = PressableProps & {
    /**
     * Ms to wait before `onPressIn` (and Android ripple / iOS pressed styles). Alias for `unstable_pressDelay`.
     * Use `PRESS_DELAY_SCROLL_FRIENDLY_MS` on list cards to avoid ripples when the user is scrolling.
     */
    pressDelayMs?: number;
    /**
     * When true, no ripple and no iOS press opacity/scale (e.g. you handle feedback yourself).
     */
    feedbackDisabled?: boolean;
    /**
     * When false, Android has no ripple. Default true.
     */
    androidRippleEnabled?: boolean;
    /**
     * Passed to {@link androidRipple} when `androidRippleEnabled` and default ripple is used.
     * Ignored if you pass `android_ripple` yourself.
     */
    rippleOptions?: AndroidRippleOptions;
};

/**
 * `Pressable` with default tactile feedback: Material ripple on Android and opacity + micro-scale on iOS
 * (see `pressFeedback.ts`). Prefer this over raw `Pressable` for shared touch targets.
 *
 * For rounded controls, add `overflow: 'hidden'` (or import `rippleClipStyle`) on the same box
 * so the ripple stays inside corners.
 */
export function PressableFeedback({
    style,
    disabled,
    feedbackDisabled = false,
    androidRippleEnabled = true,
    android_ripple: androidRippleProp,
    rippleOptions,
    pressDelayMs,
    unstable_pressDelay,
    ...rest
}: PressableFeedbackProps) {
    const resolvedRipple =
        feedbackDisabled || !androidRippleEnabled
            ? undefined
            : androidRippleProp ?? androidRipple(rippleOptions);

    const mergedStyle = feedbackDisabled
        ? style
        : withIosPressFeedback(style, { disabled: !!disabled });

    const pressDelay = pressDelayMs ?? unstable_pressDelay;

    return (
        <Pressable
            disabled={disabled}
            android_ripple={resolvedRipple}
            style={mergedStyle}
            unstable_pressDelay={pressDelay}
            {...rest}
        />
    );
}
