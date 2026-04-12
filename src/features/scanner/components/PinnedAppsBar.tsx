import { View, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { radius, spacing } from '@src/config/theme/tokens';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { RokuApp } from '../interfaces/roku-app.interface';
import { AppIcon } from './AppIcon';

const BAR_WIDTH = 70;
const ITEM_SIZE = 52;
const MAX_ITEMS = 5;
const TOGGLE_HEIGHT = 44;
const ITEM_GAP = 10;
const ITEMS_PADDING = spacing.md;

interface PinnedFabMenuProps {
    apps: RokuApp[];
    deviceId: string;
    deviceIp: string;
    onPress: (app: RokuApp) => void;
}
export function PinnedFabMenu({
    apps,
    deviceId,
    deviceIp,
    onPress
}: PinnedFabMenuProps) {
    const { bottom } = useSafeBarsArea();
    const [collapsed, setCollapsed] = useState(false);

    const progress = useSharedValue(1);

    const maxItems = Math.min(apps.length, MAX_ITEMS);
    const itemsHeight = maxItems * ITEM_SIZE + (maxItems - 1) * ITEM_GAP + ITEMS_PADDING;
    const expandedHeight = itemsHeight + TOGGLE_HEIGHT;

    const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        progress.value = withTiming(next ? 0 : 1, { duration: 500 });
    }

    const barAnim = useAnimatedStyle(() => ({
        height: interpolate(
            progress.value,
            [0, 1],
            [TOGGLE_HEIGHT, expandedHeight]
        )
    }));

    const itemsAnim = useAnimatedStyle(() => ({
        opacity: progress.value,
    }));

    if (!apps.length) return null;

    return (
        <Animated.View
            style={[styles.container, { bottom: bottom - spacing.md }, barAnim]}>
            <View style={styles.glow} />

            <Animated.View style={[styles.items, itemsAnim]}>
                {apps.slice(0, MAX_ITEMS).map(app => (
                    <PinnedAppButton app={app} deviceId={deviceId} deviceIp={deviceIp} onPress={onPress} key={app.id} />
                ))}
            </Animated.View>

            <Pressable
            onPress={toggle}
            android_ripple={androidRipple({ color: withOpacityHex(colors.white.base, 0.16) })}
            style={({ pressed }) => [styles.toggle, iosPressOpacity(pressed, false)]}>
                <IonIcon
                    name={collapsed ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.white.base}
                />
            </Pressable>
        </Animated.View>
    )
}

function PinnedAppButton({
    app,
    deviceId,
    deviceIp,
    onPress
}: {
    app: RokuApp,
    deviceId: string,
    deviceIp: string,
    onPress: (app: RokuApp) => void,
}) {
    return (
        <Pressable
            onPress={() => onPress(app)}
            android_ripple={androidRipple({ color: withOpacityHex(colors.accent.purple.base, 0.28) })}
            style={({ pressed }) => [styles.item, iosPressOpacity(pressed, false)]}>
                <AppIcon appId={app.id} name={app.name} deviceId={deviceId} deviceIp={deviceIp} style={styles.icon} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: spacing.md,
        width: BAR_WIDTH,
        borderRadius: 20,
        backgroundColor: colors.dark.surface3,

        borderWidth: 1,
        borderColor: colors.accent.purple.base,
        overflow: 'hidden',
        zIndex: 999,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    glow: {
        ...StyleSheet.absoluteFill,
        backgroundColor: colors.effects.glowPurpleDark,

    },
    items: {
        paddingBottom: spacing.xs,
        alignItems: 'center',
        gap: ITEM_GAP,
    },
    item: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: colors.dark.surfaceItem,
        borderWidth: 1,
        borderColor: colors.accent.purple.base,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    icon: {
        width: '100%',
        height: '100%',
        borderRadius: radius.md,
    },
    toggle: {
        height: TOGGLE_HEIGHT,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderColor: colors.dark.borderStrong,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.dark.surfaceInset,
    },
});
