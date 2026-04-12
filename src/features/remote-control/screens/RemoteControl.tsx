import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppBackground } from '@src/shared/components/AppBackground';
import { colors } from '@src/config/theme/colors/colors';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { RootDrawerParamList } from '@src/navigation/navigators/DrawerNavigator';
import { useToast } from '@src/shared/context/ToastContext';
import { NoRokuDevice } from '@src/features/scanner/components/NoRokuDevice';
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import { launchRokuApp } from '@src/features/scanner/services/roku-apps.service';
import { fetchActiveRokuApp } from '@src/features/scanner/services/roku-device-info.service';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { PinnedQuickLaunchRow } from '../components/PinnedQuickLaunchRow';
import { RemoteActionButton } from '../components/RemoteActionButton';
import { RemoteModeSegment } from '../components/RemoteModeSegment';
import { TrackpadSurface } from '../components/TrackpadSurface';
import { VerticalVolumeControl } from '../components/VerticalVolumeControl';
import { RokuRemoteCommand, sendRokuRemoteCommand } from '../services/roku-remote.service';
import {
    getDpadButtonLayout,
    getNavigationControlsLayout,
} from '../utils/navigation-controls-layout';
import { GridButtonConfig, VoiceButtonProps } from '../data/interfaces/remote-control.interface';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { normalizeSize, roundToLayoutPixel } from '@src/config/theme/utils/normalize-size';

type ControlMode = 'classic' | 'touch';

const EMPTY_PINNED_APPS: RokuApp[] = [];
const D_PAD_HIT_SLOP = 12;


function VoiceButton({
    isListening,
    disabled = false,
    onPress,
    listeningText,
    idleText,
    accessibilityLabel,
    accessibilityHint,
}: VoiceButtonProps) {
    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            android_ripple={androidRipple({ color: withOpacityHex(colors.accent.teal.strong, 0.28) })}
            accessibilityRole="button"
            accessibilityState={{ disabled, busy: isListening }}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            hitSlop={10}
            style={({ pressed }) => [
                styles.voiceMainButton,
                isListening ? styles.voiceMainButtonActive : null,
                disabled ? styles.voiceMainButtonDisabled : null,
                disabled ? null : iosPressOpacity(pressed, false),
            ]}>
            <IonIcon
                name={isListening ? 'mic-circle' : 'mic-outline'}
                size={26}
                color={isListening ? colors.white.base : colors.accent.teal.strong}
            />
            <Text style={[styles.voiceMainText, isListening ? styles.voiceMainTextActive : null]}>
                {isListening ? listeningText : idleText}
            </Text>
        </Pressable>
    );
}

