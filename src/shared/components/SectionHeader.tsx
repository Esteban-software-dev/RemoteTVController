import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { SmallButton } from '@src/shared/components/SmallButton';
import { spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { IonIcon } from './IonIcon';

interface SectionHeaderProps {
    title: string;
    subtitle?: string | ReactNode;

    buttonLabel?: string;
    buttonVariant?: 'filled' | 'outline' | 'ghost';
    buttonColor?: string;
    onButtonPress?: () => void;
    actionButton?: ReactNode | null;

    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;

    iconName?: IoniconsIconName;
}

export function SectionHeader({
    title,
    subtitle,
    buttonLabel,
    buttonVariant = 'filled',
    buttonColor = colors.gradient[3],
    onButtonPress,
    actionButton,
    containerStyle,
    titleStyle,
    subtitleStyle,

    iconName
}: SectionHeaderProps) {
    return (
        <View style={[styles.header, containerStyle]}>
            <View style={styles.left}>
                {iconName && (
                    <View style={styles.iconWrap}>
                        <IonIcon name={iconName} size={18} color={colors.gradient[2]} />
                    </View>
                )}

                <View style={styles.textBlock}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>

                    {subtitle && (
                        typeof subtitle === 'string' ? (
                            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
                        ) : (
                            <View style={styles.subtitleRow}>{subtitle}</View>
                        )
                    )}
                </View>
            </View>

            {actionButton ? actionButton : (
                buttonLabel && onButtonPress && (
                    <SmallButton
                        label={buttonLabel}
                        variant={buttonVariant}
                        color={buttonColor}
                        onPress={onButtonPress}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: withOpacityHex(colors.dark.base, 0.08),
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: withOpacityHex(colors.gradient[2], 0.15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBlock: {
        flexShrink: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark.base,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: withOpacityHex(colors.dark.base, 0.55),
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
});
