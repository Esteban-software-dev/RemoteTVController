import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { IonIcon } from '@src/shared/components/IonIcon';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { radius } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { colors } from '@src/config/theme/colors/colors';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';

interface RokuDeviceActionButtonProps extends PressableProps {
    iconName: IoniconsIconName;

    size?: number;
    iconSize?: number;

    color?: string;

    visibleWhenSelected?: boolean;
}

export function RokuDeviceActionButton({
    iconName,
    size = 40,
    iconSize = 20,
    color = colors.white.base,
    visibleWhenSelected = true,
    disabled,
    ...pressableProps
}: RokuDeviceActionButtonProps) {
    const { selectedDevice } = useRokuSessionStore();
    const scale = useSharedValue(1);
    const contrastIconColor = getContrastColor(color);

    const containerAnimatedStyle = useAnimatedStyle(() => {
        const visible = visibleWhenSelected ? !!selectedDevice : true;

        return {
            opacity: withTiming(visible ? 1 : 0, { duration: 180 }),
            transform: [
                { translateY: withTiming(visible ? 0 : -6, { duration: 180 }) },
                { scale: withTiming(visible ? 1 : 0.92, { duration: 180 }) },
            ],
            pointerEvents: visible ? 'auto' : 'none',
        };
    });

    const pressAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={containerAnimatedStyle}>
            <Pressable
            {...pressableProps}
            disabled={disabled}
            onPressIn={() => {
                scale.value = withTiming(0.9, { duration: 120 });
            }}
            onPressOut={() => {
                scale.value = withTiming(1, { duration: 120 });
            }}>
                <Animated.View
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2.4,
                        backgroundColor: color,
                    },
                    pressAnimatedStyle,
                ]}>
                    <IonIcon name={iconName} size={iconSize} color={contrastIconColor} />
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.1),
    },
});
