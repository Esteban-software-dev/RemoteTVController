import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppBackground } from '@src/shared/components/AppBackground';
import { colors, component_colors } from '@src/config/theme/colors/colors';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { NoRokuDevice } from '@src/features/scanner/components/NoRokuDevice';
import { AppIcon } from '@src/features/scanner/components/AppIcon';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useDrawerNavigation } from '@src/navigation/hooks/useDrawerNavigation';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';
import { androidRippleLightInkForeground, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import {
    sendRokuKeyBackspace,
    sendRokuKeyEnter,
    sendRokuLitKey,
} from '../services/roku-remote.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROW_Q = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as const;
const ROW_A = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as const;
const ROW_Z = ['z', 'x', 'c', 'v', 'b', 'n', 'm'] as const;
const ROW_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;
const ROW_SYMBOLS = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'] as const;

const PREVIEW_MAX = 280;
const PHONE_FRAME_MAX_WIDTH = 430;
const KEY_GAP = 5;
const KEY_HEIGHT = 43;
const COMMAND_KEY_HEIGHT = 42;
const KEYBOARD_DOCK_HEIGHT = 286;

const surface = {
    app: colors.dark.background,
    card: component_colors.card,
    raised: component_colors.cardRaised,
    inset: colors.dark.surfaceInset,
    control: colors.dark.surfaceItem,
    controlAlt: colors.dark.surface3,
    border: colors.dark.borderStrong,
} as const;

const elevation = {
    card: {
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 4,
    },
    dock: {
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.34,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -6 },
        elevation: 10,
    },
    key: {
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.24,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
} as const;

function KeyRow({ children, indent = 0 }: { children: React.ReactNode; indent?: number }) {
    return <View style={[styles.keyRow, indent > 0 ? { paddingHorizontal: indent } : null]}>{children}</View>;
}

type KeyCapProps = {
    label: string;
    onPress: () => void;
    flex?: number;
    variant?: 'letter' | 'command' | 'space';
    active?: boolean;
    accessibilityLabel?: string;
    children?: React.ReactNode;
};

function KeyCap({
    label,
    onPress,
    flex = 1,
    variant = 'letter',
    active = false,
    accessibilityLabel,
    children,
}: KeyCapProps) {
    const ripple = androidRippleLightInkForeground({
        color: withOpacityHex(colors.accent.purple.base, 0.18),
    });
    const isSpace = variant === 'space';

    return (
        <PressableFeedback
            onPress={onPress}
            android_ripple={ripple}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            style={({ pressed }) => [
                styles.keyCap,
                styles[`${variant}Key`],
                active ? styles.activeKey : null,
                { flex },
                iosPressOpacity(pressed, false),
            ]}>
            {children ?? <Text style={isSpace ? styles.spaceKeyText : styles.keyCapText}>{label}</Text>}
        </PressableFeedback>
    );
}

type ActionChipProps = {
    iconName: React.ComponentProps<typeof IonIcon>['name'];
    label?: string;
    onPress: () => void;
    accessibilityLabel: string;
    disabled?: boolean;
    android_ripple?: React.ComponentProps<typeof PressableFeedback>['android_ripple'];
};

function ActionChip({
    iconName,
    label,
    onPress,
    accessibilityLabel,
    disabled = false,
    android_ripple
}: ActionChipProps) {
    const ripple = disabled ? undefined : android_ripple ?? androidRippleLightInkForeground({
        color: withOpacityHex(colors.accent.gray.icon, 0.24),
    });

    return (
        <PressableFeedback
            onPress={onPress}
            disabled={disabled}
            android_ripple={ripple}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            accessibilityLabel={accessibilityLabel}
            hitSlop={8}
            style={({ pressed }) => [
                styles.actionChip,
                disabled ? styles.actionChipDisabled : null,
                disabled ? null : iosPressOpacity(pressed, false),
            ]}>
            <IonIcon
                name={iconName}
                size={18}
                color={disabled ? colors.text.muted : colors.accent.gray.icon}
            />
            {label ? <Text style={styles.actionChipText}>{label}</Text> : null}
        </PressableFeedback>
    );
}

export function Keyboard() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { navigation } = useDrawerNavigation();
    const { width } = useWindowDimensions();
    const { selectedDevice, activeApp } = useRokuSessionStore();
    const [preview, setPreview] = useState('');
    const [isShifted, setIsShifted] = useState(false);
    const [isNumeric, setIsNumeric] = useState(false);

    const ip = selectedDevice?.ip ?? '';
    const activeAppLabel = activeApp?.text?.trim() || t('remoteControl.connected.unknownApp');
    const activeAppId = activeApp?.id?.trim();
    const keyboardRows = useMemo(
        () => isNumeric ? [ROW_DIGITS, ROW_SYMBOLS] : [ROW_Q, ROW_A, ROW_Z],
        [isNumeric],
    );
    const contentWidth = Math.min(width - spacing.md * 2, PHONE_FRAME_MAX_WIDTH);

    const sendText = useCallback(
        (value: string) => {
            if (!ip || !value) return;

            Array.from(value).forEach((char) => {
                void sendRokuLitKey(ip, char);
            });
            setPreview((p) => (p + value).slice(-PREVIEW_MAX));
        },
        [ip],
    );

    const onChar = useCallback(
        (char: string) => {
            const nextChar = isShifted && !isNumeric ? char.toUpperCase() : char;
            sendText(nextChar);
            if (isShifted) setIsShifted(false);
        },
        [isNumeric, isShifted, sendText],
    );

    const onBackspace = useCallback(() => {
        if (!ip) return;
        void sendRokuKeyBackspace(ip);
        setPreview((p) => p.slice(0, -1));
    }, [ip]);

    const onClear = useCallback(() => {
        if (!ip || !preview.length) return;

        Array.from(preview).forEach(() => {
            void sendRokuKeyBackspace(ip);
        });
        setPreview('');
    }, [ip, preview]);

    const onEnter = useCallback(() => {
        if (!ip) return;
        void sendRokuKeyEnter(ip);
        setPreview((p) => (p + '\n').slice(-PREVIEW_MAX));
    }, [ip]);

    const onSpace = useCallback(() => sendText(' '), [sendText]);

    if (!selectedDevice) {
        return (
            <View style={globalStyles.container}>
                <AppBackground />
                <NoRokuDevice
                    title={t('remoteControl.noDevice.title')}
                    subtitle={t('remoteControl.noDevice.subtitle')}
                    iconName="tv"
                    actionButton={{
                        label: t('remoteControl.noDevice.action'),
                        iconName: 'search',
                        variant: 'outline',
                        color: colors.gradient[2],
                        onPress: () =>
                            navigation.navigate('Home', {
                                screen: 'Tv scanner',
                            }),
                    }}
                />
            </View>
        );
    }

    return (
        <View style={[globalStyles.container, styles.screen]}>
            <View style={styles.backgroundSurface} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.content,
                    {
                        width: contentWidth,
                        paddingTop: insets.top > 0 ? insets.top : undefined
                    }
                ]}>
                <View style={styles.topBar}>
                    <PressableFeedback
                        onPress={() => navigation.navigate('RemoteControl')}
                        android_ripple={androidRippleLightInkForeground({
                            color: withOpacityHex(colors.white.base, 0.16),
                        })}
                        accessibilityRole="button"
                        accessibilityLabel={t('remoteControl.keyboardScreen.back')}
                        hitSlop={12}
                        style={({ pressed }) => [styles.backButton, iosPressOpacity(pressed, false)]}>
                        <IonIcon name="chevron-back" size={24} color={colors.text.primary} />
                    </PressableFeedback>
                    <Text style={styles.screenTitle}>{t('remoteControl.keyboardScreen.title')}</Text>
                    <View style={styles.topBarSpacer} />
                </View>

                <View style={styles.connectedShell}>
                    <View style={styles.connectedCard}>
                        <View style={styles.deviceCopy}>
                            <Text style={styles.connectedLabel}>
                                {t('remoteControl.connected.label')}
                            </Text>
                            <View style={styles.deviceNameRow}>
                                <View style={styles.statusDot} />
                                <Text numberOfLines={2} style={styles.deviceName}>
                                    {selectedDevice.friendlyDeviceName}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.appTile}>
                            {activeAppId ? (
                                <AppIcon
                                    name={activeAppLabel}
                                    appId={activeAppId}
                                    deviceId={selectedDevice.deviceId}
                                    deviceIp={selectedDevice.ip}
                                    style={styles.appIcon}
                                />
                            ) : (
                                <IonIcon name="tv" size={28} color={colors.text.secondary} />
                            )}
                            <Text numberOfLines={1} style={styles.appTileLabel}>
                                {activeAppLabel}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.typingPill}>
                    <IonIcon name="pulse" size={14} color={colors.text.muted} />
                    <Text style={styles.typingPillText}>
                        {t('remoteControl.keyboardScreen.typingStatus')}
                    </Text>
                </View>

                <View style={styles.inputShell}>
                    <View style={styles.inputPanel}>
                        <ScrollView style={styles.previewScroll} nestedScrollEnabled>
                            <Text style={styles.previewText} selectable>
                                {preview.length > 0 ? (
                                    <>
                                        {t('remoteControl.keyboardScreen.inputPrefix')} "
                                        {preview}
                                        <Text style={styles.cursor}>|</Text>"
                                    </>
                                ) : (
                                    <>
                                        {t('remoteControl.keyboardScreen.inputPlaceholder')}
                                        <Text style={styles.cursor}>|</Text>
                                    </>
                                )}
                            </Text>
                        </ScrollView>

                        <View style={styles.inputActions}>
                            <ActionChip
                                iconName="close"
                                onPress={onClear}
                                accessibilityLabel={t('remoteControl.keyboardScreen.clearA11y')}
                            />
                            <ActionChip
                                iconName="clipboard-outline"
                                label={t('remoteControl.keyboardScreen.paste')}
                                onPress={() => sendText(preview)}
                                accessibilityLabel={t('remoteControl.keyboardScreen.pasteA11y')}
                            />
                            <View style={styles.inputActionSpacer} />
                            <ActionChip
                                iconName="mic-outline"
                                onPress={() => undefined}
                                accessibilityLabel={t('remoteControl.keyboardScreen.voiceA11y')}
                                android_ripple={
                                    androidRippleLightInkForeground({
                                        color: withOpacityHex(colors.accent.purple.base, 0.24)
                                    })
                                }
                            />
                        </View>
                    </View>
                </View>
                
                <View style={styles.searchActionWrap}>
                    <PressableFeedback
                        android_ripple={androidRippleLightInkForeground({
                            color: withOpacityHex(colors.dark.base, 0.16),
                        })}
                        accessibilityRole="button"
                        accessibilityLabel={t('remoteControl.keyboardScreen.searchA11y')}
                        hitSlop={12}
                        style={({ pressed }) => [
                            styles.searchButton,
                            iosPressOpacity(pressed, false),
                        ]}>
                        <IonIcon name="search" size={20} color={colors.text.inverted} />
                        <Text style={styles.searchButtonText}>
                            {t('remoteControl.keyboardScreen.search')}
                        </Text>
                    </PressableFeedback>
                </View>
            </ScrollView>
            <View style={styles.keyboardDock}>
                {keyboardRows.map((row, index) => (
                    <KeyRow
                        key={row.join('')}
                        indent={!isNumeric && index === 1 ? 13 : !isNumeric && index === 2 ? 38 : 0}>
                        {row.map((c) => (
                            <KeyCap key={c} label={isShifted && !isNumeric ? c.toUpperCase() : c} onPress={() => onChar(c)} />
                        ))}
                    </KeyRow>
                ))}

                {!isNumeric ? (
                    <KeyRow>
                        <KeyCap
                            label="shift"
                            variant="command"
                            active={isShifted}
                            onPress={() => setIsShifted((value) => !value)}
                            accessibilityLabel={t('remoteControl.keyboardScreen.shiftA11y')}>
                            <IonIcon
                                name="arrow-up"
                                size={22}
                                color={isShifted ? colors.accent.purple.base : colors.text.primary}
                            />
                        </KeyCap>
                        <KeyCap
                            label={t('remoteControl.keyboardScreen.backspaceA11y')}
                            variant="command"
                            onPress={onBackspace}
                            accessibilityLabel={t('remoteControl.keyboardScreen.backspaceA11y')}>
                            <IonIcon name="backspace-outline" size={22} color={colors.text.primary} />
                        </KeyCap>
                    </KeyRow>
                ) : null}

                <KeyRow>
                    <KeyCap
                        label={isNumeric ? 'ABC' : '123'}
                        variant="command"
                        active={isNumeric}
                        onPress={() => setIsNumeric((value) => !value)}
                        accessibilityLabel={t('remoteControl.keyboardScreen.numericA11y')}
                    />
                    <KeyCap
                        label={t('remoteControl.keyboardScreen.space')}
                        variant="space"
                        flex={4.3}
                        onPress={onSpace}
                        accessibilityLabel={t('remoteControl.keyboardScreen.space')}
                    />
                    <KeyCap label="." variant="command" onPress={() => onChar('.')} />
                    <KeyCap
                        label={t('remoteControl.keyboardScreen.enterA11y')}
                        variant="command"
                        onPress={onEnter}
                        accessibilityLabel={t('remoteControl.keyboardScreen.enterA11y')}>
                        <IonIcon name="return-down-back-outline" size={22} color={colors.text.primary} />
                    </KeyCap>
                </KeyRow>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: surface.app,
    },
    backgroundSurface: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: surface.app,
    },
    content: {
        alignSelf: 'center',
        flexGrow: 1,
        paddingTop: spacing.sm,
        paddingBottom: KEYBOARD_DOCK_HEIGHT + spacing.md,
        gap: spacing.sm,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
        marginBottom: 2,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: surface.card,
        borderWidth: 1,
        borderColor: surface.border,
        overflow: 'hidden',
    },
    screenTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '800',
        color: colors.text.primary,
    },
    topBarSpacer: {
        width: 38,
    },
    connectedShell: {
        borderRadius: radius.lg,
        backgroundColor: surface.border,
        padding: 1,
        ...elevation.card,
    },
    connectedCard: {
        minHeight: 86,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: surface.card,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    deviceCopy: {
        flex: 1,
        minWidth: 0,
        gap: 3,
    },
    connectedLabel: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    deviceNameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    statusDot: {
        width: 8,
        height: 8,
        marginTop: 6,
        borderRadius: radius.pill,
        backgroundColor: colors.state.success,
    },
    deviceName: {
        flex: 1,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        color: colors.text.primary,
    },
    appTile: {
        width: 86,
        height: 62,
        borderRadius: radius.sm,
        backgroundColor: surface.inset,
        borderWidth: 1,
        borderColor: surface.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: spacing.xs,
    },
    appIcon: {
        width: 34,
        height: 34,
        borderRadius: radius.xs,
        resizeMode: 'contain',
    },
    appTileLabel: {
        marginTop: spacing.xs,
        maxWidth: '100%',
        fontSize: 11,
        fontWeight: '800',
        color: colors.text.primary,
    },
    typingPill: {
        alignSelf: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.sm,
        paddingVertical: 5,
        borderRadius: radius.pill,
        backgroundColor: surface.control,
        borderWidth: 1,
        borderColor: surface.border,
    },
    typingPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.text.secondary,
    },
    inputShell: {
        borderRadius: radius.lg,
        backgroundColor: surface.border,
        padding: 1,
        ...elevation.card,
    },
    inputPanel: {
        minHeight: 172,
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: surface.inset,
    },
    previewScroll: {
        flex: 1,
    },
    previewText: {
        fontSize: 24,
        lineHeight: 31,
        fontWeight: '800',
        color: colors.text.primary,
    },
    cursor: {
        color: component_colors.focus,
    },
    inputActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingTop: spacing.sm,
    },
    inputActionSpacer: {
        flex: 1,
    },
    actionChip: {
        minHeight: 36,
        minWidth: 36,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: surface.control,
        borderWidth: 1,
        borderColor: surface.border,
        overflow: 'hidden',
    },
    actionChipText: {
        fontSize: 12,
        fontWeight: '800',
        color: colors.text.secondary,
    },
    actionChipDisabled: {
        opacity: 0.58,
    },
    searchActionWrap: {
        width: '100%',
    },
    searchButton: {
        minHeight: 52,
        marginTop: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: colors.bone.soft,
        borderWidth: 1,
        borderColor: colors.accent.gray.icon,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        overflow: 'hidden',
        ...elevation.key,
    },
    searchButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.text.inverted,
    },
    keyboardDock: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        paddingTop: 12,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.sm,
        gap: KEY_GAP,
        backgroundColor: surface.raised,
        borderTopWidth: 1,
        borderColor: surface.border,
        ...elevation.dock,
    },
    keyRow: {
        flexDirection: 'row',
        gap: KEY_GAP,
    },
    keyCap: {
        minHeight: KEY_HEIGHT,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: surface.border,
        overflow: 'hidden',
        ...elevation.key,
    },
    letterKey: {
        backgroundColor: surface.control,
    },
    commandKey: {
        minHeight: COMMAND_KEY_HEIGHT,
        backgroundColor: surface.controlAlt,
    },
    spaceKey: {
        minHeight: COMMAND_KEY_HEIGHT,
        backgroundColor: colors.bone.soft,
        borderColor: colors.accent.gray.icon,
    },
    activeKey: {
        borderColor: component_colors.focus,
        backgroundColor: surface.card,
    },
    keyCapText: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
    },
    spaceKeyText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text.inverted,
    },
});
