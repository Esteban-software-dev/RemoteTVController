import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ViewStyle,
    LayoutChangeEvent,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
    interpolate,
    interpolateColor,
} from 'react-native-reanimated';

import { radius, spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { IonIcon } from './IonIcon';

interface CollapsibleSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    collapsedLabel?: string;
    style?: ViewStyle;
}

export const CollapsibleSearchBar = memo(({
    value,
    onChange,
    onSubmit,
    placeholder = 'Ej. Netflix, YouTube...',
    collapsedLabel = 'Buscar',
    style,
}: CollapsibleSearchBarProps) => {
    const COLLAPSED_MIN_WIDTH = 120;
    const [expanded, setExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<TextInput>(null);

    const isExpanded = expanded || isFocused || value.length > 0;

    const progress = useSharedValue(0);
    const containerWidth = useSharedValue(0);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const blurInput = useCallback(() => {
        inputRef.current?.blur();
    }, []);

    useEffect(() => {
        progress.value = withTiming(
            isExpanded ? 1 : 0,
            { duration: 260, easing: Easing.out(Easing.cubic) },
            (finished) => {
                if (finished && isExpanded) {
                    runOnJS(focusInput)();
                }
            }
        );
    }, [isExpanded, focusInput, progress]);

    useEffect(() => {
        if (value !== localValue && !isFocused) {
            setLocalValue(value);
        }
        if (value === '' && localValue !== '') {
            setLocalValue('');
        }
    }, [value, localValue, isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        const width =
            containerWidth.value > 0
                ? interpolate(
                        progress.value,
                        [0, 1],
                        [COLLAPSED_MIN_WIDTH, containerWidth.value]
                )
                : '100%';
        return {
            width,
            backgroundColor: interpolateColor(
                progress.value,
                [0, 1],
                ['rgba(0,0,0,0)', colors.dark.surface]
            ),
            borderColor: interpolateColor(
                progress.value,
                [0, 1],
                ['rgba(0,0,0,0)', colors.accent.purple.base]
            ),
            shadowOpacity: interpolate(progress.value, [0, 1], [0, 0.22]),
            elevation: interpolate(progress.value, [0, 1], [0, 6]),
            transform: [
                { scale: interpolate(progress.value, [0, 1], [0.98, 1]) },
            ],
        };
    });

    const inputAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [0, 1]),
        };
    });

    const collapsedAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 1], [1, 0]),
        };
    });

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0) containerWidth.value = width;
    };

    const handleChange = (text: string) => {
        setLocalValue(text);
        onChange(text);
    };

    const handleCollapse = () => {
        setExpanded(false);
        setLocalValue('');
        onChange('');
        blurInput();
    };

    return (
        <View style={[styles.wrapper, style]} onLayout={handleLayout}>
            <Animated.View style={[styles.container, animatedStyle]} pointerEvents="box-none">
                <IonIcon
                    name="search-outline"
                    size={18}
                    color={colors.accent.purple.base}
                    iconStyles={styles.icon}
                />

                <Animated.View
                style={[styles.inputWrapper, inputAnimatedStyle]}
                pointerEvents={isExpanded ? 'auto' : 'none'}>
                    <TextInput
                        ref={inputRef}
                        value={localValue}
                        placeholder={placeholder}
                        placeholderTextColor={colors.text.secondary}
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={handleChange}
                        onSubmitEditing={() => onSubmit?.(localValue)}
                        editable={isExpanded}
                        onFocus={() => {
                            setIsFocused(true);
                            setExpanded(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                            if (value.length === 0) setExpanded(false);
                        }}
                    />
                </Animated.View>

                <Animated.View
                style={[styles.closeWrapper, inputAnimatedStyle]}
                pointerEvents={isExpanded ? 'auto' : 'none'}>
                    <Pressable onPress={handleCollapse} hitSlop={10}>
                        <IonIcon
                            name="close"
                            size={18}
                            color={colors.text.primary}
                        />
                    </Pressable>
                </Animated.View>

                <Animated.View
                style={[styles.collapsedOverlay, collapsedAnimatedStyle]}
                pointerEvents={isExpanded ? 'none' : 'auto'}>
                    <Pressable
                    style={styles.collapsed}
                    onPress={() => setExpanded(true)}>
                        <IonIcon
                            name="search-outline"
                            size={18}
                            color={colors.accent.purple.base}
                        />
                        <Text style={styles.collapsedText}>{collapsedLabel}</Text>
                    </Pressable>
                </Animated.View>
            </Animated.View>
        </View>
    );
});

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 44,
        justifyContent: 'center',
    },

    /* ------------------ Collapsed ------------------ */
    collapsed: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        height: 40,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        backgroundColor: colors.dark.surface,
        borderWidth: 1,
        borderColor: colors.accent.purple.base,
    },

    collapsedText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.accent.purple.base,
    },

    /* ------------------ Expanded ------------------ */

    container: {
        height: 44,
        width: '100%',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.accent.purple.base,
        backgroundColor: colors.dark.surface,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        shadowColor: colors.accent.purple.base,
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'hidden',
    },

    icon: {
        marginRight: spacing.sm,
    },

    inputWrapper: {
        flex: 1,
    },

    closeWrapper: {
        marginLeft: spacing.xs,
    },

    collapsedOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: colors.text.primary,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
});
