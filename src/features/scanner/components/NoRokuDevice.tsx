import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { IonIcon } from '@src/shared/components/IonIcon'
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor'
import { colors } from '@src/config/theme/colors/colors'
import { spacing } from '@src/config/theme/tokens'
import { SmallButton, SmallButtonProps } from '@src/shared/components/SmallButton'
import { IoniconsIconName } from '@react-native-vector-icons/ionicons'

interface NoRokuDeviceProps {
    title: string;
    subtitle: string;
    iconName?: IoniconsIconName;
    actionButton: SmallButtonProps;
}
export function NoRokuDevice({
    title,
    subtitle,
    actionButton,
    iconName
}: NoRokuDeviceProps) {
    return (
        <View style={styles.empty}>
            <IonIcon
                name={iconName ?? 'tv-outline'}
                size={48}
                color={withOpacityHex(colors.dark.base, 0.4)}
            />
            <Text style={styles.emptyTitle}>
                {title}
            </Text>
            <Text style={styles.emptySubtitle}>
                {subtitle}
            </Text>

            <SmallButton {... actionButton} />
        </View>
    )
}

const styles = StyleSheet.create({
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        flex: 1,
    },
    emptyTitle: {
        marginTop: spacing.sm,
        fontSize: 16,
        fontWeight: '600',
    },
    emptySubtitle: {
        marginVertical: spacing.sm,
        textAlign: 'center',
        color: withOpacityHex(colors.dark.base, 0.55),
    },
});