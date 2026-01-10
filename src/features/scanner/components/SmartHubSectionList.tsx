import {
    SectionList,
    StyleSheet,
    View,
} from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';

import { AppItem } from '../components/AppItem';
import { spacing } from '@src/config/theme/tokens';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { SmartHubSectionType } from '../interfaces/section.types';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { getAppIcon, launchRokuApp } from '../services/roku-apps.service';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { fetchActiveRokuApp } from '../services/roku-device-info.service';
import { RokuApp } from '../interfaces/roku-app.interface';
import { useContextMenu } from '@src/shared/context/ContextMenu';

export const MemoAppItem = memo(AppItem);
interface SmartHubSectionListProps {
    sections: SmartHubSectionType[];
}
export function SmartHubSectionList({ sections }: SmartHubSectionListProps) {
    const { top, bottom } = useSafeBarsArea();
    const { open } = useContextMenu();
    const { selectedDevice, setActiveApp } = useRokuSessionStore();

    const formattedSections = useMemo(() => {
        return sections.map(section => ({
            ...section,
            data: section.data.reduce<any[]>((rows, item, index) => {
            if (index % 2 === 0) rows.push([item]);
                else rows[rows.length - 1].push(item);
                return rows;
            }, []),
        }));
    }, [sections]);

    const launchApp = async (appId: string) => {
        if (!selectedDevice?.ip) return;
        await launchRokuApp(selectedDevice.ip, appId);
        const activeApp = await fetchActiveRokuApp(selectedDevice.ip);
        if (activeApp) setActiveApp(activeApp);
    }

    const openAppContextMenu = (app: RokuApp) => {
        open({
            payload: app,
            renderTarget: () => (
                <AppItem
                    appId={app.id}
                    name={app.name}
                    iconUrl={
                        selectedDevice?.ip
                            ? getAppIcon(selectedDevice.ip, app.id)
                            : ''
                    }
                    selected={true}
                />
            ),
            actions: [
                {
                    key: 'highlight',
                    label: 'Destacar',
                    icon: 'star',
                    onPress: app => console.log('highlight', app),
                },
                {
                    key: 'pin',
                    label: 'Pinnear',
                    icon: 'pin',
                    onPress: app => console.log('pin', app),
                },
                {
                    key: 'hide',
                    label: 'Ocultar',
                    icon: 'eye-off',
                    destructive: true,
                    onPress: app => console.log('hide', app),
                },
            ],
        });
    }

    const renderItem = useCallback(
        ({ item }: {item: RokuApp[]}) => (
            <View style={styles.row}>
                {item.map((app: any) => (
                    <MemoAppItem
                        key={app.id}
                        appId={app.id}
                        name={app.name}
                        iconUrl={
                        selectedDevice?.ip
                            ? getAppIcon(selectedDevice.ip, app.id)
                            : ''
                        }
                        onPress={launchApp}
                        onLongPress={() => {
                            openAppContextMenu(app);
                        }}
                    />
                ))}
            </View>
        ),
        [selectedDevice?.ip]
    );

    return (
        <SectionList
            sections={formattedSections}
            keyExtractor={(item, index) => `row-${index}`}
            contentContainerStyle={{ paddingBottom: bottom }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            removeClippedSubviews
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={7}
            viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
            renderSectionHeader={({ section }) => {
                const isFirst = sections[0]?.type === section.type;
                return (
                    <SectionHeader
                        containerStyle={{
                            marginTop: isFirst ? top : 0,
                        }}
                        title={section.title ?? ''}
                        subtitle={section.subtitle}
                        iconName={section.iconName}
                        actionButton={section.actionButton}
                    />
                )
            }}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginBottom: spacing.sm
    },
});