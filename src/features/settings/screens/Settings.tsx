import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { AppBackground } from '@src/shared/components/AppBackground';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';
import { colors } from '@src/config/theme/colors/colors';
import { spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { useSafeBarsArea } from '@src/navigation/hooks/useSafeBarsArea';
import { useTranslation } from 'react-i18next';

export function Settings() {
    const { t } = useTranslation();
    const { top, bottom } = useSafeBarsArea();

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundsEnabled, setSoundsEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(false);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    const switchColors = useMemo(() => ({
        true: withOpacityHex(colors.accent.purple.base, 0.35),
        false: withOpacityHex(colors.dark.base, 0.1),
    }), []);

    return (
        <View style={globalStyles.container}>
            <AppBackground />

            <ScrollView
            contentContainerStyle={[
                styles.content,
                { paddingTop: top, paddingBottom: bottom },
            ]}
            showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{t('settings.title')}</Text>
                <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>

                <SettingsSection
                title={t('settings.sections.account.title')}
                subtitle={t('settings.sections.account.subtitle')}
                iconName="person-circle-outline">
                    <SettingsItem
                        title={t('settings.account.profile.title')}
                        subtitle={t('settings.account.profile.subtitle')}
                        iconName="person-outline"
                        accentColor={colors.accent.purple.base}
                    />
                    <SettingsItem
                        title={t('settings.account.language.title')}
                        subtitle={t('settings.account.language.subtitle')}
                        valueText={t('settings.account.language.value')}
                        iconName="globe-outline"
                        accentColor={colors.accent.teal.base}
                    />
                    <SettingsItem
                        title={t('settings.account.privacy.title')}
                        subtitle={t('settings.account.privacy.subtitle')}
                        iconName="shield-checkmark-outline"
                        accentColor={colors.accent.pink.base}
                        isLast
                    />
                </SettingsSection>

                <SettingsSection
                title={t('settings.sections.device.title')}
                subtitle={t('settings.sections.device.subtitle')}
                iconName="tv-outline">
                    <SettingsItem
                        title={t('settings.device.connected.title')}
                        subtitle={t('settings.device.connected.subtitle')}
                        valueText={t('settings.device.connected.value')}
                        iconName="wifi-outline"
                        accentColor={colors.accent.teal.base}
                    />
                    <SettingsItem
                        title={t('settings.device.scan.title')}
                        subtitle={t('settings.device.scan.subtitle')}
                        iconName="search-outline"
                        accentColor={colors.accent.purple.base}
                    />
                    <SettingsItem
                        title={t('settings.device.hiddenApps.title')}
                        subtitle={t('settings.device.hiddenApps.subtitle')}
                        iconName="eye-off-outline"
                        accentColor={colors.accent.gray.icon}
                        isLast
                    />
                </SettingsSection>

                <SettingsSection
                title={t('settings.sections.preferences.title')}
                subtitle={t('settings.sections.preferences.subtitle')}
                iconName="options-outline">
                    <SettingsItem
                        title={t('settings.preferences.notifications.title')}
                        subtitle={t('settings.preferences.notifications.subtitle')}
                        iconName="notifications-outline"
                        accentColor={colors.accent.purple.base}
                        rightElement={(
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={switchColors}
                                thumbColor={colors.white.base}
                            />
                        )}
                        showChevron={false}
                        onPress={() => setNotificationsEnabled(v => !v)}
                    />
                    <SettingsItem
                        title={t('settings.preferences.sounds.title')}
                        subtitle={t('settings.preferences.sounds.subtitle')}
                        iconName="volume-high-outline"
                        accentColor={colors.accent.teal.base}
                        rightElement={(
                            <Switch
                                value={soundsEnabled}
                                onValueChange={setSoundsEnabled}
                                trackColor={switchColors}
                                thumbColor={colors.white.base}
                            />
                        )}
                        showChevron={false}
                        onPress={() => setSoundsEnabled(v => !v)}
                    />
                    <SettingsItem
                        title={t('settings.preferences.haptics.title')}
                        subtitle={t('settings.preferences.haptics.subtitle')}
                        iconName="hardware-chip-outline"
                        accentColor={colors.accent.pink.base}
                        rightElement={(
                            <Switch
                                value={hapticsEnabled}
                                onValueChange={setHapticsEnabled}
                                trackColor={switchColors}
                                thumbColor={colors.white.base}
                            />
                        )}
                        showChevron={false}
                        onPress={() => setHapticsEnabled(v => !v)}
                        isLast
                    />
                </SettingsSection>

                <SettingsSection
                title={t('settings.sections.appearance.title')}
                subtitle={t('settings.sections.appearance.subtitle')}
                iconName="color-palette-outline">
                    <SettingsItem
                        title={t('settings.appearance.theme.title')}
                        subtitle={t('settings.appearance.theme.subtitle')}
                        valueText={t('settings.appearance.theme.value')}
                        iconName="color-palette-outline"
                        accentColor={colors.accent.purple.base}
                    />
                    <SettingsItem
                        title={t('settings.appearance.animations.title')}
                        subtitle={t('settings.appearance.animations.subtitle')}
                        iconName="sparkles-outline"
                        accentColor={colors.accent.teal.base}
                        rightElement={(
                            <Switch
                                value={animationsEnabled}
                                onValueChange={setAnimationsEnabled}
                                trackColor={switchColors}
                                thumbColor={colors.white.base}
                            />
                        )}
                        showChevron={false}
                        onPress={() => setAnimationsEnabled(v => !v)}
                        isLast
                    />
                </SettingsSection>

                <SettingsSection
                title={t('settings.sections.about.title')}
                subtitle={t('settings.sections.about.subtitle')}
                iconName="information-circle-outline">
                    <SettingsItem
                        title={t('settings.about.help.title')}
                        subtitle={t('settings.about.help.subtitle')}
                        iconName="help-circle-outline"
                        accentColor={colors.accent.teal.base}
                    />
                    <SettingsItem
                        title={t('settings.about.rate.title')}
                        subtitle={t('settings.about.rate.subtitle')}
                        iconName="star-outline"
                        accentColor={colors.accent.purple.base}
                    />
                    <SettingsItem
                        title={t('settings.about.version.title')}
                        subtitle={t('settings.about.version.subtitle')}
                        valueText={t('settings.about.version.value')}
                        iconName="information-circle-outline"
                        accentColor={colors.accent.gray.icon}
                        showChevron={false}
                        isLast
                    />
                </SettingsSection>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: spacing.sm,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.dark.base,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 14,
        color: withOpacityHex(colors.dark.base, 0.75),
        marginBottom: spacing.lg,
    },
})
