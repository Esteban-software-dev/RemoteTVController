import { View, Text } from 'react-native'
import React from 'react'
import { AppBackground } from '@src/shared/components/AppBackground'
import { globalStyles } from '@src/config/theme/styles/global.styles'

export default function ThemeConfiguration() {
    return (
        <View style={globalStyles.container}>
            <AppBackground />
            <Text>ThemeConfiguration</Text>
        </View>
    )
}