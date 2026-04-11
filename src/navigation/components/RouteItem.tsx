import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { globalStyles } from '../../config/theme/styles/global.styles';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { androidRipple, iosPressOpacity } from '@src/shared/ui/pressFeedback';

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

    return (
        <Pressable
        disabled={focused}
        onPress={() => navigation.navigate(route.name)}
        android_ripple={androidRipple({ color: withOpacityHex(colors.accent.purple.base, 0.18) })}
        style={({ pressed }) => [
            styles.item,
            focused && styles.itemActive,
            focused ? null : iosPressOpacity(pressed, false),
            options.drawerItemStyle
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
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: spacing.sm + 3,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        overflow: 'hidden',

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
