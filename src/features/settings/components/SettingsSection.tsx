import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionHeader } from '@src/shared/components/SectionHeader';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { globalStyles } from '@src/config/theme/styles/global.styles';

interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    iconName?: IoniconsIconName;
    children: ReactNode;
}

export function SettingsSection({
    title,
    subtitle,
    iconName,
    children,
}: SettingsSectionProps) {
    return (
        <View style={styles.section}>
            <SectionHeader
                title={title}
                subtitle={subtitle}
                iconName={iconName}
                containerStyle={styles.header}
            />

            <View style={styles.card}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: spacing.lg,
    },
    header: {
        marginBottom: spacing.sm,
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    card: {
        backgroundColor: colors.bone.base,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.2),
        overflow: 'hidden',

        ... globalStyles.shadow
    },
});
