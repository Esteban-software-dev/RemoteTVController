import React, { memo, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { SmartHubSectionType } from '../interfaces/section.types';
import { HorizontalAppsRow } from './smarthub-scroll/HorizontalAppRow';
import { GridApps } from './smarthub-scroll/GridApps';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { spacing } from '@src/config/theme/tokens';
import { t } from 'i18next';

interface SmartHubSectionListProps {
    sections: SmartHubSectionType[];
    deviceId: string;
    deviceIp: string;
}

type RenderSection = Omit<SmartHubSectionType, 'data'> & {
    data: [];
    apps: SmartHubSectionType['data'];
    itemCount: number;
};

export const SmartHubSectionList = memo(({ sections, deviceId, deviceIp }: SmartHubSectionListProps) => {
    const { top, bottom } = useSafeBarsArea();

    const sectionListData = useMemo(
        () =>
        sections.map(section => ({
            ...section,
            data: [],
            apps: section.data,
            itemCount: section.data.length,
        })),
        [sections]
    );

    const renderSectionFooter = useCallback(
        ({ section }: { section: RenderSection }) => {
            if (section.itemCount === 0) {
                return null;
            }

            if (section.type === 'favorites') {
                return (
                    <HorizontalAppsRow
                        apps={section.apps}
                        deviceId={deviceId}
                        deviceIp={deviceIp}
                    />
                );
            }

            if (section.type === 'apps') {
                return (
                    <GridApps
                        apps={section.apps}
                        deviceId={deviceId}
                        deviceIp={deviceIp}
                    />
                );
            }
            return null;
        },
        [deviceId, deviceIp]
    );

    return (
        <SectionList
            sections={sectionListData as RenderSection[]}
            keyExtractor={(_, index) => String(index)}
            renderSectionFooter={renderSectionFooter}
            renderSectionHeader={({ section }) => (
                <SectionHeader
                    containerStyle={{marginTop: spacing.md}}
                    title={section.title ?? 'Apps'}
                    subtitle={
                        section.type === 'favorites'
                            ? t('smartHub.sections.favorites.count', {
                                count: section.itemCount,
                            })
                            : section.subtitle
                    }

                    iconName={section.iconName}
                />
            )}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, { marginTop: top, paddingBottom: bottom + spacing.xxl + spacing.lg }]}
            removeClippedSubviews
        />
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: 32,
    },
});
