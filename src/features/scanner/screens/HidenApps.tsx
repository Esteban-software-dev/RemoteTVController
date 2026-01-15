import { View } from 'react-native'
import React from 'react'
import { globalStyles } from '@src/config/theme/styles/global.styles'
import { AppBackground } from '@src/shared/components/AppBackground'
import { useAppBarPadding } from '@src/navigation/hooks/useAppbarPadding'

export function HidenApps() {
    const { appBarHeight } = useAppBarPadding();
    return (
        <View style={[globalStyles.container, globalStyles.horizontalAppPadding, {
            paddingTop: appBarHeight,
        }]}>
            <AppBackground />
        </View>
    )
}