import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    useAnimatedReaction,
    interpolate,
} from 'react-native-reanimated';
import {
    DrawerContentComponentProps,
    useDrawerProgress,
} from '@react-navigation/drawer';
import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing, typography } from '@src/config/theme/tokens';
import { BlurBackground } from '@src/shared/components/BlurBackground';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { getDisplayName, getModelInfo, getNetwork } from '../helpers/roku-information.helper';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { globalStyles } from '../../config/theme/styles/global.styles';
import { RouteItem } from './RouteItem';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SideMenu({ navigation, state, descriptors }: DrawerContentComponentProps) {
    const { selectedDevice } = useRokuSessionStore();
    const progress = useDrawerProgress();
    const blurOpacity = useSharedValue(0);

    useAnimatedReaction(
        () => progress.value,
        (value, prev) => {
            if (value > 0 && (prev &&prev < 1)) {
                if (value === 1)  blurOpacity.value = withTiming(1, { duration: 500 });
            }
            if ((value < 1) && (prev && prev > 0)) {
                blurOpacity.value = withTiming(0, { duration: 50 });
            }
        }
    );

    const blurStyle = useAnimatedStyle(() => ({
        opacity: blurOpacity.value,
    }));

    const animatedContainer = useAnimatedStyle(() => ({
        transform: [{
            scale: interpolate(progress.value, [0, 1], [1.3, 1])
        }]
    }));

    return (
        <View style={[StyleSheet.absoluteFill, {flex: 1, justifyContent: 'center'}]}>
            <AnimatedPressable
            style={[StyleSheet.absoluteFill, blurStyle]}
            onPress={() => {
                navigation.closeDrawer();
                blurOpacity.value = withTiming(0, { duration: 50 });
            }}>
                <BlurBackground blurAmount={3} blurType="light" />
            </AnimatedPressable>

            <Animated.View style={[styles.root, animatedContainer]}>
                <View style={styles.panel}>
                    {/* contenido */}
                    <View style={styles.content}>
                        {/* Device Header */}
                        <View style={styles.deviceHeader}>
                            <View style={[styles.deviceDot, {
                                        backgroundColor: selectedDevice ? colors.accent.teal.glow : colors.state.warning,
                                        shadowColor: selectedDevice ? colors.accent.teal.glow : colors.state.warning,
                                        shadowOpacity: 0.8,
                                        shadowRadius: 10,
                            }]} />
                            <View>
                                <Text numberOfLines={1} style={styles.deviceTitle}>
                                    {getDisplayName(selectedDevice)}
                                </Text>

                                <Text style={styles.deviceStatus}>
                                {selectedDevice ? 'Conectado' : 'No conectado'}
                                    {getModelInfo(selectedDevice) && ` · ${getModelInfo(selectedDevice)}`}
                                </Text>

                                {getNetwork(selectedDevice) && (
                                    <Text style={styles.deviceMeta}>
                                        Wi-Fi: {getNetwork(selectedDevice)}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Primary Actions */}
                        <View style={styles.primaryActions}>
                            <Text style={{
                                fontSize: typography.size.sm,
                                color: colors.text.inverted
                            }}>Navegación</Text>
                            {state.routes.map((route, index) => {
                                const focused = state.index === index;
                                const options = descriptors[route.key].options;

                                return (
                                    <RouteItem
                                        key={route.key}
                                        route={route}
                                        focused={focused}
                                        options={options}
                                        navigation={navigation}
                                    />
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}
const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        paddingLeft: spacing.sm,
        width: 300,
        height: '70%'
    },
    panel: {
        width: 300,
        height: '100%',
        padding: spacing.sm,
        borderRadius: radius.xl,
        overflow: 'hidden',

        backgroundColor: colors.bone.base,
        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.background, .30),
        ... globalStyles.shadow,
        shadowColor: colors.accent.purple.dark
    },
    content: {
        flex: 1,
        gap: spacing.lg,
    },
    deviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: withOpacityHex(colors.accent.purple.dark, .4),
        borderWidth: 1,
        borderColor: colors.accent.purple.soft,
    },
    deviceDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 5
    },
    
    deviceTitle: {
        fontSize: typography.size.sm,
        fontWeight: '700',
        color: colors.text.primary,
    },
    
    deviceStatus: {
        fontSize: typography.size.xs,
        color: colors.text.secondary,
        opacity: 0.8,
    },
    deviceMeta: {
        fontSize: typography.size.xs,
        color: colors.text.secondary,
        marginTop: 2,
    },
    primaryActions: {
        gap: spacing.sm,
    },
});