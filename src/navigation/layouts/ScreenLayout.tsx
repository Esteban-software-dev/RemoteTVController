import React from 'react';
import Animated from 'react-native-reanimated';
import { useAppBarPadding } from '../hooks/useAppbarPadding';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { spacing } from '@src/config/theme/tokens';
import { View } from 'react-native';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
};

export function ScreenLayout({ children, scroll = true }: Props) {
    const { appBarHeight } = useAppBarPadding();
    const tabBarHeight =  useBottomTabBarHeight();

    if (!scroll) {
        return (
            <Animated.View style={{ flex: 1, }}>
                {children}
            </Animated.View>
        );
    }

    return (
        <Animated.ScrollView style={{
            flex: 1
        }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{height: appBarHeight}} />
            {children}
            <View style={{height: tabBarHeight + spacing.lg}} />
        </Animated.ScrollView>
    );
}
