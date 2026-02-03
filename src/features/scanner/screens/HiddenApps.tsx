import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { AppBackground } from '@src/shared/components/AppBackground';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { useAppBarPadding } from '@src/navigation/hooks/useAppbarPadding';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { ActionItem } from '../components/HiddenAppItem';
import { AppIcon } from '../components/AppIcon';

export function HiddenApps() {
    const { appBarHeight } = useAppBarPadding();

    const deviceId = useRokuSessionStore(s => s.selectedDevice?.deviceId);
    const config = useAppCustomizationStore(s => deviceId ? s.byDevice[deviceId] : null);
    const showApp = useAppCustomizationStore(s => s.showApp);

    return (
        <View
        style={[
            globalStyles.container,
            globalStyles.horizontalAppPadding,
        ]}>
            <AppBackground />
            <FlatList
                ListHeaderComponent={
                    <SectionHeader
                        title='Apps ocultas'
                        subtitle='Estas aplicaciones no aparecen en la vista principal'
                    />
                }
                data={config?.hidden ?? []}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                }}
                renderItem={({ item }) => (
                    <View style={styles.appItemWrapper}>
                        <ActionItem
                            id={item.id}
                            title={item.name}
                            subtitle="Hidden app"
                            icon={
                                <AppIcon
                                    appId={item.id}
                                    name={item.name}
                                    style={{ width: '90%', height: '90%', borderRadius: radius.sm }}
                                />
                            }
                            actionLabel="Restore"
                            onAction={() => showApp(deviceId ?? '', item.id)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>
                            No hidden apps
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Apps you hide will appear here.
                        </Text>
                    </View>
                }
                style={{ paddingTop: appBarHeight }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    appItemWrapper: {
        marginVertical: spacing.xs,
    },
    emptyState: {
        marginTop: spacing.xl,
        padding: spacing.lg,
        borderRadius: radius.md,
        backgroundColor: withOpacityHex(colors.dark.base, 0.04),
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.08),
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.dark.base,
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: withOpacityHex(colors.dark.base, 0.6),
        textAlign: 'center',
    },
});
