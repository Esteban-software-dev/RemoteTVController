import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { colors } from '@src/config/theme/colors/colors';
import { shadows, spacing } from '@src/config/theme/tokens';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';
import {
    androidRippleLightInkForeground,
    iosPressOpacity,
} from '@src/shared/ui/pressFeedback';

/**
 * FAB estilo Ionic: botón flotante con acciones secundarias, posición y dirección de apertura configurables.
 * Colócalo al final del árbol de la pantalla (dentro de un contenedor `flex: 1`) para que el posicionamiento absoluto sea correcto.
 *
 * @example
 * <Fab vertical="bottom" horizontal="end" expand="up" color={colors.accent.purple.strong}>
 *   <FabAction iconName="heart" onPress={() => {}} />
 *   <FabAction iconName="share" onPress={() => {}} color={colors.state.info} />
 * </Fab>
 */
const TIMING_MS = 280;
const STAGGER = 0.07;
const STAGGER_WINDOW = 0.26;

const MAIN_SIZE: Record<'sm' | 'md' | 'lg', number> = {
    sm: 48,
    md: 56,
    lg: 64,
};

export type FabVertical = 'top' | 'center' | 'bottom';
export type FabHorizontal = 'start' | 'center' | 'end';
/** Dirección en la que se despliegan las acciones respecto al botón principal (estilo Ionic `side`). */
export type FabExpand = 'up' | 'down' | 'left' | 'right';

/** Márgenes físicos respecto al borde de la pantalla (además de `safeArea`). */
export type FabInset = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

export type FabActionProps = {
    iconName: IoniconsIconName;
    onPress: () => void;
    /** Fondo del botón secundario (por defecto hereda `actionColor` del Fab). */
    color?: string;
    /** Color del icono (por defecto contraste o `actionIconColor` del Fab). */
    iconColor?: string;
    disabled?: boolean;
    /** Diámetro en px (por defecto `actionSize` del Fab o 44). */
    size?: number;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
};

type FabDefaults = {
    actionColor: string;
    actionIconColor: string | undefined;
    actionDiameter: number;
};

const FabDefaultsContext = createContext<FabDefaults | null>(null);

export type FabProps = {
    children?: React.ReactNode;
    /** Posición vertical en pantalla (equivalente a `vertical` de Ionic FAB). */
    vertical?: FabVertical;
    /** Posición horizontal (equivalente a `horizontal` de Ionic FAB). */
    horizontal?: FabHorizontal;
    /** Hacia dónde se abren las acciones respecto al FAB principal. */
    expand?: FabExpand;
    /** Icono del botón principal (cerrado). */
    icon?: IoniconsIconName;
    /** Icono cuando está abierto (lista desplegada). */
    closeIcon?: IoniconsIconName;
    /** Color de fondo del FAB principal. */
    color?: string;
    /** Color del icono principal (por defecto contraste con `color`). */
    iconColor?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    /** Sin hijos: se dispara al pulsar el FAB. Con hijos: opcional además del toggle. */
    onPress?: () => void;
    /** Con hijos: callback al pulsar el FAB principal (tras el toggle). */
    onMainPress?: () => void;
    onOpenChange?: (open: boolean) => void;
    /** Modo controlado */
    open?: boolean;
    defaultOpen?: boolean;
    /** Velo oscuro al abrir */
    backdrop?: boolean;
    closeOnBackdropPress?: boolean;
    /** Añade insets de área segura a `inset`. Por defecto true. */
    safeArea?: boolean;
    inset?: FabInset;
    /** Valores por defecto para cada `FabAction` si no definen `color` / `size`. */
    actionColor?: string;
    actionIconColor?: string;
    actionSize?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

function isFabActionElement(
    child: React.ReactNode
): child is React.ReactElement<FabActionProps> {
    return (
        React.isValidElement(child) &&
        (child.type as { displayName?: string }).displayName === 'FabAction'
    );
}

/**
 * Marcador de acción secundaria para usar dentro de `<Fab>`. No renderiza nada por sí mismo;
 * el padre lee las props y pinta los botones animados.
 */
export function FabAction(_props: FabActionProps): React.ReactElement | null {
    return null;
}

FabAction.displayName = 'FabAction';

function AnimatedFabActionButton({
    index,
    progress,
    iconName,
    onPress,
    color,
    iconColor,
    disabled,
    diameter,
    accessibilityLabel,
    style,
    slideFrom,
}: {
    index: number;
    progress: SharedValue<number>;
    iconName: IoniconsIconName;
    onPress: () => void;
    color: string;
    iconColor: string;
    disabled?: boolean;
    diameter: number;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
    slideFrom: { x: number; y: number };
}) {
    const ripple = useMemo(
        () =>
            androidRippleLightInkForeground({
                color: withOpacityHex(getContrastColor(color), 0.28),
                radius: Math.round(diameter),
            }),
        [color, diameter]
    );

    const animStyle = useAnimatedStyle(() => {
        const start = index * STAGGER;
        const opacity = interpolate(
            progress.value,
            [start, start + STAGGER_WINDOW],
            [0, 1],
            Extrapolation.CLAMP
        );
        const scale = interpolate(
            progress.value,
            [start, start + STAGGER_WINDOW],
            [0.45, 1],
            Extrapolation.CLAMP
        );
        const tx = interpolate(
            progress.value,
            [start, start + STAGGER_WINDOW],
            [slideFrom.x, 0],
            Extrapolation.CLAMP
        );
        const ty = interpolate(
            progress.value,
            [start, start + STAGGER_WINDOW],
            [slideFrom.y, 0],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateX: tx }, { translateY: ty }, { scale }],
        };
    }, [index, slideFrom]);

    return (
        <Animated.View style={[animStyle, { marginHorizontal: spacing.xs / 2, marginVertical: spacing.xs / 2 }]}>
            <PressableFeedback
            disabled={disabled}
            feedbackDisabled={!!disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            android_ripple={ripple}
            onPress={onPress}
            style={({ pressed }) => [
                styles.actionOuter,
                {
                    width: diameter,
                    height: diameter,
                    borderRadius: diameter / 2,
                    backgroundColor: color,
                    borderColor: withOpacityHex(getContrastColor(color), 0.12),
                },
                disabled ? styles.disabled : null,
                disabled ? null : iosPressOpacity(pressed, false),
                style,
            ]}>
                <IonIcon name={iconName} size={Math.round(diameter * 0.4)} color={iconColor} />
            </PressableFeedback>
        </Animated.View>
    );
}

