import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { RokuApp } from '../../interfaces/roku-app.interface';
import { AppItem } from '../AppItem';
import { getAppIconCached, launchRokuApp } from '../../services/roku-apps.service';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { spacing } from '@src/config/theme/tokens';
import { useRokuAppMenu } from '../../hooks/useRokuAppMenu';

interface GridAppsProps {
    apps: RokuApp[];
    deviceIp: string;
}

export const GridApps = memo(({ apps, deviceIp }: GridAppsProps) => {
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);
    const { openMenu } = useRokuAppMenu();

    const renderItem = useCallback(
        ({ item }: { item: RokuApp }) => (
            <AppItem
                name={item.name}
                appId={item.id}
                iconUrl={getAppIconCached(selectedDevice?.deviceId ?? '', item.id, selectedDevice?.ip)}
                onPress={() => launchRokuApp(deviceIp, item.id)}
                onLongPress={() => openMenu(item)}
                onMenuPress={() => openMenu(item)}
            />
        ),
        [deviceIp]
    );

    return (
        <FlatList
            data={apps}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}

            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews
        />
    );
});

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        gap: spacing.sm
    },
});
