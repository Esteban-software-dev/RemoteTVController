import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import React, { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right';

interface TrackpadSurfaceProps {
    disabled?: boolean;
    onDirection: (direction: Direction) => void;
    onTap: () => void;
}

const STEP_THRESHOLD = 26;
const TAP_THRESHOLD = 6;

export function TrackpadSurface({
    disabled = false,
    onDirection,
    onTap,
}: TrackpadSurfaceProps) {
    const [dragging, setDragging] = useState(false);
    const moveRef = useRef({ dx: 0, dy: 0 });

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => !disabled,
                onMoveShouldSetPanResponder: (_, g) =>
                    !disabled && (Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2),
                onPanResponderGrant: () => {
                    moveRef.current = { dx: 0, dy: 0 };
                    setDragging(true);
                },
                onPanResponderMove: (_, g) => {
                    if (disabled) return;

                    const deltaX = g.dx - moveRef.current.dx;
                    const deltaY = g.dy - moveRef.current.dy;

                    if (Math.abs(deltaX) >= STEP_THRESHOLD || Math.abs(deltaY) >= STEP_THRESHOLD) {
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            onDirection(deltaX > 0 ? 'right' : 'left');
                            moveRef.current.dx = g.dx;
                        } else {
                            onDirection(deltaY > 0 ? 'down' : 'up');
                            moveRef.current.dy = g.dy;
                        }
                    }
                },
                onPanResponderRelease: (_, g) => {
                    setDragging(false);
                    if (disabled) return;
                    if (Math.abs(g.dx) <= TAP_THRESHOLD && Math.abs(g.dy) <= TAP_THRESHOLD) {
                        onTap();
                    }
                },
                onPanResponderTerminate: () => {
                    setDragging(false);
                },
            }),
        [disabled, onDirection, onTap]
    );

    return (
        <View style={[styles.wrapper, disabled && styles.disabled]} {...panResponder.panHandlers}>
            <View
                style={[
                    styles.dot,
                    dragging ? styles.dotActive : null,
                ]}
            />
            <Text style={styles.label}>Touch mode</Text>
            <Text style={styles.hint}>Swipe to navigate. Tap to select.</Text>
            <IonIcon name="hand-left-outline" size={22} color={withOpacityHex(colors.dark.base, 0.45)} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 210,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.28),
        backgroundColor: colors.white.base,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    disabled: {
        opacity: 0.4,
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: radius.pill,
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.22),
        marginBottom: spacing.xs,
    },
    dotActive: {
        backgroundColor: colors.accent.purple.base,
        transform: [{ scale: 1.12 }],
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.dark.base,
    },
    hint: {
        fontSize: 12,
        fontWeight: '500',
        color: withOpacityHex(colors.dark.base, 0.58),
    },
});
