import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { globalStyles } from '../../config/theme/styles/global.styles';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RouteItemProps {
    focused: boolean;
    options: DrawerNavigationOptions;
    navigation: DrawerContentComponentProps['navigation'];
    route: NavigationRoute<ParamListBase, string>;
}

export function RouteItem({
    focused,
    options,
    navigation,
    route
}: RouteItemProps) {

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <AnimatedPressable
        disabled={focused}
        onPress={() => navigation.navigate(route.name)}
        onPressIn={() => scale.value = withSpring(0.97)}
        onPressOut={() => scale.value = withSpring(1)}
        style={[
            styles.item,
            focused && styles.itemActive,
            animatedStyle
        ]}>
            {focused && <View style={styles.activeIndicator} />}

            {options.drawerIcon?.({
                focused,
                color: focused 
                    ? colors.accent.purple.base 
                    : colors.accent.gray.icon,
                size: 14
            })}

            <Text
            style={[
                styles.text,
                focused && styles.textActive
            ]}>
                {options.title ?? route.name}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: spacing.sm + 3,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,

        backgroundColor: colors.bone.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.borderStrong, .1),

        gap: spacing.sm,

        ...globalStyles.shadow
    },

    itemActive: {
        backgroundColor: colors.bone.base,
        borderColor: withOpacityHex(colors.accent.purple.strong, .25),
    },

    activeIndicator: {
        width: 4,
        height: '70%',
        borderRadius: radius.xs,
        backgroundColor: colors.accent.purple.base,
        marginRight: spacing.xs,
    },

    text: {
        fontSize: typography.size.sm,
        fontWeight: '600',
        color: colors.accent.gray.icon,
        letterSpacing: 0.3,
    },

    textActive: {
        color: colors.accent.purple.dark,
    },
});
