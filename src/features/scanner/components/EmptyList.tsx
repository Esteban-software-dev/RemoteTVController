import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { IonIcon } from '@src/shared/components/IonIcon';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';

interface EmptyListProps {
    title?: string;
    subtitle?: string;
    iconName?: IoniconsIconName;
}

export function EmptyList({
    title,
    subtitle,
    iconName = 'apps-outline',
}: EmptyListProps) {
    const { t } = useTranslation();

    const resolvedTitle =
        title ?? t('emptyList.default.title');

    const resolvedSubtitle =
        subtitle ?? t('emptyList.default.subtitle');

    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <IonIcon
                    name={iconName}
                    size={26}
                    color={colors.accent.purple.base}
                />
            </View>

            <Text style={styles.title}>{resolvedTitle}</Text>
            <Text style={styles.subtitle}>{resolvedSubtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: withOpacityHex(colors.accent.purple.base, 0.14),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text.primary,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
        color: withOpacityHex(colors.text.primary, 0.6),
        maxWidth: 260,
    },
});
