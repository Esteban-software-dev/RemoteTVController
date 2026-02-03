import { memo, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { launchRokuApp } from '../../services/roku-apps.service';
import { RokuApp } from '../../interfaces/roku-app.interface';
import { useRokuAppMenu } from '../../hooks/useRokuAppMenu';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { AppItem } from '../AppItem';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { fetchActiveRokuApp } from '../../services/roku-device-info.service';
import { ActiveApp } from '../../interfaces/active-app.interface';
import { EmptyVerticalList } from '../EmptyList';

interface HorizontalAppsRowProps {
    apps: RokuApp[];
    deviceIp: string;
}
export const HorizontalAppsRow = memo(({ apps, deviceIp }: HorizontalAppsRowProps) => {
    const { selectedDevice, setActiveApp } = useRokuSessionStore();
    const { openMenu } = useRokuAppMenu();

    const onAppPress = async (deviceIp: string, appId: string) => {
        await launchRokuApp(deviceIp, appId)
        const launchedApp = await fetchActiveRokuApp(deviceIp);
        setActiveApp(launchedApp ?? {} as ActiveApp);
    }

    const renderItem = useCallback(
        ({ item }: { item: RokuApp }) => (
            <View>
                <AppItem
                    name={item.name}
                    appId={item.id}
                    onPress={() => onAppPress(deviceIp, item.id)}
                    onLongPress={() => openMenu(item)}
                    onMenuPress={() => openMenu(item)}
                />
            </View>
        ),
        [deviceIp, selectedDevice]
    );

    if (!apps.length) {
        return (
            <View style={styles.emptyContainer}>
                <EmptyVerticalList />
            </View>
        );
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
        borderRadius: radius.lg,
        backgroundColor: colors.dark.surface,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.accent.purple.base, 0.25),
        padding: spacing.lg,
    },
});

