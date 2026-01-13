import React, { memo, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { SmartHubSectionType } from '../interfaces/section.types';
import { HorizontalAppsRow } from './smarthub-scroll/HorizontalAppRow';
import { GridApps } from './smarthub-scroll/GridApps';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { spacing } from '@src/config/theme/tokens';
import { RokuApp } from '../interfaces/roku-app.interface';

interface SmartHubSectionListProps {
    sections: SmartHubSectionType[];
}

export const SmartHubSectionList = memo(({ sections }: SmartHubSectionListProps) => {
    const { top, bottom } = useSafeBarsArea();
    const selectedDevice = useRokuSessionStore(s => s.selectedDevice);

    const sectionListData = useMemo(
        () =>
        sections.map(section => ({
            ...section,
            data: [section.data],
        })),
        [sections]
    );

    const renderItem = useCallback(
        ({ item, section }: {item: RokuApp[], section: any}) => {
            if (section.type === 'favorites') {
                return (
                    <HorizontalAppsRow
                        apps={item}
                        deviceIp={selectedDevice?.ip ?? ''}
                    />
                );
            }

            if (section.type === 'apps') {
                return (
                    <GridApps
                        apps={item}
                        deviceIp={selectedDevice?.ip ?? ''}
                    />
                );
            }
            return null;
        },
        [selectedDevice?.ip]
    );

    return (
        <SectionList
            sections={sectionListData}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            renderSectionHeader={({ section }) => (
                <SectionHeader
                    containerStyle={{marginTop: spacing.md}}
                    title={section.title ?? 'Apps'}
                    subtitle={
                        section.type === 'favorites'
                            ? `${section.data[0].length} app${section.data[0].length === 1 ? '' : 's'} favorita${section.data[0].length === 1 ? '' : 's'}`
                            : section.subtitle
                    }
                    iconName={section.iconName}
                />
            )}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, { marginTop: top, paddingBottom: bottom }]}
            removeClippedSubviews
        />
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: 32,
    },
});
