import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { AppIcon } from '@src/features/scanner/components/AppIcon';
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { androidRippleLightInkForeground, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';

interface PinnedQuickLaunchRowProps {
    apps: RokuApp[];
    onPress: (app: RokuApp) => void;
    emptyLabel: string;
    deviceId?: string;
    deviceIp?: string;
    selectedAppId?: string;
    loadingAppId?: string | null;
    disabled?: boolean;
}

export function PinnedQuickLaunchRow({
    apps,
    onPress,
    emptyLabel,
    deviceId,
    deviceIp,
    selectedAppId,
    loadingAppId,
    disabled = false,
}: PinnedQuickLaunchRowProps) {
    if (!apps.length) {
        return (
            <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>{emptyLabel}</Text>
            </View>
        );
    }

    return (
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces
        alwaysBounceHorizontal
        contentContainerStyle={styles.list}
        style={styles.scroll}>
            {apps.map((app) => (
                <QuickAppChip
                    key={app.id}
                    app={app}
                    deviceId={deviceId}
                    deviceIp={deviceIp}
                    selected={selectedAppId === app.id}
                    loading={loadingAppId === app.id}
                    disabled={disabled}
                    onPress={() => onPress(app)}
                />
            ))}
        </ScrollView>
    );
}

function QuickAppChip({
    app,
    deviceId,
    deviceIp,
    selected = false,
    loading = false,
    disabled = false,
    onPress,
}: {
    app: RokuApp;
    deviceId?: string;
    deviceIp?: string;
    selected?: boolean;
    loading?: boolean;
    disabled?: boolean;
    onPress: () => void;
}) {
    return (
        <View style={styles.itemWrap}>
            <PressableFeedback
            disabled={disabled || loading}
            onPress={onPress}
            android_ripple={androidRippleLightInkForeground({ color: withOpacityHex(colors.accent.purple.base, 0.22) })}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading, busy: loading, selected }}
            accessibilityLabel={app.name}
            style={({ pressed }) => [
                styles.item,
                selected ? styles.itemSelected : null,
                (disabled || loading) ? styles.itemDisabled : null,
                disabled || loading ? null : iosPressOpacity(pressed, false),
            ]}>
                <View style={styles.iconWrap}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.accent.teal.strong} />
                    ) : (
                        <AppIcon
                            name={app.name}
                            appId={app.id}
                            deviceId={deviceId}
                            deviceIp={deviceIp}
                            style={styles.icon}
                        />
                    )}
                </View>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                        styles.name,
                        selected ? styles.nameSelected : null,
                    ]}>
                    {app.name}
                </Text>
            </PressableFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        width: '100%',
    },
    list: {
        flexDirection: 'row',
        gap: spacing.xs,
        paddingRight: spacing.sm,
    },
    itemWrap: {
        width: 96,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.22),
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.04),
        padding: spacing.xs - 1,
        overflow: 'hidden',
        gap: 10,
        alignItems: 'center',
    },
    itemSelected: {
        borderColor: withOpacityHex(colors.accent.teal.strong, 0.75),
        backgroundColor: withOpacityHex(colors.accent.teal.strong, 0.14),
    },
    itemDisabled: {
        opacity: 0.58,
    },
    iconWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: radius.pill,
        overflow: 'hidden',
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.16),
    },
    icon: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 8.5,
        fontWeight: '700',
        color: withOpacityHex(colors.dark.base, 0.8),
        flex: 1,
        minWidth: 0,
        maxWidth: '65%',
    },
    nameSelected: {
        color: colors.accent.teal.strong,
    },
    emptyWrap: {
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.base, 0.35),
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.06),
    },
    emptyText: {
        fontSize: 12,
        color: withOpacityHex(colors.dark.base, 0.55),
    },
});