export function RemoteControl() {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();
    const { show } = useToast();
    const { width: windowWidth } = useWindowDimensions();
    const navLayout = useMemo(
        () => getNavigationControlsLayout(windowWidth),
        [windowWidth],
    );
    const dpadKeys = useMemo(
        () => getDpadButtonLayout(navLayout.dpadScale),
        [navLayout.dpadScale],
    );

    const dpadLayoutStyles = useMemo(() => {
        const k = dpadKeys;
        return {
            surface: {
                width: navLayout.dpadSize,
                height: navLayout.dpadSize,
                borderRadius: navLayout.dpadBorderRadius,
            },
            up: {
                top: k.edgeInset,
                left: '50%' as const,
                marginLeft: k.directionalOffset,
                width: k.directionalSize,
                height: k.directionalSize,
            },
            down: {
                bottom: k.edgeInset,
                left: '50%' as const,
                marginLeft: k.directionalOffset,
                width: k.directionalSize,
                height: k.directionalSize,
            },
            left: {
                left: k.edgeInset,
                top: '50%' as const,
                marginTop: k.directionalOffset,
                width: k.directionalSize,
                height: k.directionalSize,
            },
            right: {
                right: k.edgeInset,
                top: '50%' as const,
                marginTop: k.directionalOffset,
                width: k.directionalSize,
                height: k.directionalSize,
            },
            center: {
                top: '50%' as const,
                left: '50%' as const,
                marginLeft: k.centerOffset,
                marginTop: k.centerOffset,
                width: k.centerSize,
                height: k.centerSize,
            },
        };
    }, [dpadKeys, navLayout]);

    const { selectedDevice, activeApp, setActiveApp } = useRokuSessionStore();
    const deviceId = selectedDevice?.deviceId;
    const pinnedApps = useAppCustomizationStore((state) =>
        deviceId ? state.byDevice[deviceId]?.pinned ?? EMPTY_PINNED_APPS : EMPTY_PINNED_APPS
    );

    const [mode, setMode] = useState<ControlMode>('classic');
    const [isListening, setIsListening] = useState(false);
    const [pendingCommand, setPendingCommand] = useState<RokuRemoteCommand | null>(null);
    const [launchingAppId, setLaunchingAppId] = useState<string | null>(null);
    const [isRefreshingApp, setIsRefreshingApp] = useState(false);
    const [mutePending, setMutePending] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [optimisticVolume, setOptimisticVolume] = useState(0.55);

    const activeAppLabel = activeApp?.text?.trim() || t('remoteControl.connected.unknownApp');
    const isBusy = Boolean(pendingCommand || launchingAppId || isRefreshingApp);
    const isVolumeControlDisabled = Boolean(launchingAppId || isRefreshingApp);
    const switchColors = useMemo(() => ({
        true: withOpacityHex(colors.accent.purple.base, 0.35),
        false: withOpacityHex(colors.dark.base, 0.1),
    }), []);
    const muteStatusLabel = isMuted
        ? t('remoteControl.states.muted')
        : t('remoteControl.states.volumeLevel', { value: Math.round(optimisticVolume * 100) });

    const guardDevice = () => {
        if (selectedDevice) return selectedDevice;

        show({
            type: 'warning',
            align: 'top',
            title: t('remoteControl.toast.noDeviceTitle'),
            subtitle: t('remoteControl.toast.noDeviceSubtitle'),
            iconName: 'tv',
        });

        return null;
    };

    const refreshActiveApp = async (showFailureToast = true) => {
        const device = guardDevice();
        if (!device) return null;

        setIsRefreshingApp(true);

        try {
            const refreshedApp = await fetchActiveRokuApp(device.ip);

            if (!refreshedApp?.id) {
                if (showFailureToast) {
                    show({
                        type: 'warning',
                        align: 'top',
                        title: t('remoteControl.toast.refreshErrorTitle'),
                        subtitle: t('remoteControl.toast.refreshErrorSubtitle'),
                        iconName: 'refresh',
                    });
                }

                return null;
            }

            setActiveApp(refreshedApp);
            return refreshedApp;
        } catch (error) {
            if (showFailureToast) {
                show({
                    type: 'danger',
                    align: 'top',
                    title: t('remoteControl.toast.refreshErrorTitle'),
                    subtitle: t('remoteControl.toast.refreshErrorSubtitle'),
                    iconName: 'warning',
                });
            }

            return null;
        } finally {
            setIsRefreshingApp(false);
        }
    };

    const onSendCommand = async (command: RokuRemoteCommand) => {
        const device = guardDevice();
        if (!device || isBusy) return;

        // setPendingCommand(command);

        try {
            const sent = await sendRokuRemoteCommand(device.ip, command);

            if (!sent) {
                throw new Error('remote-command-failed');
            }
        } catch (error) {
            show({
                type: 'danger',
                align: 'top',
                title: t('remoteControl.toast.commandErrorTitle'),
                subtitle: t('remoteControl.toast.commandErrorSubtitle'),
                iconName: 'warning',
            });
        } finally {
            setPendingCommand(null);
        }
    };

    const onLaunchPinned = async (app: RokuApp) => {
        const device = guardDevice();
        if (!device || isBusy) return;

        setLaunchingAppId(app.id);

        try {
            const launched = await launchRokuApp(device.ip, app.id);

            if (!launched) {
                throw new Error('launch-app-failed');
            }

            await refreshActiveApp(false);

            show({
                type: 'success',
                align: 'top',
                title: t('remoteControl.toast.launchedTitle'),
                subtitle: t('remoteControl.toast.launchedSubtitle', { app: app.name }),
                iconName: 'apps',
                duration: 1600,
            });
        } catch (error) {
            show({
                type: 'danger',
                align: 'top',
                title: t('remoteControl.toast.launchErrorTitle'),
                subtitle: t('remoteControl.toast.launchErrorSubtitle', { app: app.name }),
                iconName: 'warning',
            });
        } finally {
            setLaunchingAppId(null);
        }
    };

    const sendVolumeCommand = async (command: 'volumeUp' | 'volumeDown') => {
        const device = guardDevice();
        if (!device) return;

        const sent = await sendRokuRemoteCommand(device.ip, command);

        if (!sent) {
            show({
                type: 'danger',
                align: 'top',
                title: t('remoteControl.toast.commandErrorTitle'),
                subtitle: t('remoteControl.toast.commandErrorSubtitle'),
                iconName: 'warning',
            });
        }
    };

    const onToggleMute = async () => {
        const device = guardDevice();
        if (!device || mutePending || isBusy) return;

        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        // setMutePending(true);

        try {
            const sent = await sendRokuRemoteCommand(device.ip, 'mute');

            if (!sent) {
                throw new Error('mute-command-failed');
            }
        } catch (error) {
            setIsMuted(!nextMuted);
            show({
                type: 'danger',
                align: 'top',
                title: t('remoteControl.toast.commandErrorTitle'),
                subtitle: t('remoteControl.toast.commandErrorSubtitle'),
                iconName: 'warning',
            });
        } finally {
            setMutePending(false);
        }
    };

    const leftColumnButtons = useMemo<GridButtonConfig[]>(
        () => [
            {
                iconName: 'return-up-back',
                label: t('remoteControl.actions.back'),
                command: 'back',
                color: colors.accent.purple.base,
            },
            {
                iconName: 'home-sharp',
                label: t('remoteControl.actions.home'),
                command: 'home',
                color: colors.state.info,
            },
            {
                iconName: 'information-circle',
                label: t('remoteControl.actions.info'),
                command: 'info',
                color: colors.accent.gray.icon,
            },
        ],
        [t]
    );

    const rightColumnButtons = useMemo<GridButtonConfig[]>(
        () => [
            {
                iconName: 'play-skip-back',
                label: t('remoteControl.actions.rewind'),
                command: 'rewind',
                color: colors.accent.purple.strong,
            },
            {
                iconName: 'pause-circle',
                label: t('remoteControl.voice.commandPlay'),
                command: 'playPause',
                color: colors.accent.teal.strong,
                variant: 'filled',
            },
            {
                iconName: 'play-skip-forward',
                label: t('remoteControl.actions.forward'),
                command: 'fastForward',
                color: colors.state.info,
            },
        ],
        [t]
    );

    const voiceCommands = useMemo(
        () => [
            {
                label: t('remoteControl.voice.commandHome'),
                command: 'home' as RokuRemoteCommand,
                icon: 'home-sharp' as const,
            },
            {
                label: t('remoteControl.voice.commandBack'),
                command: 'back' as RokuRemoteCommand,
                icon: 'return-up-back' as const,
            },
            {
                label: t('remoteControl.voice.commandPlay'),
                command: 'playPause' as RokuRemoteCommand,
                icon: 'pause-circle' as const,
            },
            {
                label: t('remoteControl.voice.commandMute'),
                command: 'mute' as RokuRemoteCommand,
                icon: 'volume-medium' as const,
            },
        ],
        [t]
    );

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
        <View style={globalStyles.container}>
            <AppBackground />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                <View style={styles.headerCard}>
                    <View style={styles.headerMain}>
                        <View style={styles.statusPill}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>
                                {t('remoteControl.connected.statusConnected')}
                            </Text>
                        </View>

                        <Text style={styles.headerLabel}>
                            {t('remoteControl.connected.label')}
                        </Text>
                        <Text style={styles.headerDevice}>{selectedDevice.friendlyDeviceName}</Text>

                        <View style={styles.activeAppRow}>
                            <View
                                style={[
                                    styles.activeAppDot,
                                    activeApp?.text ? styles.activeAppDotOn : null,
                                ]}
                            />
                            <Text style={styles.activeAppCaption}>
                                {t('remoteControl.connected.activeApp')}
                            </Text>
                            <Text numberOfLines={1} style={styles.activeAppValue}>
                                {activeAppLabel}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerActions}>
                        <RemoteModeSegment
                            value={mode}
                            onChange={setMode}
                            classicLabel={t('remoteControl.modes.classic')}
                            touchLabel={t('remoteControl.modes.touch')}
                            style={styles.modeSegment}
                        />

                        <RemoteActionButton
                            iconName="refresh"
                            label={t('remoteControl.connected.refresh')}
                            size="sm"
                            color={colors.accent.teal.strong}
                            loading={isRefreshingApp}
                            disabled={isBusy && !isRefreshingApp}
                            style={styles.refreshButton}
                            onPress={() => refreshActiveApp(true)}
                            accessibilityLabel={t('remoteControl.connected.refresh')}
                            accessibilityHint={t('remoteControl.connected.refreshHint')}
                            hitSlop={10}
                        />
                    </View>
                </View>

                <View style={styles.quickAppsCard}>
                    <Text style={styles.quickAppsTitle}>{t('remoteControl.sections.pinned')}</Text>
                    <PinnedQuickLaunchRow
                        apps={pinnedApps}
                        onPress={onLaunchPinned}
                        emptyLabel={t('remoteControl.pinned.empty')}
                        deviceId={selectedDevice.deviceId}
                        deviceIp={selectedDevice.ip}
                        selectedAppId={activeApp?.id}
                        loadingAppId={launchingAppId}
                        disabled={isBusy}
                    />
                </View>

                <View style={styles.controlsCard}>
                    <Text style={styles.controlsTitle}>{t('remoteControl.sections.controls')}</Text>
                    <View style={styles.footerActionContainer}>
                        <View style={styles.footerActionsRow}>
                            <RemoteActionButton
                                iconName="power"
                                size="lg"
                                variant="filled"
                                color={colors.state.danger}
                                loading={pendingCommand === 'power'}
                                disabled={isBusy && pendingCommand !== 'power'}
                                onPress={() => onSendCommand('power')}
                                accessibilityLabel={t('remoteControl.actions.power')}
                                accessibilityHint={t('remoteControl.actions.powerHint')}
                            />
                            <Pressable
                            accessibilityRole="switch"
                            accessibilityState={{
                                checked: isMuted,
                                busy: mutePending,
                            }}
                            accessibilityLabel={t('remoteControl.actions.mute')}
                            accessibilityHint={t('remoteControl.actions.muteHint')}
                            onPress={onToggleMute}
                            android_ripple={androidRipple({ color: withOpacityHex(colors.accent.purple.base, 0.16) })}
                            style={({ pressed }) => [
                                styles.muteToggleCard,
                                isMuted ? styles.muteToggleCardActive : null,
                                mutePending || isBusy ? styles.muteToggleDisabled : null,
                                mutePending || isBusy ? null : iosPressOpacity(pressed, false),
                            ]}>
                                <View style={styles.muteToggleLeft}>
                                    <View
                                        style={[
                                        styles.muteToggleIconWrap,
                                        isMuted ? styles.muteToggleIconWrapActive : null,
                                        ]}>
                                        <IonIcon
                                        name={isMuted ? 'volume-mute' : 'volume-high'}
                                        size={18}
                                        color={isMuted ? colors.accent.purple.base : colors.accent.gray.icon}
                                        />
                                    </View>

                                    <View style={styles.muteToggleTextWrap}>
                                        <Text style={styles.muteToggleLabel}>
                                            {t('remoteControl.actions.mute')}
                                        </Text>
                                        <Text style={styles.muteToggleStatus}>
                                            {muteStatusLabel}
                                        </Text>
                                    </View>
                                </View>

                                <Switch
                                    value={isMuted}
                                    onValueChange={onToggleMute}
                                    trackColor={switchColors}
                                    thumbColor={colors.white.base}
                                />
                            </Pressable>
                        </View>
                    </View>
                    {mode === 'classic' ? (
                        <View style={styles.classicWrap}>
                            <View style={styles.sectionGroup}>
                                <Text style={styles.groupTitle}>
                                    {t('remoteControl.groups.navigation')}
                                </Text>
                                <View
                                    style={[
                                        styles.navigationControlsRow,
                                        { gap: navLayout.columnGap },
                                    ]}>
                                    <View
                                        style={[
                                            styles.channelRailShell,
                                            { width: navLayout.leftRailWidth, minWidth: navLayout.leftRailWidth },
                                        ]}>
                                        <View style={styles.channelRail}>
                                            <RemoteActionButton
                                                variant='soft'
                                                iconName="chevron-up"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                size="sm"
                                                loading={pendingCommand === 'up'}
                                                disabled={isBusy && pendingCommand !== 'up'}
                                                onPress={() => onSendCommand('up')}
                                                accessibilityLabel={t('remoteControl.actions.channelUp')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                            <Text style={styles.channelLabel}>CH</Text>
                                            <RemoteActionButton
                                                variant='soft'
                                                iconName="chevron-down"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                size="sm"
                                                loading={pendingCommand === 'down'}
                                                disabled={isBusy && pendingCommand !== 'down'}
                                                onPress={() => onSendCommand('down')}
                                                accessibilityLabel={t('remoteControl.actions.channelDown')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.centerPadWrapper}>
                                        <View style={[styles.dpad, dpadLayoutStyles.surface]}>
                                            <RemoteActionButton
                                                iconName="chevron-up"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                style={[styles.dpadKeyBase, dpadLayoutStyles.up]}
                                                loading={pendingCommand === 'up'}
                                                disabled={isBusy && pendingCommand !== 'up'}
                                                onPress={() => onSendCommand('up')}
                                                accessibilityLabel={t('remoteControl.actions.navigateUp')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                            <RemoteActionButton
                                                iconName="chevron-back"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                style={[styles.dpadKeyBase, dpadLayoutStyles.left]}
                                                loading={pendingCommand === 'left'}
                                                disabled={isBusy && pendingCommand !== 'left'}
                                                onPress={() => onSendCommand('left')}
                                                accessibilityLabel={t('remoteControl.actions.navigateLeft')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                            <RemoteActionButton
                                                iconName="ellipse"
                                                iconOnly
                                                variant="filled"
                                                color={colors.accent.purple.strong}
                                                style={[styles.dpadKeyBase, styles.dpadCenterFill, dpadLayoutStyles.center]}
                                                loading={pendingCommand === 'select'}
                                                disabled={isBusy && pendingCommand !== 'select'}
                                                onPress={() => onSendCommand('select')}
                                                accessibilityLabel={t('remoteControl.actions.select')}
                                                accessibilityHint={t('remoteControl.actions.selectHint')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                            <RemoteActionButton
                                                iconName="chevron-forward"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                style={[styles.dpadKeyBase, dpadLayoutStyles.right]}
                                                loading={pendingCommand === 'right'}
                                                disabled={isBusy && pendingCommand !== 'right'}
                                                onPress={() => onSendCommand('right')}
                                                accessibilityLabel={t('remoteControl.actions.navigateRight')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                            <RemoteActionButton
                                                iconName="chevron-down"
                                                iconOnly
                                                color={colors.accent.purple.base}
                                                style={[styles.dpadKeyBase, dpadLayoutStyles.down]}
                                                loading={pendingCommand === 'down'}
                                                disabled={isBusy && pendingCommand !== 'down'}
                                                onPress={() => onSendCommand('down')}
                                                accessibilityLabel={t('remoteControl.actions.navigateDown')}
                                                hitSlop={D_PAD_HIT_SLOP}
                                            />
                                        </View>
                                    </View>

                                    <View
                                        style={[
                                            styles.rightRailShell,
                                            { width: navLayout.rightRailWidth, minWidth: navLayout.rightRailWidth },
                                        ]}>
                                        <View style={styles.rightVolumeRail}>
                                            <VerticalVolumeControl
                                                layoutWidth={navLayout.rightRailWidth}
                                                disabled={isVolumeControlDisabled}
                                                onVolumeUp={() => sendVolumeCommand('volumeUp')}
                                                onVolumeDown={() => sendVolumeCommand('volumeDown')}
                                                onPreviewChange={setOptimisticVolume}
                                                initialValue={optimisticVolume}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.sectionGroup}>
                                <Text style={styles.groupTitle}>
                                    {t('remoteControl.groups.system')}
                                </Text>
                                <View style={styles.quickNavRow}>
                                    {leftColumnButtons.map((item) => (
                                        <RemoteActionButton
                                            key={item.command}
                                            iconName={item.iconName}
                                            label={item.label}
                                            size="sm"
                                            variant={item.variant ?? 'soft'}
                                            color={item.color}
                                            style={styles.quickNavButton}
                                            loading={pendingCommand === item.command}
                                            disabled={isBusy && pendingCommand !== item.command}
                                            onPress={() => onSendCommand(item.command)}
                                            accessibilityLabel={item.label}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.sectionGroup}>
                                <Text style={styles.groupTitle}>
                                    {t('remoteControl.groups.media')}
                                </Text>
                                <View style={styles.mediaRow}>
                                    {rightColumnButtons.map((item) => (
                                        <RemoteActionButton
                                            key={item.command}
                                            iconName={item.iconName}
                                            label={item.label}
                                            size="sm"
                                            variant={item.variant ?? 'soft'}
                                            color={item.color}
                                            style={styles.mediaButton}
                                            loading={pendingCommand === item.command}
                                            disabled={isBusy && pendingCommand !== item.command}
                                            onPress={() => onSendCommand(item.command)}
                                            accessibilityLabel={item.label}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    ) : (
                        <TrackpadSurface
                            disabled={isBusy}
                            onDirection={(direction) => onSendCommand(direction)}
                            onTap={() => onSendCommand('select')}
                        />
                    )}
                </View>

                <View style={styles.voiceCard}>
                    <Text style={styles.sectionTitle}>{t('remoteControl.sections.voice')}</Text>

                    <View style={styles.voiceMain}>
                        <VoiceButton
                            isListening={isListening}
                            disabled={isBusy}
                            onPress={() => setIsListening((prev) => !prev)}
                            listeningText={t('remoteControl.voice.listening')}
                            idleText={t('remoteControl.voice.idle')}
                            accessibilityLabel={t('remoteControl.voice.buttonLabel')}
                            accessibilityHint={t('remoteControl.voice.buttonHint')}
                        />
                        <Text style={styles.voiceHint}>{t('remoteControl.voice.hint')}</Text>
                    </View>

                    <View style={styles.voiceCommandsGrid}>
                        {voiceCommands.map((item) => (
                            <RemoteActionButton
                                key={item.command}
                                iconName={item.icon}
                                label={item.label}
                                color={colors.accent.teal.strong}
                                style={styles.voiceGridButton}
                                loading={pendingCommand === item.command}
                                disabled={isBusy && pendingCommand !== item.command}
                                onPress={() => onSendCommand(item.command)}
                                accessibilityLabel={item.label}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingTop: spacing.sm,
        paddingBottom: roundToLayoutPixel(spacing.xl * spacing.xxs),
        paddingHorizontal: spacing.sm,
        gap: spacing.sm,
    },
    headerCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.18),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    headerMain: {
        flex: 1,
        gap: spacing.xs,
        minWidth: 0,
    },
    statusPill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        backgroundColor: withOpacityHex(colors.green.base, 0.12),
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: radius.pill,
        backgroundColor: colors.state.success,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.green.base,
    },
    headerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: withOpacityHex(colors.dark.base, 0.56),
    },
    headerDevice: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.dark.base,
    },
    activeAppRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        minWidth: 0,
    },
    activeAppDot: {
        width: 8,
        height: 8,
        borderRadius: radius.pill,
        backgroundColor: withOpacityHex(colors.accent.gray.icon, 0.55),
    },
    activeAppDotOn: {
        backgroundColor: colors.accent.teal.strong,
    },
    activeAppCaption: {
        fontSize: 12,
        fontWeight: '700',
        color: withOpacityHex(colors.dark.base, 0.56),
    },
    activeAppValue: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        color: colors.dark.base,
    },
    headerActions: {
        width: 172,
        gap: spacing.xs,
        alignItems: 'stretch',
    },
    modeSegment: {
        width: '100%',
    },
    refreshButton: {
        minHeight: 42,
    },
    quickAppsCard: {
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingLeft: spacing.sm,
        paddingRight: 0,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.icon, 0.18),
        gap: spacing.xs,
    },
    quickAppsTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: withOpacityHex(colors.dark.base, 0.68),
        marginBottom: 2,
    },
    controlsCard: {
        borderRadius: radius.xl,
        padding: spacing.md,
        backgroundColor: colors.white.base,
        borderWidth: 1.5,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.24),
        gap: spacing.md,
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.12,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 7,
    },
    controlsTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.dark.base,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.dark.base,
    },
    classicWrap: {
        gap: spacing.md,
    },
    heroRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    sectionGroup: {
        gap: spacing.sm,
    },
    navigationControlsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    channelRailShell: {
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    channelRail: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    channelLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: withOpacityHex(colors.dark.base, .7),
        marginVertical: spacing.xs,
    },
    centerPadWrapper: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightRailShell: {
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
    },
    rightVolumeRail: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: withOpacityHex(colors.dark.base, 0.62),
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    dpad: {
        backgroundColor: colors.bone.base,
        borderWidth: 1.5,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.16),
        position: 'relative',
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    dpadKeyBase: {
        position: 'absolute',
    },
    dpadCenterFill: {
        borderRadius: radius.pill,
        backgroundColor: colors.accent.purple.strong,
    },
    quickNavRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    quickNavButton: {
        flex: 1,
        minHeight: 50,
        paddingHorizontal: spacing.xs,
        borderRadius: radius.md,
        shadowOpacity: 0.04,
        elevation: 1,
    },
    mediaRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    mediaButton: {
        flex: 1,
        minHeight: 52,
        paddingHorizontal: spacing.xs,
    },
    footerActionContainer: {
        height: '10%',
        justifyContent: 'center',
    },
    footerActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    muteToggleCard: {
        width: normalizeSize(200, 'width'),
        height: '100%',
        borderRadius: normalizeSize(radius.md),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.icon, 0.18),
        backgroundColor: colors.white.base,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    muteToggleCardActive: {
        borderColor: withOpacityHex(colors.accent.purple.base, 0.28),
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.06),
    },
    muteToggleDisabled: {
        opacity: 0.55,
    },
    muteToggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
        minWidth: 0,
    },
    muteToggleIconWrap: {
        width: 34,
        height: 34,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: withOpacityHex(colors.accent.gray.icon, 0.08),
    },
    muteToggleIconWrapActive: {
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.14),
    },
    muteToggleTextWrap: {
        flex: 1,
        minWidth: 0,
    },
    muteToggleLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: colors.dark.base,
    },
    muteToggleStatus: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: '600',
        color: withOpacityHex(colors.dark.base, 0.5),
    },
    footerActionButton: {
        flex: 1,
        minHeight: 58,
    },
    voiceCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.teal.base, 0.18),
        gap: spacing.md,
        shadowColor: colors.accent.teal.base,
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    voiceMain: {
        gap: spacing.sm,
    },
    voiceMainButton: {
        minHeight: 58,
        borderRadius: radius.lg,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: colors.accent.teal.strong,
        backgroundColor: colors.white.base,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    voiceMainButtonActive: {
        backgroundColor: colors.accent.teal.strong,
        borderColor: colors.accent.teal.strong,
    },
    voiceMainButtonDisabled: {
        opacity: 0.6,
    },
    voiceMainText: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.accent.teal.strong,
    },
    voiceMainTextActive: {
        color: colors.white.base,
    },
    voiceHint: {
        fontSize: 12,
        lineHeight: 18,
        color: withOpacityHex(colors.dark.base, 0.56),
    },
    voiceCommandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        justifyContent: 'space-between',
    },
    voiceGridButton: {
        minWidth: '48%',
        flex: 1,
        minHeight: 56,
    },
});