export function Fab({
    children,
    vertical = 'bottom',
    horizontal = 'end',
    expand = 'up',
    icon = 'add',
    closeIcon = 'close',
    color = colors.accent.purple.strong,
    iconColor: iconColorProp,
    size = 'md',
    disabled = false,
    onPress,
    onMainPress,
    onOpenChange,
    open: openControlled,
    defaultOpen = false,
    backdrop = true,
    closeOnBackdropPress = true,
    safeArea = true,
    inset,
    actionColor = colors.white.base,
    actionIconColor,
    actionSize = 44,
    style,
    testID,
}: FabProps) {
    const insets = useSafeAreaInsets();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const controlled = openControlled !== undefined;
    const open = controlled ? openControlled! : internalOpen;

    const setOpen = useCallback(
        (next: boolean) => {
            if (!controlled) {
                setInternalOpen(next);
            }
            onOpenChange?.(next);
        },
        [controlled, onOpenChange]
    );

    const actionElements = useMemo(() => {
        return React.Children.toArray(children).filter(isFabActionElement);
    }, [children]);

    const hasChildren = actionElements.length > 0;
    const progress = useSharedValue(open ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(open ? 1 : 0, { duration: TIMING_MS });
    }, [open, progress]);

    const mainDiameter = MAIN_SIZE[size];
    const mainIconColor = iconColorProp ?? getContrastColor(color);
    const mainRipple = useMemo(
        () =>
            androidRippleLightInkForeground({
                color: withOpacityHex(mainIconColor, 0.35),
                radius: Math.round(mainDiameter),
            }),
        [mainIconColor, mainDiameter]
    );

    const defaults = useMemo<FabDefaults>(
        () => ({
            actionColor,
            actionIconColor,
            actionDiameter: actionSize,
        }),
        [actionColor, actionIconColor, actionSize]
    );

    const padTop =
        (safeArea ? insets.top : 0) + (inset?.top ?? spacing.md);
    const padBottom =
        (safeArea ? insets.bottom : 0) + (inset?.bottom ?? spacing.md);
    const padLeft =
        (safeArea ? insets.left : 0) + (inset?.left ?? spacing.md);
    const padRight =
        (safeArea ? insets.right : 0) + (inset?.right ?? spacing.md);

    const slideFrom = useMemo(() => {
        switch (expand) {
            case 'up':
                return { x: 0, y: 14 };
            case 'down':
                return { x: 0, y: -14 };
            case 'right':
                return { x: -14, y: 0 };
            case 'left':
                return { x: 14, y: 0 };
            default:
                return { x: 0, y: 12 };
        }
    }, [expand]);

    const justifyContent =
        vertical === 'top'
            ? 'flex-start'
            : vertical === 'bottom'
                ? 'flex-end'
                : 'center';
    const alignItems =
        horizontal === 'start'
            ? 'flex-start'
            : horizontal === 'end'
                ? 'flex-end'
                : 'center';

    const handleMainPress = useCallback(() => {
        if (disabled) return;
        if (!hasChildren) {
            onPress?.();
            return;
        }
        const next = !open;
        setOpen(next);
        onMainPress?.();
    }, [disabled, hasChildren, onPress, onMainPress, open, setOpen]);

    const mainIconName = hasChildren && open ? closeIcon : icon;

    const stackContent = useMemo(() => {
        const gap = spacing.xs;
        const actionsUi = actionElements.map((el, index) => {
            const p = el.props;
            const bg = p.color ?? actionColor;
            const ic =
                p.iconColor ??
                actionIconColor ??
                getContrastColor(bg);
            const d = p.size ?? actionSize;
            return (
                <AnimatedFabActionButton
                    key={index}
                    index={index}
                    progress={progress}
                    slideFrom={slideFrom}
                    iconName={p.iconName}
                    onPress={() => {
                        p.onPress();
                        setOpen(false);
                    }}
                    color={bg}
                    iconColor={ic}
                    disabled={p.disabled}
                    diameter={d}
                    style={p.style}
                    accessibilityLabel={p.accessibilityLabel}
                />
            );
        });

        const mainBtn = (
            <PressableFeedback
            testID={testID}
            disabled={disabled}
            feedbackDisabled={disabled || (!hasChildren && !onPress)}
            accessibilityRole="button"
            accessibilityState={{
                disabled,
                expanded: hasChildren ? open : undefined,
            }}
            android_ripple={mainRipple}
            onPress={handleMainPress}
            style={({ pressed }) => [
                styles.mainOuter,
                {
                    width: mainDiameter,
                    height: mainDiameter,
                    borderRadius: mainDiameter / 2,
                    backgroundColor: color,
                    borderColor: withOpacityHex(mainIconColor, 0.2),
                },
                disabled ? styles.disabled : null,
                disabled || (!hasChildren && !onPress)
                    ? null
                    : iosPressOpacity(pressed, false),
                style,
            ]}>
                <IonIcon
                    name={mainIconName}
                    size={Math.round(mainDiameter * 0.42)}
                    color={mainIconColor}
                />
            </PressableFeedback>
        );

        if (!hasChildren) {
            return mainBtn;
        }

        const rowStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
        };
        const colStyle: ViewStyle = {
            flexDirection: 'column',
            alignItems: 'center',
        };

        switch (expand) {
            case 'down':
                return (
                    <View style={[colStyle, { gap }]}>
                        {mainBtn}
                        {actionsUi}
                    </View>
                );
            case 'up':
                return (
                    <View style={[colStyle, { gap }]}>
                        {actionsUi}
                        {mainBtn}
                    </View>
                );
            case 'right':
                return (
                    <View style={[rowStyle, { gap }]}>
                        {mainBtn}
                        {actionsUi}
                    </View>
                );
            case 'left':
                return (
                    <View style={[rowStyle, { gap }]}>
                        {actionsUi}
                        {mainBtn}
                    </View>
                );
            default:
                return mainBtn;
        }
    }, [
        actionElements,
        actionColor,
        actionIconColor,
        actionSize,
        color,
        disabled,
        expand,
        handleMainPress,
        hasChildren,
        mainDiameter,
        mainIconColor,
        mainIconName,
        mainRipple,
        onPress,
        open,
        progress,
        setOpen,
        slideFrom,
        style,
        testID,
    ]);

    const fabTree = (
        <FabDefaultsContext.Provider value={defaults}>
            <View
            pointerEvents="box-none"
            style={[StyleSheet.absoluteFill, styles.rootFill]}>
                <View
                pointerEvents="box-none"
                style={[
                    styles.placement,
                    {
                        justifyContent,
                        alignItems,
                        paddingTop: padTop,
                        paddingBottom: padBottom,
                        paddingLeft: padLeft,
                        paddingRight: padRight,
                    },
                ]}>
                    {stackContent}
                </View>
            </View>
        </FabDefaultsContext.Provider>
    );

    const closeFromBackdrop = useCallback(() => {
        if (closeOnBackdropPress) {
            setOpen(false);
        }
    }, [closeOnBackdropPress, setOpen]);

    return (
        <>
            {hasChildren && backdrop && open ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close menu"
                    onPress={closeFromBackdrop}
                    style={[StyleSheet.absoluteFill, styles.backdropLayer]}
                />
            ) : null}
            <View style={styles.aboveBackdrop} pointerEvents="box-none">
                {fabTree}
            </View>
        </>
    );
}

/** Hook para leer defaults del Fab padre (opcional, p. ej. wrappers custom). */
export function useFabDefaults(): FabDefaults | null {
    return useContext(FabDefaultsContext);
}

const styles = StyleSheet.create({
    rootFill: {
        zIndex: 1000,
    },
    aboveBackdrop: {
        ...StyleSheet.absoluteFill,
        zIndex: 1001,
        elevation: 12,
    },
    backdropLayer: {
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    placement: {
        flex: 1,
    },
    mainOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    actionOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: shadows.soft.shadowColor,
        shadowOpacity: 0.22,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    disabled: {
        opacity: 0.45,
    },
});
