import {
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { radius, spacing } from '@src/config/theme/tokens';
import { AppBackground } from '@src/shared/components/AppBackground';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { useAppBarPadding } from '@src/navigation/hooks/useAppbarPadding';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { useAppCustomizationStore } from '@src/store/roku/app-customization.store';
import { ActionItem } from '../components/HiddenAppItem';
import { AppIcon } from '../components/AppIcon';
import { useMemo, useState } from 'react';
import { CollapsibleSearchBar } from '@src/shared/components/CollapsibleSearchBar';
import { EmptyList } from '../components/EmptyList';
import { useTranslation } from 'react-i18next';
import { useToast } from '@src/shared/context/ToastContext';
import { getAppIconCached } from '../services/roku-apps.service';

export function HiddenApps() {
    const { appBarHeight } = useAppBarPadding();
    const { t } = useTranslation();
    const { show: showToast } = useToast();

    const deviceId = useRokuSessionStore(s => s.selectedDevice?.deviceId);
    const deviceIp = useRokuSessionStore(s => s.selectedDevice?.ip);
    const config = useAppCustomizationStore(s => deviceId ? s.byDevice[deviceId] : null);
    const showApp = useAppCustomizationStore(s => s.showApp);
    const hideApp = useAppCustomizationStore(s => s.hideApp);

    const [query, setQuery] = useState<string>('');

    const filteredHidden = useMemo(() => {
        const list = config?.hidden ?? [];
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter(item => item.name.toLowerCase().includes(q));
    }, [config?.hidden, query]);

    return (
        <View
        style={[
            globalStyles.container,
            globalStyles.horizontalAppPadding,
        ]}>
            <AppBackground />
            <FlatList
                contentContainerStyle={{
                    paddingTop: appBarHeight,
                    paddingBottom: spacing.md,
                }}
                ListHeaderComponent={
                    <View style={{ marginBottom: spacing.md }}>
                        <SectionHeader
                            title={t('hiddenApps.header.title')}
                            subtitle={t('hiddenApps.header.subtitle')}
                        />
                        <CollapsibleSearchBar
                            value={query}
                            onChange={setQuery}
                            placeholder={t('hiddenApps.search.placeholder')}
                            collapsible
                        />
                    </View>
                }
                data={filteredHidden}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.appItemWrapper}>
                        <ActionItem
                            id={item.id}
                            title={`${index + 1}. ${item.name}`}
                            subtitle={t('hiddenApps.list.itemSubtitle')}
                            icon={
                                <AppIcon
                                    appId={item.id}
                                    name={item.name}
                                    style={{ width: '90%', height: '90%', borderRadius: radius.sm }}
                                />
                            }
                            actionLabel={t('hiddenApps.list.restoreAction')}
                            onAction={() => {
                                const appIcon = getAppIconCached(deviceId ?? '', item.id, deviceIp);
                                showApp(deviceId ?? '', item.id);
                                showToast({
                                    type: 'medium',
                                    title: t(`smartHub.context.toast.hidden.removed.title`),
                                    subtitle: t(`smartHub.context.toast.hidden.removed.subtitle`, {
                                        app: item.name,
                                    }),
                                    iconSource: appIcon ? { uri: appIcon } : undefined,
                                    showCloseButton: false,
                                    actionButton: [
                                        {
                                            iconName: 'arrow-undo',
                                            onPress: (closeToast) => {
                                                hideApp(deviceId ?? '', item);
                                                closeToast();
                                                showToast({
                                                    type: 'dark',
                                                    title: t(`smartHub.context.toast.hidden.added.title`),
                                                    subtitle: t(`smartHub.context.toast.hidden.added.subtitle`, {
                                                        app: item.name,
                                                    }),
                                                    iconSource: appIcon ? { uri: appIcon } : undefined,
                                                });
                                            }
                                        }
                                    ]
                                });
                            }}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={globalStyles.emptyContainer}>
                        <EmptyList
                            title={t('hiddenApps.empty.title')}
                            subtitle={t('hiddenApps.empty.description')}
                        />
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    appItemWrapper: {
        marginVertical: spacing.xs,
    },
});
