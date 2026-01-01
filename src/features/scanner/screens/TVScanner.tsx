import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IonIcon } from '@src/shared/components/IonIcon';
import { useRokuScanner } from '../hooks/useRokuScanner';
import { GradientCard } from '@src/shared/components/GradientCard';
import { useEffect } from 'react';

export function TVScanner() {
    const { devices, scanning, scan } = useRokuScanner();

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
                    <Pressable
                    disabled={scanning}
                    onPress={scan}
                    style={({pressed}) => ({
                        backgroundColor: colors.white.base,
                        borderRadius: radius.sm,
                        height: 30,
                        width: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: withOpacityHex(colors.dark.base, .8),
                        transform: [{scale: pressed ? .95 : 1}]
                    })}>
                        <IonIcon color={colors.dark.base} size={15} name={'refresh'} />
                    </Pressable>
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
                <Animated.View
                key={device.ip}
                entering={FadeInUp.delay(index * 40)}
                style={styles.cardWrapper}>
                    <GradientCard>
                        <Pressable
                        style={({ pressed }) => [
                            styles.card,
                            pressed && { transform: [{ scale: 0.98 }] },
                        ]}>
                            <View style={styles.icon}>
                                <IonIcon name="tv" size={18} />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.name}>{device.friendlyDeviceName}</Text>
                                <Text style={styles.ip}>{device.ip}</Text>
                            </View>

                            <IonIcon
                                name="chevron-forward"
                                size={18}
                                color={withOpacityHex(colors.dark.base, .4)}
                            />
                        </Pressable>
                    </GradientCard>
                </Animated.View>
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