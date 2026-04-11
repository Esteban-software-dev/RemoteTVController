import {
    Platform,
    PressableProps,
    PressableStateCallbackType,
    ViewStyle,
} from 'react-native';
import { colors } from '@src/config/theme/colors/colors';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

/** iOS: opacidad al pulsar (el ripple no existe en iOS). */
export const PRESS_FEEDBACK_OPACITY = 0.78;

/** iOS: ligero “sink” sin Reanimated (solo estilos del Pressable). */
const IOS_PRESS_SCALE = 0.98;

/**
 * Apply on the same `Pressable` (or wrapper) that sets `borderRadius` so Android clips
 * the ripple to rounded corners. `foreground` ripple often ignores parent clipping.
 */
export const rippleClipStyle: ViewStyle = {
    overflow: 'hidden',
};

/**
 * Android (RippleDrawable vía `Pressable`):
 * - **No** hay API en RN para la duración/velocidad de la animación del ripple (lo controla el sistema).
 * - **Opacidad / fuerza**: solo con el **alpha** del `color` del ripple y el **`radius`** (extensión).
 * - **Cuándo empieza** el ripple: coincide con `onPressIn` → usa `unstable_pressDelay` (`pressDelayMs` en
 *   `PressableFeedback`) para esperar unos ms antes; reduce destellos al empezar un **scroll** en listas.
 */
export const PRESS_DELAY_SCROLL_FRIENDLY_MS = 100;

export type AndroidRippleOptions = {
    /** Ripple color; default: tinta oscura más visible que antes */
    color?: string;
    borderless?: boolean;
    /**
     * When true, ripple draws above children (Material “foreground”). That mode often
     * spills past rounded corners unless you use borderless ripples. Default false so the
     * bounded background ripple stays inside the view outline with `overflow: 'hidden'`.
     */
    foreground?: boolean;
    /** Ink más denso y visible (sube opacidad del color; opcionalmente foreground). */
    strong?: boolean;
    /**
     * Radio máximo del ripple en dp (Android). Valores altos (~200+) hacen la onda más
     * visible en tarjetas grandes.
     */
    radius?: number;
};

function buildRippleConfig(
    color: string,
    borderless: boolean,
    foreground: boolean,
    radius?: number
): NonNullable<PressableProps['android_ripple']> {
    const config: NonNullable<PressableProps['android_ripple']> = {
        color,
        borderless,
        foreground,
    };
    if (radius != null) {
        config.radius = radius;
    }
    return config;
}

export function androidRipple(options?: AndroidRippleOptions): NonNullable<PressableProps['android_ripple']> {
    const strong = options?.strong ?? false;
    const defaultAlpha = strong ? 0.38 : 0.26;
    const useForeground = options?.foreground ?? (strong ? true : false);

    return buildRippleConfig(
        options?.color ?? withOpacityHex(colors.dark.base, defaultAlpha),
        options?.borderless ?? false,
        useForeground,
        options?.radius
    );
}

/** Ripple para fondos oscuros (menús, segment, etc.) — tinta clara más visible. */
export function androidRippleOnLightInk(
    options?: Pick<AndroidRippleOptions, 'borderless' | 'foreground' | 'strong' | 'radius'>
): NonNullable<PressableProps['android_ripple']> {
    const strong = options?.strong ?? false;
    const defaultAlpha = strong ? 0.34 : 0.22;
    const useForeground = options?.foreground ?? (strong ? true : false);

    return buildRippleConfig(
        withOpacityHex(colors.white.base, defaultAlpha),
        options?.borderless ?? false,
        useForeground,
        options?.radius
    );
}

/**
 * Ripple **encima** del contenido (foreground), tinta clara fuerte. Usar cuando hijos opacos
 * (gradientes, imágenes) taparían un ripple en background — es el efecto “Material” visible.
 * Combina con `overflow: 'hidden'` + `borderRadius` en el mismo `Pressable`.
 */
export function androidRippleLightInkForeground(
    options?: Pick<AndroidRippleOptions, 'color' | 'borderless' | 'radius'>
): NonNullable<PressableProps['android_ripple']> {
    return buildRippleConfig(
        options?.color ?? withOpacityHex(colors.white.base, 0.48),
        options?.borderless ?? false,
        true,
        options?.radius ?? 260
    );
}

/**
 * Feedback táctil unificado:
 * - **Android**: solo `android_ripple` (no bajar opacidad de toda la vista; compite con la tinta).
 * - **iOS**: opacidad + micro-escala (sustituto del ripple).
 */
export function iosPressOpacity(pressed: boolean, disabled: boolean, baseOpacity = 1): ViewStyle {
    if (disabled) {
        return { opacity: baseOpacity };
    }

    if (Platform.OS === 'android') {
        return { opacity: baseOpacity };
    }

    return {
        opacity: pressed ? PRESS_FEEDBACK_OPACITY * baseOpacity : baseOpacity,
        transform: pressed ? [{ scale: IOS_PRESS_SCALE }] : [{ scale: 1 }],
    };
}

export type IosPressFeedbackOptions = {
    disabled?: boolean;
    baseOpacity?: number;
    /** When true, returns `style` unchanged (no opacity/scale on press). */
    skip?: boolean;
};

/**
 * Wraps a `Pressable` `style` so pressed state adds `iosPressOpacity` (iOS scale + opacity;
 * on Android only `android_ripple` should provide press feedback).
 */
export function withIosPressFeedback(
    style: PressableProps['style'] | undefined,
    options?: IosPressFeedbackOptions
): PressableProps['style'] {
    const { disabled = false, baseOpacity = 1, skip = false } = options ?? {};
    if (skip) {
        return style;
    }

    return (state: PressableStateCallbackType) => {
        const base =
            typeof style === 'function' ? style(state) : style;
        return [base, iosPressOpacity(state.pressed, disabled, baseOpacity)];
    };
}
