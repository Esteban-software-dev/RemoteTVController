import {
    SectionList,
    StyleSheet,
    View,
} from 'react-native';
import React, { useMemo } from 'react';

import { AppItem } from '../components/AppItem';
import { spacing } from '@src/config/theme/tokens';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { SmartHubSectionType } from '../interfaces/section.types';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { getAppIcon, launchRokuApp } from '../services/roku-apps.service';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';

interface SmartHubSectionListProps {
    sections: SmartHubSectionType[];
}
export function SmartHubSectionList({ sections }: SmartHubSectionListProps) {
    const { top, bottom } = useSafeBarsArea();
    const { selectedDevice } = useRokuSessionStore();

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

    return (
        <SectionList
            sections={formattedSections}
            keyExtractor={(item, index) => `row-${index}`}
            contentContainerStyle={{ paddingBottom: bottom }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
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
            renderItem={({ item }) => (
                <View style={styles.row}>
                    {item.map((app: any) => (
                        <AppItem
                            key={app.id}
                            appId={app.id}
                            name={app.name}
                            iconUrl={
                            selectedDevice?.ip
                                ? getAppIcon(selectedDevice.ip, app.id)
                                : ''
                            }
                            onPress={() => {
                                if (!selectedDevice?.ip) return;
                                launchRokuApp(selectedDevice.ip, app.id);
                            }}
                        />
                    ))}
                </View>
            )}
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