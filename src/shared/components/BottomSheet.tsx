import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@src/config/theme/colors/colors';
import { radius, shadows, spacing, typography } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { BlurBackground } from './BlurBackground';
import { t } from 'i18next';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    height?: number;
    snapPoints?: number[];
    initialSnapIndex?: number;
    enablePanToClose?: boolean;
    enableBackdropDismiss?: boolean;
    closeThreshold?: number;
    children: ReactNode;
}

const DEFAULT_SNAP_POINTS = [0.35, 0.6, 0.9];
const DEFAULT_CLOSE_THRESHOLD = 0.35;

const SPRING_CONFIG = {
    damping: 24,
    stiffness: 210,
    mass: 0.9,
};

export function BottomSheet({
    visible,
    onClose,
    title,
    subtitle,
    height,
    snapPoints,
    initialSnapIndex = 1,
    enablePanToClose = true,
    enableBackdropDismiss = true,
    closeThreshold = DEFAULT_CLOSE_THRESHOLD,
    children,
}: BottomSheetProps) {
    const insets = useSafeAreaInsets();
    const [mounted, setMounted] = useState(visible);

    const screenHeight = Dimensions.get('window').height;
    const resolvedSnapPoints = useMemo(() => {
        const raw = snapPoints && snapPoints.length
            ? snapPoints
            : (height ? [height] : DEFAULT_SNAP_POINTS);
        const points = raw.length ? raw : DEFAULT_SNAP_POINTS;
        return points
            .map((p) => (p <= 1 ? p * screenHeight : p))
            .map((p) => Math.min(Math.max(p, 140), screenHeight - 24))
            .sort((a, b) => a - b);
    }, [snapPoints, height, screenHeight]);

    const minHeight = resolvedSnapPoints[0];
    const maxHeight = resolvedSnapPoints[resolvedSnapPoints.length - 1];
    const snapPositions = resolvedSnapPoints.map((p) => maxHeight - p);
    const initialIndex = Math.min(Math.max(initialSnapIndex, 0), snapPositions.length - 1);
    const initialTranslate = snapPositions[initialIndex];
    const closeAt = (maxHeight - minHeight) + (minHeight * closeThreshold);

    const translateY = useSharedValue(maxHeight + 120);
    const backdropOpacity = useSharedValue(0);
    const startY = useSharedValue(0);
    const snapPositionsSV = useSharedValue(snapPositions);
    const maxHeightSV = useSharedValue(maxHeight);
    const closeAtSV = useSharedValue(closeAt);

    useEffect(() => {
        snapPositionsSV.value = snapPositions;
        maxHeightSV.value = maxHeight;
        closeAtSV.value = closeAt;
        if (visible) {
            setMounted(true);
            backdropOpacity.value = withTiming(1, { duration: 220 });
            translateY.value = withSpring(initialTranslate, SPRING_CONFIG);
        } else if (mounted) {
            backdropOpacity.value = withTiming(0, { duration: 180 });
            translateY.value = withTiming(maxHeight + 120, { duration: 220 }, (finished) => {
                if (finished) {
                    runOnJS(setMounted)(false);
                }
            });
        }
    }, [visible, mounted, initialTranslate, maxHeight, snapPositions]);

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [maxHeightSV.value, 0],
            [0, backdropOpacity.value],
            Extrapolate.CLAMP
        ),
    }));

    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetY([-8, 8])
                .failOffsetX([-20, 20])
                .onBegin(() => {
                    startY.value = translateY.value;
                })
                .onUpdate((event) => {
                    const next = startY.value + event.translationY;
                    const max = maxHeightSV.value;
                    translateY.value = Math.max(0, Math.min(next, max));
                })
                .onEnd((event) => {
                    const max = maxHeightSV.value;
                    const shouldClose =
                        enablePanToClose &&
                        (translateY.value > closeAtSV.value || event.velocityY > 1400);

                    if (shouldClose) {
                        runOnJS(onClose)();
                        return;
                    }

                    const points = snapPositionsSV.value;
                    let closest = points[0];
                    let minDist = Math.abs(translateY.value - points[0]);
                    for (let i = 1; i < points.length; i += 1) {
                        const dist = Math.abs(translateY.value - points[i]);
                        if (dist < minDist) {
                            minDist = dist;
                            closest = points[i];
                        }
                    }
                    translateY.value = withSpring(closest, SPRING_CONFIG);
                }),
        [onClose, enablePanToClose, closeThreshold]
    );

    if (!mounted) return null;

    return (
        <Modal transparent visible={mounted} animationType="none" onRequestClose={onClose}>
            <GestureHandlerRootView style={styles.container}>
                <Pressable
                    onPress={enableBackdropDismiss ? onClose : undefined}
                    style={StyleSheet.absoluteFill}>
                    <Animated.View style={[styles.backdrop, backdropStyle]}>
                        {/* <BlurBackground blurAmount={1} blurType='dark' /> */}
                    </Animated.View>
                </Pressable>

                <GestureDetector gesture={panGesture}>
                    <Animated.View
                    style={[
                        styles.sheet,
                        sheetStyle,
                        {
                            height: maxHeight,
                            paddingBottom: insets.bottom + spacing.md,
                        },
                    ]}>
                        <View style={styles.handle} />
                        {(title || subtitle) && (
                            <View style={styles.header}>
                                {title && <Text style={styles.title}>{title}</Text>}
                                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                                <Pressable
                                hitSlop={12}
                                onPress={onClose}
                                style={styles.closeButton}>
                                    <Text style={styles.closeText}>{t('components.bottomSheet.closeButton')}</Text>
                                </Pressable>
                            </View>
                        )}
                        <View style={styles.content}>{children}</View>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
        backgroundColor: colors.bone.base,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.08),
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        ...shadows.glass,
    },
    handle: {
        alignSelf: 'center',
        width: 44,
        height: 5,
        borderRadius: 999,
        backgroundColor: withOpacityHex(colors.dark.base, 0.2),
        marginBottom: spacing.sm,
    },
    header: {
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: withOpacityHex(colors.dark.base, 0.08),
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: typography.size.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.dark.base,
    },
    subtitle: {
        marginTop: 4,
        fontSize: typography.size.sm,
        color: withOpacityHex(colors.dark.base, 0.6),
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },

    closeText: {
        fontSize: typography.size.sm,
        fontFamily: typography.fontFamily.medium,
        color: withOpacityHex(colors.dark.base, 0.55),
    },
    content: {
        gap: spacing.xs,
    },
});
