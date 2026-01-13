import { memo, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getAppIconCached, launchRokuApp } from '../../services/roku-apps.service';
import { RokuApp } from '../../interfaces/roku-app.interface';
import { useRokuAppMenu } from '../../hooks/useRokuAppMenu';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { AppItem } from '../AppItem';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface HorizontalAppsRowProps {
    apps: RokuApp[];
    deviceIp: string;
}
export const HorizontalAppsRow = memo(({ apps, deviceIp }: HorizontalAppsRowProps) => {
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);
    const { openMenu } = useRokuAppMenu();

    const renderItem = useCallback(
        ({ item }: { item: RokuApp }) => (
            <View>
                <AppItem
                    name={item.name}
                    appId={item.id}
                    iconUrl={getAppIconCached(
                        selectedDevice?.deviceId ?? '',
                        item.id,
                        selectedDevice?.ip
                    )}
                    onPress={() => launchRokuApp(deviceIp, item.id)}
                    onLongPress={() => openMenu(item)}
                    onMenuPress={() => openMenu(item)}
                />
            </View>
        ),
        [deviceIp, selectedDevice]
    );

    if (!apps.length) {
        return <EmptyAppsRow />;
    }

    return (
        <FlatList
            data={apps}
            horizontal
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.content}
            style={styles.list}
            getItemLayout={(_, index) => ({
                length: 110 + spacing.sm,
                offset: (110 + spacing.sm) * index,
                index,
            })}
        />

    );
});

function EmptyAppsRow() {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <IonIcon name='apps-outline' size={28} color={colors.accent.purple.base} />
            </View>

            <Text style={styles.emptyTitle}>Sin apps favoritas</Text>
            <Text style={styles.emptySubtitle}>
                Agrega tus apps más usadas para acceder a ellas mas rápido
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        height: 170,
        borderRadius: radius.lg,
        backgroundColor: colors.dark.surface,
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    content: {
        height: 170,
        gap: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
    },
    emptyContainer: {
        height: 170,
        borderRadius: radius.lg,
        backgroundColor: colors.dark.surface,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.25),
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    emptyIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.15),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text.primary,
    },
    emptySubtitle: {
        fontSize: 12,
        color: withOpacityHex(colors.text.primary, 0.6),
        textAlign: 'center',
        marginTop: 4,
        maxWidth: 220,
    },
});

