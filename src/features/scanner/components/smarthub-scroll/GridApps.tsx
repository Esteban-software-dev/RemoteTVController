import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RokuApp } from '../../interfaces/roku-app.interface';
import { AppItem } from '../AppItem';
import { launchRokuApp } from '../../services/roku-apps.service';
import { radius, spacing } from '@src/config/theme/tokens';
import { useRokuAppMenu } from '../../hooks/useRokuAppMenu';
import { colors } from '@src/config/theme/colors/colors';
import { fetchActiveRokuApp } from '../../services/roku-device-info.service';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { ActiveApp } from '../../interfaces/active-app.interface';
import { EmptyList } from '../EmptyList';
import { t } from 'i18next';

interface GridAppsProps {
    apps: RokuApp[];
    deviceId: string;
    deviceIp: string;
}

export const GridApps = memo(({ apps, deviceId, deviceIp }: GridAppsProps) => {
    const setActiveApp = useRokuSessionStore(s => s.setActiveApp);
    const { openMenu } = useRokuAppMenu();

    const onAppPress = useCallback(async (appId: string) => {
        await launchRokuApp(deviceIp, appId);
        const launchedApp = await fetchActiveRokuApp(deviceIp);
        setActiveApp(launchedApp ?? {} as ActiveApp);
    }, [deviceIp, setActiveApp]);

    const renderItem = useCallback(
        ({ item }: { item: RokuApp }) => (
            <AppItem
                name={item.name}
                appId={item.id}
                deviceId={deviceId}
                deviceIp={deviceIp}
                appType={item.type}
                version={item.version}
                isLaunchable={item.isLaunchable}
                isSystem={item.isSystem}
                compact
                onPress={() => onAppPress(item.id)}
                onLongPress={() => openMenu(item)}
                onMenuPress={() => openMenu(item)}
            />
        ),
        [deviceId, deviceIp, onAppPress, openMenu]
    );

    return (
        <FlatList
            data={apps}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
            style={styles.container}

            ListEmptyComponent={
                <View style={{ paddingVertical: spacing.lg }}>
                    <EmptyList
                        title={t('smartHub.emptyGrid.title')}
                        subtitle={t('smartHub.emptyGrid.subtitle')}
                    />
                </View>
            }
        />
    );
});

const styles = StyleSheet.create({
    container: {
        padding: spacing.sm,
        borderRadius: radius.lg,
        backgroundColor: colors.dark.surface,
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        gap: spacing.sm
    },
});
