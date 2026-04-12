import { View, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import React, { memo } from 'react';
import { Gradient } from '@src/shared/components/Gradient';
import { radius, spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { SmallButton } from '@src/shared/components/SmallButton';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { getAppGradient } from '@src/config/theme/utils/gradient-generator';
import {
    androidRippleLightInkForeground,
    iosPressOpacity,
    PRESS_DELAY_SCROLL_FRIENDLY_MS,
} from '@src/shared/ui/pressFeedback';
import { AppIcon } from './AppIcon';
import { formatVersion } from '@src/shared/utils/math.utils';

interface RokuAppItemProps {
    appId: string;
    name: string;
    deviceId?: string;
    deviceIp?: string;
    appType?: string;
    version?: string;
    isLaunchable?: boolean;
    isSystem?: boolean;
    compact?: boolean;
    selected?: boolean;
    disabled?: boolean;
    onPress?: (appId: string) => void;
    onMenuPress?: () => void;
    onLongPress?: ({}: {e: GestureResponderEvent, appId: string}) => void;
}

function CompactAppItem({
    appId,
    name,
    deviceId,
    deviceIp,
    appType,
    version,
    isLaunchable = true,
    isSystem = false,
    selected,
    disabled,
    onPress,
    onMenuPress,
    onLongPress,
}: RokuAppItemProps) {
    const gradientConfig = getAppGradient(appId);
    const categoryLabel = isSystem
        ? 'System'
        : appType === 'menu'
            ? 'Input'
            : 'App';

    const categoryStyle = isSystem
        ? styles.compactBadgeSystem
        : appType === 'menu'
            ? styles.compactBadgeInput
            : styles.compactBadgeApp;

    return (
        <PressableFeedback
        disabled={disabled}
        feedbackDisabled={!!disabled || !!selected}
        pressDelayMs={PRESS_DELAY_SCROLL_FRIENDLY_MS}
        pointerEvents={selected ? 'none' : 'auto'}
        onPress={() => {
            if (selected) return;
            onPress?.(appId);
        }}
        onLongPress={(e: GestureResponderEvent) => {
            onLongPress?.({ e, appId });
        }}
        delayLongPress={500}
        android_ripple={androidRippleLightInkForeground({color: withOpacityHex(gradientConfig.colors[1], .50),})}
        style={[
            styles.compactContainer,
            selected ? styles.compactSelected : null,
            disabled ? styles.compactDisabled : null,
        ]}>
            <Gradient
                colors={gradientConfig.colors}
                start={gradientConfig.start}
                end={gradientConfig.end}
            />
            <View style={styles.compactGlow} />

            <View style={styles.compactTopRow}>
                <View style={[styles.compactBadge, categoryStyle]}>
                    <Text style={styles.compactBadgeText}>{categoryLabel}</Text>
                </View>

                <SmallButton
                    stopPropagation
                    size="sm"
                    iconName="ellipsis-horizontal"
                    containerStyle={styles.compactMenuButton}
                    color={colors.white.base}
                    variant="ghost"
                    hitSlop={8}
                    onPress={onMenuPress}
                />
            </View>

            <View style={styles.compactIconZone}>
                <AppIcon
                    name={name}
                    appId={appId}
                    deviceId={deviceId}
                    deviceIp={deviceIp}
                    style={styles.compactAppIcon}
                />
            </View>

            <View style={styles.compactTextBlock}>
                <Text style={styles.compactName} numberOfLines={1}>
                    {name}
                </Text>

                <View style={styles.compactMetaRow}>

                    <Text style={styles.compactHint} numberOfLines={1}>
                        {isSystem ? 'Roku service' : isLaunchable ? 'Ready to launch' : 'Unavailable'}
                    </Text>
                    {version ? (
                        <View style={styles.compactVersionPill}>
                            <Text style={styles.compactVersionText}>v{formatVersion(version, 2)}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </PressableFeedback>
    );
}

function RichAppItem({
    appId,
    name,
    deviceId,
    deviceIp,
    disabled,
    onPress,
    onMenuPress,
    onLongPress,
    selected,
}: RokuAppItemProps) {
    const gradientConfig = getAppGradient(appId);

    return (
        <Pressable
            pointerEvents={selected ? 'none' : 'auto'}
            onPress={() => {
                if (selected) return;
                onPress?.(appId);
            }}
            onLongPress={(e: GestureResponderEvent) => {
                onLongPress?.({ e, appId });
            }}
            delayLongPress={500}
            unstable_pressDelay={PRESS_DELAY_SCROLL_FRIENDLY_MS}
            android_ripple={androidRippleLightInkForeground()}
            style={({ pressed }) => [
                globalStyles.shadow,
                styles.container,
                disabled ? styles.itemDisabled : null,
                selected || disabled ? null : iosPressOpacity(pressed, false),
            ]}>
            <Gradient
                colors={gradientConfig.colors}
                start={gradientConfig.start}
                end={gradientConfig.end}
            />

            <SmallButton
                stopPropagation
                size="sm"
                iconName="ellipsis-vertical"
                containerStyle={styles.moreButton}
                color={colors.white.base}
                variant="ghost"
                hitSlop={8}
                onPress={onMenuPress}
            />

            <View style={styles.iconZone}>
                <AppIcon
                    name={name}
                    appId={appId}
                    deviceId={deviceId}
                    deviceIp={deviceIp}
                    style={styles.appIcon}
                />
            </View>

            <View style={styles.textZone}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.subtext} numberOfLines={1}>
                    Last used · 2 days ago
                </Text>
            </View>
        </Pressable>
    );
}

function AppItemComponent(props: RokuAppItemProps) {
    if (props.compact) {
        return <CompactAppItem {...props} />;
    }

    return <RichAppItem {...props} />;
}

export const AppItem = memo(
    AppItemComponent,
    (prevProps, nextProps) =>
        prevProps.appId === nextProps.appId &&
        prevProps.name === nextProps.name &&
        prevProps.deviceId === nextProps.deviceId &&
        prevProps.deviceIp === nextProps.deviceIp &&
        prevProps.compact === nextProps.compact &&
        prevProps.selected === nextProps.selected &&
        prevProps.disabled === nextProps.disabled
);

const styles = StyleSheet.create({
    compactContainer: {
        width: '100%',
        height: '100%',
        flex: 1,
        aspectRatio: 1,
        borderRadius: radius.lg,
        overflow: 'hidden',
        padding: spacing.sm,
        backgroundColor: colors.dark.surfaceItem,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.icon, 0.14),
        justifyContent: 'space-between',
        position: 'relative',
    },
    compactGlow: {
        ...StyleSheet.absoluteFill,
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.05),
    },
    compactSelected: {
        borderColor: withOpacityHex(colors.accent.teal.strong, 0.8),
    },
    compactDisabled: {
        opacity: 0.55,
    },
    itemDisabled: {
        opacity: 0.6,
    },
    compactIconZone: {
        flex: 1,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: withOpacityHex(colors.white.base, 0.04),
        justifyContent: 'center',
        alignItems: 'center',
    },
    compactTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        right: spacing.sm,
        zIndex: 10,
    },
    compactBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.pill,
    },
    compactBadgeApp: {
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.50),
    },
    compactBadgeInput: {
        backgroundColor: withOpacityHex(colors.state.info, 0.50),
    },
    compactBadgeSystem: {
        backgroundColor: withOpacityHex(colors.accent.teal.strong, 0.50),
    },
    compactBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: colors.white.base,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    compactMenuButton: {
        minWidth: 28,
        height: 28,
        paddingHorizontal: 0,
        backgroundColor: withOpacityHex(colors.dark.base, 0.60),
    },
    compactAppIcon: {
        width: '100%',
        height: '100%',
    },
    compactTextBlock: {
        marginTop: spacing.xs,
        gap: 6,
    },
    compactName: {
        fontSize: 12.5,
        fontWeight: '800',
        color: colors.white.base,
        lineHeight: 16,
    },
    compactMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    compactVersionPill: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: radius.pill,
        backgroundColor: withOpacityHex(colors.white.base, 0.08),
    },
    compactVersionText: {
        fontSize: 9,
        fontWeight: '700',
        color: withOpacityHex(colors.white.base, 0.86),
    },
    compactHint: {
        flex: 1,
        minWidth: 0,
        fontSize: 10.5,
        fontWeight: '600',
        color: withOpacityHex(colors.white.base, 0.62),
    },
    container: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: radius.xl,
        overflow: 'hidden',
        padding: spacing.sm,
        width: '100%',
        height: '100%'
    },
    moreButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        zIndex: 10,
    },
    iconZone: {
        backgroundColor: withOpacityHex(colors.white.base, 0.05),
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.xl,
        borderColor: withOpacityHex(colors.dark.base, 0.1),
        overflow: 'hidden',
    },
    textZone: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.white.base,
    },
    subtext: {
        fontSize: 11,
        color: colors.white.base,
        opacity: 0.7,
    },
    appIcon: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
