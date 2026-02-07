import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IonIcon } from '@src/shared/components/IonIcon';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface LanguageOptionProps {
    label: string;
    subtitle?: string;
    selected?: boolean;
    onPress?: () => void;
}

export function LanguageOption({
    label,
    subtitle,
    selected = false,
    onPress,
}: LanguageOptionProps) {
    return (
        <Pressable
        onPress={onPress}
        style={({ pressed }) => ([
            styles.row,
            pressed ? styles.rowPressed : null,
            selected ? styles.rowSelected : null,
        ])}>
            <View style={[styles.checkOuter, selected ? styles.checkOuterActive : null]}>
                {selected ? (
                    <IonIcon name="checkmark" size={16} color={colors.accent.purple.base} />
                ) : null}
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.title}>{label}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.md,
    },
    rowPressed: {
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.2),
    },
    rowSelected: {
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.08),
    },
    checkOuter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.15),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white.base,
    },
    checkOuterActive: {
        borderColor: withOpacityHex(colors.accent.purple.base, 0.5),
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.08),
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
        color: withOpacityHex(colors.dark.base, 0.6),
    },
});
