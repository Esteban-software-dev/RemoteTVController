import React from 'react';
import Animated from 'react-native-reanimated';
import { useAppBarPadding } from '../hooks/useAppbarPadding';

type Props = {
    children: React.ReactNode;
    scroll?: boolean;
};

export function ScreenLayout({ children, scroll = true }: Props) {
    const {paddingTop: height} = useAppBarPadding();

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
        }}
        scrollIndicatorInsets={{ top: height }}>
            {children}
        </Animated.ScrollView>
    );
}
