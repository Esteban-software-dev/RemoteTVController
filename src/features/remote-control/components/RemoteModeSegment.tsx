import { colors } from '@src/config/theme/colors/colors';
import { radius, spacing } from '@src/config/theme/tokens';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import React, { useEffect, useState } from 'react';
import {
    LayoutChangeEvent,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { androidRippleOnLightInk, iosPressOpacity } from '@src/shared/ui/pressFeedback';

type ControlMode = 'classic' | 'touch';

interface RemoteModeSegmentProps {
    value: ControlMode;
    onChange: (mode: ControlMode) => void;
    classicLabel: string;
    touchLabel: string;
    style?: StyleProp<ViewStyle>;
}

const TRACK_PADDING = 3;

export function RemoteModeSegment({
    value,
    onChange,
    classicLabel,
    touchLabel,
    style,
}: RemoteModeSegmentProps) {
    const [width, setWidth] = useState(0);
    const modeAnim = useSharedValue(value === 'classic' ? 0 : 1);

    useEffect(() => {
        modeAnim.value = withTiming(value === 'classic' ? 0 : 1, {
            duration: 240,
        });
    }, [value, modeAnim]);

    const onLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    };

    const trackWidth = Math.max(0, width - TRACK_PADDING * 2);
    const thumbWidth = trackWidth / 2;

    const thumbStyle = useAnimatedStyle(() => ({
        width: thumbWidth,
        transform: [{ translateX: modeAnim.value * thumbWidth }],
    }));

    const classicTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            modeAnim.value,
            [0, 1],
            [colors.white.base, withOpacityHex(colors.dark.base, 0.65)]
        ),
    }));

    const touchTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            modeAnim.value,
            [0, 1],
            [withOpacityHex(colors.dark.base, 0.65), colors.white.base]
        ),
    }));

    const segmentRipple = androidRippleOnLightInk();

    return (
        <View style={[styles.wrap, style]} onLayout={onLayout}>
            <Animated.View style={[styles.thumb, thumbStyle]} />
            <View style={styles.segment}>
                <Pressable
                style={({ pressed }) => [styles.hitArea, styles.hitAreaClassic, iosPressOpacity(pressed, false)]}
                android_ripple={segmentRipple}
                onPress={() => onChange('classic')}>
                    <Animated.Text numberOfLines={1} style={[styles.label, classicTextStyle]}>
                        {classicLabel}
                    </Animated.Text>
                </Pressable>
            </View>

            <View style={styles.segment}>
                <Pressable
                style={({ pressed }) => [styles.hitArea, styles.hitAreaTouch, iosPressOpacity(pressed, false)]}
                android_ripple={segmentRipple}
                onPress={() => onChange('touch')}>
                    <Animated.Text numberOfLines={1} style={[styles.label, touchTextStyle]}>
                        {touchLabel}
                    </Animated.Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: withOpacityHex(colors.accent.gray.base, 0.2),
        borderRadius: radius.pill,
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
        padding: TRACK_PADDING,
        minHeight: 38,
    },
    thumb: {
        position: 'absolute',
        left: TRACK_PADDING,
        top: TRACK_PADDING,
        bottom: TRACK_PADDING,
        borderRadius: radius.pill,
        backgroundColor: colors.accent.purple.base,
    },
    segment: {
        flex: 1,
        zIndex: 1,
        overflow: 'hidden',
    },
    hitArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs + 2,
        paddingHorizontal: spacing.sm + 2,
    },
    hitAreaClassic: {
        borderTopLeftRadius: radius.pill,
        borderBottomLeftRadius: radius.pill,
        overflow: 'hidden',
    },
    hitAreaTouch: {
        borderTopRightRadius: radius.pill,
        borderBottomRightRadius: radius.pill,
        overflow: 'hidden',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
    },
});
