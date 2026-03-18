import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { AppBackground } from '@src/shared/components/AppBackground';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { useTranslation } from 'react-i18next';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { useToast } from '@src/shared/context/ToastContext';
import { launchRokuApp } from '@src/features/scanner/services/roku-apps.service';
import { fetchActiveRokuApp } from '@src/features/scanner/services/roku-device-info.service';
import { ActiveApp } from '@src/features/scanner/interfaces/active-app.interface';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootDrawerParamList } from '@src/navigation/navigators/DrawerNavigator';
import { NoRokuDevice } from '@src/features/scanner/components/NoRokuDevice';
import { RokuApp } from '@src/features/scanner/interfaces/roku-app.interface';
import { PinnedQuickLaunchRow } from '../components/PinnedQuickLaunchRow';
import { RemoteActionButton } from '../components/RemoteActionButton';
import { TrackpadSurface } from '../components/TrackpadSurface';
import { RokuRemoteCommand, sendRokuRemoteCommand } from '../services/roku-remote.service';
import { RemoteModeSegment } from '../components/RemoteModeSegment';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
    mass: 0.8,
};

type ControlMode = 'classic' | 'touch';
const EMPTY_PINNED_APPS: RokuApp[] = [];

interface VoiceButtonProps {
    isListening: boolean;
    onPress: () => void;
    listeningText: string;
    idleText: string;
}

function VoiceButton({ isListening, onPress, listeningText, idleText }: VoiceButtonProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={() => {
                scale.value = withSpring(0.94, SPRING_CONFIG);
                opacity.value = withTiming(0.9, { duration: 100 });
            }}
            onPressOut={() => {
                scale.value = withSpring(1, SPRING_CONFIG);
                opacity.value = withTiming(1, { duration: 150 });
            }}
            style={[
                styles.voiceButton,
                isListening ? styles.voiceButtonActive : null,
                animatedStyle,
            ]}
        >
            <IonIcon
                name="mic"
                size={20}
                color={isListening ? colors.white.base : colors.accent.purple.base}
            />
            <Text style={[styles.voiceText, isListening && styles.voiceTextActive]}>
                {isListening ? listeningText : idleText}
            </Text>
        </AnimatedPressable>
    );
}

