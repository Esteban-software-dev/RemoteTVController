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

import { IonIcon } from '@src/shared/components/IonIcon';
import { SmallButton } from '@src/shared/components/SmallButton';

import { RokuTVItem } from '../components/RokuTVItem';
import { useRokuScanner } from '../hooks/useRokuScanner';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { RokuDeviceInfo } from '@src/shared/ssdp/types/ssdp.types';
import { fetchSelectedRokuApps } from '../services/roku-device-info.service';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import Animated from 'react-native-reanimated';
import { fakeApps } from '@src/data.fake';
import { SectionHeader } from '@src/shared/components/SectionHeader';

export function TVScanner() {
    const { bottom, top } = useSafeBarsArea();
    const { devices, scanning, scan } = useRokuScanner();

    const setRokuDevice = useRokuSessionStore(s => s.selectDevice);
    const setApps = useRokuSessionStore(s => s.setApps);
    const clearSession = useRokuSessionStore(s => s.clearSession);
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);

    useEffect(() => {
        scan();
        /**
         * * Temporal set
         */
        setApps(fakeApps);
    }, []);

    const setSelectedRoku = async (rokuDevice: RokuDeviceInfo) => {
        if (selectedDevice?.modelName === rokuDevice.modelName) return;
        setApps([]);
        const rokuApps = await fetchSelectedRokuApps(rokuDevice.ip);
        console.log({rokuApps});
        setRokuDevice(rokuDevice);
        setApps(rokuApps && rokuApps.length ? rokuApps : fakeApps);
    }

    return (
        <Animated.View style={[globalStyles.container, globalStyles.horizontalAppPadding, {
            paddingTop: top,
        }]}>
            {selectedDevice && (
                <View style={styles.connectedCard}>
                    <SectionHeader
                    title='Dispositivo conectado'
                    subtitle={'Listo para usarse'}
                    actionButton={
                        <SmallButton
                            color={colors.gradient[3]}
                            label='Desconectar'
                            variant='outline'
                            onPress={clearSession}
                        />
                    } />
                    <RokuTVItem
                        {...selectedDevice}
                        selected
                        showChevron={false}
                    />
                </View>
            )}

            <SectionHeader
            title='Dispositivos Roku'
            subtitle={(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {scanning && (
                        <ActivityIndicator
                            size='small'
                            color={withOpacityHex(colors.dark.base, 0.6)}
                            style={{ marginRight: 6 }}
                        />
                    )}
                    <Text style={{ fontSize: 13, color: withOpacityHex(colors.dark.base, 0.6) }}>
                        {scanning ? 'Buscando en tu red local…' : `${devices.length} encontrados`}
                    </Text>
                </View>
            )}
            actionButton={
                <SmallButton
                    color={colors.gradient[2]}
                    label='Escanear red'
                    iconName='wifi'
                    variant='filled'
                    onPress={scan}
                    disabled={scanning}
                />
            } />

            <FlatList
                contentContainerStyle={{
                    paddingBottom: bottom
                }}
                data={devices}
                keyExtractor={(item: RokuDeviceInfo) => item.ip}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: spacing.xs }}>
                        <RokuTVItem
                            {...item}
                            selected={selectedDevice?.ip === item.ip}
                            disabled={scanning}
                            onPress={setSelectedRoku}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    !scanning ? (
                        <View style={styles.empty}>
                            <IonIcon
                                name='tv-outline'
                                size={48}
                                color={withOpacityHex(colors.dark.base, 0.4)}
                            />
                            <Text style={styles.emptyTitle}>
                                No se encontró ningún Roku
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                Verifica que tu celular y tu TV estén en la misma red Wi-Fi
                            </Text>

                            <SmallButton
                                label='Volver a buscar'
                                iconName='refresh'
                                variant='outline'
                                onPress={scan}
                            />
                        </View>
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
    empty: {
        alignItems: 'center',
        marginTop: 96,
        paddingHorizontal: spacing.lg,
    },
    emptyTitle: {
        marginTop: spacing.sm,
        fontSize: 16,
        fontWeight: '600',
    },
    emptySubtitle: {
        marginVertical: spacing.sm,
        textAlign: 'center',
        color: withOpacityHex(colors.dark.base, 0.55),
    },
});
