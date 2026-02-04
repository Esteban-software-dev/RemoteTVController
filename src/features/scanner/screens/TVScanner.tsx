import {
    FlatList,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import { useEffect } from 'react';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { SmallButton } from '@src/shared/components/SmallButton';
import { RokuTVItem } from '../components/RokuTVItem';
import { useRokuScanner } from '../hooks/useRokuScanner';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { fetchActiveRokuApp, fetchSelectedRokuApps } from '../services/roku-device-info.service';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import Animated from 'react-native-reanimated';
import { defaultApps } from '@src/default-apps';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { NoRokuDevice } from '../components/NoRokuDevice';
import { ActiveApp } from '../interfaces/active-app.interface';
import { AppBackground } from '@src/shared/components/AppBackground';
import { useTranslation } from 'react-i18next';

export function TVScanner() {
    const { t } = useTranslation();
    const { bottom, top } = useSafeBarsArea();
    const { devices, scanning, scan } = useRokuScanner();

    const setRokuDevice = useRokuSessionStore(s => s.selectDevice);
    const setActiveApp = useRokuSessionStore(s => s.setActiveApp);
    const setApps = useRokuSessionStore(s => s.setApps);
    const clearSession = useRokuSessionStore(s => s.clearSession);
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);

    useEffect(() => {
        scan();
    }, []);

    const setSelectedRoku = async (rokuDevice: RokuDeviceInfo) => {
        if (selectedDevice?.modelName === rokuDevice.modelName) return;
        setApps([]);
        setRokuDevice(rokuDevice);

        const activeApp = await fetchActiveRokuApp(rokuDevice.ip);
        const rokuApps = await fetchSelectedRokuApps(rokuDevice.ip);
        setActiveApp(activeApp ?? ({} as ActiveApp));
        setApps(rokuApps && rokuApps.length ? rokuApps : defaultApps);
    };

    const devicesSubtitle = scanning
        ? t('tvScanner.devices.scanning')
        : t('tvScanner.devices.found', {
            count: devices.length,
        });

    return (
        <Animated.View
        style={[
            globalStyles.container,
            globalStyles.horizontalAppPadding,
            { paddingTop: top },
        ]}>
            <AppBackground />
            {selectedDevice && (
                <View style={styles.connectedCard}>
                    <SectionHeader
                        title={t('tvScanner.connected.title')}
                        subtitle={t('tvScanner.connected.subtitle')}
                        actionButton={
                            <SmallButton
                                color={colors.gradient[3]}
                                label={t('tvScanner.connected.disconnect')}
                                variant="outline"
                                onPress={clearSession}
                            />
                        }
                    />

                    <RokuTVItem
                        {...selectedDevice}
                        selected
                        showChevron={false}
                    />
                </View>
            )}

            <SectionHeader
                title={t('tvScanner.devices.title')}
                subtitle={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {scanning && (
                            <ActivityIndicator
                                size="small"
                                color={withOpacityHex(colors.dark.base, 0.6)}
                                style={{ marginRight: 6 }}
                            />
                        )}
                        <Text
                            style={{
                                fontSize: 13,
                                color: withOpacityHex(colors.dark.base, 0.6),
                            }}
                        >
                            {devicesSubtitle}
                        </Text>
                    </View>
                }
                actionButton={
                    <SmallButton
                        color={colors.gradient[2]}
                        label={t('tvScanner.devices.scanAction')}
                        iconName="wifi"
                        variant="filled"
                        onPress={scan}
                        disabled={scanning}
                    />
                }
            />

            <FlatList
                contentContainerStyle={{ paddingBottom: bottom }}
                data={devices}
                keyExtractor={(item: RokuDeviceInfo) => item.ip}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: spacing.xs }}>
                        <RokuTVItem
                            {...item}
                            selected={selectedDevice?.ip === item.ip}
                            disabled={scanning}
                            onPress={() => setSelectedRoku(item)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    !scanning ? (
                        <NoRokuDevice
                            title={t('tvScanner.empty.title')}
                            subtitle={t('tvScanner.empty.subtitle')}
                            actionButton={{
                                label: t('tvScanner.empty.retry'),
                                iconName: 'refresh',
                                variant: 'outline',
                                onPress: scan,
                            }}
                        />
                    ) : null
                }
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    connectedCard: {
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: withOpacityHex(colors.gradient[2], 0.08),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.dark, 0.5),
        marginBottom: spacing.md,
    },
});
