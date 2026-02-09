import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface SettingsItemProps {
    title: string;
    subtitle?: string;
    valueText?: string;
    iconName: IoniconsIconName;
    accentColor?: string;
    rightElement?: ReactNode;
    showChevron?: boolean;
    isLast?: boolean;
    onPress?: () => void;
}

export function SettingsItem({
    title,
    subtitle,
    valueText,
    iconName,
    accentColor = colors.accent.purple.base,
    rightElement,
    showChevron = true,
    isLast = false,
    onPress,
}: SettingsItemProps) {
    const iconBg = withOpacityHex(accentColor, 0.12);
    const iconBorder = withOpacityHex(accentColor, 0.3);

    return (
        <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => ([
            styles.row,
            !isLast && styles.rowDivider,
            pressed && onPress ? styles.rowPressed : null,
        ])}>
            <View style={[styles.iconWrap, { backgroundColor: iconBg, borderColor: iconBorder }]}>
                <IonIcon name={iconName} size={18} color={accentColor} />
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? (
                    <Text style={styles.subtitle}>{subtitle}</Text>
                ) : null}
            </View>

            <View style={styles.rightBlock}>
                {valueText ? (
                    <Text style={styles.valueText}>{valueText}</Text>
                ) : null}
                {rightElement ? rightElement : (showChevron ? (
                    <IonIcon name="chevron-forward" size={18} color={withOpacityHex(colors.dark.base, 0.5)} />
                ) : null)}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        borderRadius: radius.md,
    },
    rowPressed: {
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.2),
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: withOpacityHex(colors.dark.base, 0.08),
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontSize: typography.size.md,
        fontFamily: typography.fontFamily.semibold,
        color: colors.dark.base,
    },
    subtitle: {
        marginTop: 2,
        fontSize: typography.size.sm,
        color: withOpacityHex(colors.dark.base, 0.55),
    },
    rightBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    valueText: {
        fontSize: typography.size.sm,
        color: withOpacityHex(colors.dark.base, 0.6),
    },
});
