import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import {  PressableProps, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { IonIcon } from '@src/shared/components/IonIcon';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import { colors } from '@src/config/theme/colors/colors';
import { getContrastColor } from '@src/config/theme/utils/contrast-color';
import { androidRippleLightInkForeground, iosPressOpacity } from '@src/shared/ui/pressFeedback';
import { PressableFeedback } from '@src/shared/components/PressableFeedback';
import { radius } from '@src/config/theme/tokens';

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

    return (
        <Animated.View style={containerAnimatedStyle}>
            <PressableFeedback
                {...pressableProps}
                disabled={disabled}
                android_ripple={androidRippleLightInkForeground({ color: withOpacityHex(contrastIconColor, 0.25) })}
                style={({ pressed }) => [
                    styles.button,
                    {
                        width: size,
                        height: size,
                        borderRadius: radius.lg,
                        backgroundColor: color,
                    },
                    disabled ? { opacity: 0.5 } : iosPressOpacity(pressed, false),
                ]}>
                <IonIcon name={iconName} size={iconSize} color={contrastIconColor} />
            </PressableFeedback>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',

        borderWidth: 1,
        borderColor: withOpacityHex(colors.dark.base, 0.1),
    },
});