export function RemoteControl() {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp<RootDrawerParamList>>();

    const { selectedDevice, activeApp, setActiveApp } = useRokuSessionStore();
    const deviceId = selectedDevice?.deviceId;
    const pinnedApps = useAppCustomizationStore((state) =>
        deviceId
            ? state.byDevice[deviceId]?.pinned ?? EMPTY_PINNED_APPS
            : EMPTY_PINNED_APPS
    );

    const { show } = useToast();
    const [mode, setMode] = useState<ControlMode>('classic');
    const [isListening, setIsListening] = useState(false);

    const guardDevice = () => {
        if (selectedDevice) return true;
        show({
            type: 'warning',
            align: 'top',
            title: t('remoteControl.toast.noDeviceTitle'),
            subtitle: t('remoteControl.toast.noDeviceSubtitle'),
            iconName: 'tv',
        });
        return false;
    };

    const onSendCommand = async (command: RokuRemoteCommand) => {
        if (!guardDevice()) return;
        await sendRokuRemoteCommand(selectedDevice!.ip, command);
    };

    const onLaunchPinned = async (app: RokuApp) => {
        if (!guardDevice()) return;

        await launchRokuApp(selectedDevice!.ip, app.id);
        const launchedApp = await fetchActiveRokuApp(selectedDevice!.ip);
        setActiveApp(launchedApp ?? ({} as ActiveApp));
        show({
            type: 'success',
            align: 'top',
            title: t('remoteControl.toast.launchedTitle'),
            subtitle: t('remoteControl.toast.launchedSubtitle', { app: app.name }),
            iconName: 'apps',
            duration: 1600,
        });
    };

    const voiceCommands = useMemo(
        () => [
            { label: t('remoteControl.voice.commandHome'), command: 'home' as RokuRemoteCommand, icon: 'home' as const },
            { label: t('remoteControl.voice.commandBack'), command: 'back' as RokuRemoteCommand, icon: 'arrow-undo' as const },
            { label: t('remoteControl.voice.commandPlay'), command: 'playPause' as RokuRemoteCommand, icon: 'play-circle' as const },
            { label: t('remoteControl.voice.commandMute'), command: 'mute' as RokuRemoteCommand, icon: 'volume-mute' as const },
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
                contentContainerStyle={[
                    styles.content,
                    { paddingTop: spacing.sm, paddingBottom: spacing.xl },
                ]}
                showsVerticalScrollIndicator={false}>
                <View style={styles.headerCard}>
                    <View>
                        <Text style={styles.headerLabel}>{t('remoteControl.connected.label')}</Text>
                        <Text style={styles.headerDevice}>{selectedDevice.friendlyDeviceName}</Text>
                        <Text style={styles.headerSubtitle}>
                            {activeApp?.text || t('remoteControl.connected.unknownApp')}
                        </Text>
                    </View>
                    <RemoteModeSegment
                        value={mode}
                        onChange={setMode}
                        classicLabel={t('remoteControl.modes.classic')}
                        touchLabel={t('remoteControl.modes.touch')}
                        style={styles.modeSegment}
                    />
                </View>

                <View style={styles.quickAppsCard}>
                    <Text style={styles.quickAppsTitle}>{t('remoteControl.sections.pinned')}</Text>
                    <PinnedQuickLaunchRow
                        apps={pinnedApps}
                        onPress={onLaunchPinned}
                        emptyLabel={t('remoteControl.pinned.empty')}
                        selectedAppId={activeApp?.id}
                    />
                </View>

                <View style={styles.controlsCard}>
                    <Text style={styles.controlsTitle}>{t('remoteControl.sections.controls')}</Text>
                    <View style={styles.priorityActions}>
                        <RemoteActionButton
                            iconName="power"
                            label="Power"
                            size="lg"
                            variant="filled"
                            color={colors.state.danger}
                            style={styles.priorityButton}
                            onPress={() => onSendCommand('power')}
                        />
                        <RemoteActionButton
                            iconName="volume-mute"
                            label="Mute"
                            size="lg"
                            variant="filled"
                            color={colors.dark.base}
                            style={styles.priorityButton}
                            onPress={() => onSendCommand('mute')}
                        />
                    </View>
                    {mode === 'classic' ? (
                        <View style={styles.classicWrap}>
                            <View style={styles.dpad}>
                                <RemoteActionButton
                                    iconName="chevron-up"
                                    iconOnly
                                    style={styles.dpadUp}
                                    onPress={() => onSendCommand('up')}
                                />
                                <RemoteActionButton
                                    iconName="chevron-back"
                                    iconOnly
                                    style={styles.dpadLeft}
                                    onPress={() => onSendCommand('left')}
                                />
                                <RemoteActionButton
                                    iconName="ellipse"
                                    iconOnly
                                    variant="filled"
                                    style={styles.dpadCenter}
                                    onPress={() => onSendCommand('select')}
                                />
                                <RemoteActionButton
                                    iconName="chevron-forward"
                                    iconOnly
                                    style={styles.dpadRight}
                                    onPress={() => onSendCommand('right')}
                                />
                                <RemoteActionButton
                                    iconName="chevron-down"
                                    iconOnly
                                    style={styles.dpadDown}
                                    onPress={() => onSendCommand('down')}
                                />
                            </View>
                            <View style={styles.controlsRow}>
                                <RemoteActionButton iconOnly iconName="home" size="lg" onPress={() => onSendCommand('home')} />
                                <RemoteActionButton iconOnly iconName="arrow-back" size="lg" onPress={() => onSendCommand('back')} />
                                <RemoteActionButton iconOnly iconName="play-circle" size="lg" onPress={() => onSendCommand('playPause')} />
                                <RemoteActionButton iconOnly iconName="information-circle" size="lg" onPress={() => onSendCommand('info')} />
                            </View>
                            <View style={styles.controlsRow}>
                                <RemoteActionButton iconOnly iconName="play-back" onPress={() => onSendCommand('rewind')} />
                                <RemoteActionButton iconOnly iconName="play-forward" onPress={() => onSendCommand('fastForward')} />
                                <RemoteActionButton iconOnly iconName="volume-high" onPress={() => onSendCommand('volumeUp')} />
                                <RemoteActionButton iconOnly iconName="volume-low" onPress={() => onSendCommand('volumeDown')} />
                            </View>
                        </View>
                    ) : (
                        <TrackpadSurface
                            onDirection={(direction) => onSendCommand(direction)}
                            onTap={() => onSendCommand('select')}
                        />
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{t('remoteControl.sections.voice')}</Text>
                    <View style={styles.voiceRow}>
                        <VoiceButton
                            isListening={isListening}
                            onPress={() => setIsListening((prev) => !prev)}
                            listeningText={t('remoteControl.voice.listening')}
                            idleText={t('remoteControl.voice.idle')}
                        />
                        <Text style={styles.voiceHint}>{t('remoteControl.voice.hint')}</Text>
                    </View>

                    <View style={styles.voiceCommandList}>
                        {voiceCommands.map((item) => (
                            <RemoteActionButton
                                key={item.command}
                                iconName={item.icon}
                                label={item.label}
                                color={colors.accent.teal.strong}
                                style={styles.voiceActionButton}
                                onPress={() => onSendCommand(item.command)}
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
        paddingHorizontal: spacing.sm,
        gap: spacing.sm,
    },
    headerCard: {
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.22),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: withOpacityHex(colors.dark.base, 0.58),
    },
    headerDevice: {
        marginTop: spacing.xs,
        fontSize: 18,
        fontWeight: '800',
        color: colors.dark.base,
    },
    headerSubtitle: {
        marginTop: 2,
        fontSize: 13,
        fontWeight: '500',
        color: withOpacityHex(colors.dark.base, 0.62),
    },
    modeSegment: {
        width: 168,
        maxWidth: '48%',
    },
    card: {
        borderRadius: radius.lg,
        padding: spacing.md,
        backgroundColor: colors.white.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.gray.base, 0.32),
        gap: spacing.sm,
    },
    quickAppsCard: {
        borderRadius: radius.md,
        paddingVertical: spacing.sm,
        paddingLeft: spacing.sm,
        paddingRight: 0,
        backgroundColor: withOpacityHex(colors.white.base, 0.9),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.2),
        gap: spacing.xs,
        flexDirection: 'column',
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
        borderColor: withOpacityHex(colors.accent.purple.base, 0.28),
        gap: spacing.sm,
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.dark.base,
    },
    controlsTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: colors.dark.base,
    },
    voiceRow: {
        gap: spacing.xs,
    },
    voiceButton: {
        minHeight: 48,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.32),
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.08),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.xs,
    },
    voiceButtonActive: {
        backgroundColor: colors.accent.purple.base,
        borderColor: colors.accent.purple.base,
    },
    voiceText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.accent.purple.base,
    },
    voiceTextActive: {
        color: colors.white.base,
    },
    voiceHint: {
        fontSize: 12,
        color: withOpacityHex(colors.dark.base, 0.56),
    },
    voiceCommandList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    voiceActionButton: {
        minWidth: '48%',
    },
    classicWrap: {
        alignItems: 'center',
        gap: spacing.md,
    },
    dpad: {
        width: 238,
        height: 238,
        borderRadius: radius.pill,
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.14),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.18),
        position: 'relative',
    },
    dpadUp: {
        position: 'absolute',
        top: spacing.sm,
        left: '50%',
        marginLeft: -26,
        width: 52,
    },
    dpadDown: {
        position: 'absolute',
        bottom: spacing.sm,
        left: '50%',
        marginLeft: -26,
        width: 52,
    },
    dpadLeft: {
        position: 'absolute',
        left: spacing.sm,
        top: '50%',
        marginTop: -21,
        width: 52,
    },
    dpadRight: {
        position: 'absolute',
        right: spacing.sm,
        top: '50%',
        marginTop: -21,
        width: 52,
    },
    dpadCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -34,
        marginTop: -34,
        width: 68,
        height: 68,
        borderRadius: radius.pill,
        backgroundColor: colors.accent.purple.base,
    },
    controlsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    priorityActions: {
        width: '100%',
        flexDirection: 'row',
        gap: spacing.sm,
    },
    priorityButton: {
        flex: 1,
    },
});
