import React from 'react';
import Animated from 'react-native-reanimated';
import { useAppBarPadding } from '../hooks/useAppbarPadding';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { spacing } from '@src/config/theme/tokens';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
};

export function ScreenLayout({ children, scroll = true }: Props) {
    const {paddingTop: height} = useAppBarPadding();
    const tabBarHeight =  useBottomTabBarHeight();

    if (!scroll) {
        return (
            <Animated.View style={{ flex: 1, paddingTop: height }}>
                {children}
            </Animated.View>
        );
    }

    return (
        <Animated.ScrollView
        contentContainerStyle={{
            paddingTop: height,
            paddingBottom: tabBarHeight + spacing.sm
        }}
        scrollIndicatorInsets={{ top: height }}>
            {children}
        </Animated.ScrollView>
    );
}
