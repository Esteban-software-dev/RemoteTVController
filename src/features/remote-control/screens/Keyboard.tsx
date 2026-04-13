import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { AppBackground } from '@src/shared/components/AppBackground';
import { View, Text } from 'react-native';
import React from 'react';

export function Keyboard() {
    const { top } = useSafeBarsArea();
    return (
        <View style={[globalStyles.container, { paddingTop: top}]}>
            <AppBackground />
            <Text>Keyboard</Text>
        </View>
    )
}