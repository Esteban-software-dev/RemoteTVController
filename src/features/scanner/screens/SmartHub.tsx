import { FlatList, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { RokuApp } from '../interfaces/roku-app.interface';
import { AppItem } from '../components/AppItem';
import { spacing } from '@src/config/theme/tokens';

export function SmartHub() {
    const { bottom, top } = useSafeBarsArea();
    const { apps } = useRokuSessionStore();

    useEffect(() => {
        console.log({apps})
    }, [apps]);

    return (
        <FlatList
            style={[globalStyles.container, globalStyles.horizontalAppPadding]}
            data={apps}
            numColumns={2}
            keyExtractor={(app: RokuApp) => app.id}
            renderItem={({ item, index }) => (
                <AppItem
                    onPress={console.log}
                    appId={item.id}
                    name={item.name}
                    index={index} />
            )}
            contentContainerStyle={[{ paddingTop: top, paddingBottom: bottom, gap: spacing.sm }]}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        gap: spacing.sm
    },
})