import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { useRokuScanner } from '../hooks/useRokuScanner';
import { useEffect } from 'react';
import { SmallButton } from '@src/shared/components/SmallButton';
import { TVDeviceItem } from '../components/RokuTVItem';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';

export function TVScanner() {
    const { devices, scanning, scan } = useRokuScanner();
    const setRokuDevice = useRokuSessionStore(s => s.selectDevice);

    useEffect(() => {
        scan();
    }, []);

    return (
        <ScrollView
        contentContainerStyle={[globalStyles.container, {padding: spacing.sm}]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Dispositivos Roku</Text>
                    <Text style={styles.subtitle}>
                    {scanning
                        ? 'Buscando en tu red local…'
                        : `${devices.length} encontrados`}
                    </Text>
                </View>
                <View style={{
                    justifyContent: 'center',
                }}>
                    <SmallButton color={colors.accent.purple.base} label='Refrescar' iconName='refresh' variant='filled' onPress={scan} disabled={scanning} />
                </View>
            </View>

            {/* Empty state */}
            {!scanning && devices.length === 0 && (
                <View style={styles.empty}>
                    <IonIcon name="tv-outline" size={42} color={withOpacityHex(colors.dark.base, .4)} />
                    <Text style={styles.emptyText}>
                        No se encontró ningún Roku
                    </Text>
                </View>
            )}

            {/* List */}
            {devices.map((device, index) => (
                <TVDeviceItem
                    key={device.ip}
                    index={index}
                    {...device}
                    onPress={(d) => setRokuDevice(d)}
                />
            ))}
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    header: {
        marginBottom: spacing.md,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: withOpacityHex(colors.dark.base, .6),
    },
    cardWrapper: {
        marginBottom: spacing.sm,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    icon: {
        width: 36,
        height: 36,
        borderRadius: radius.sm,
        backgroundColor: withOpacityHex('#E5E5E5', .5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
    },
    ip: {
        fontSize: 12,
        marginTop: 2,
        color: withOpacityHex(colors.dark.base, .55),
    },
    empty: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        marginTop: spacing.sm,
        color: withOpacityHex(colors.dark.base, .5),
    },
});