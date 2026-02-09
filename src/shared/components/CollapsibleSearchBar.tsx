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
    collapsible?: boolean;
}

export const CollapsibleSearchBar = memo(({
    value,
    onChange,
    onSubmit,
    placeholder = 'Ej. Netflix, YouTube...',
    collapsedLabel,
    style,
    collapsible = false,
}: CollapsibleSearchBarProps) => {
    const COLLAPSED_MIN_WIDTH = 140;
    const [expanded, setExpanded] = useState(collapsible ? false : true);
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<TextInput>(null);

    const isExpanded = collapsible ? (expanded || isFocused || value.length > 0) : true;

    const progress = useSharedValue(0);
    const containerWidth = useSharedValue(0);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    const blurInput = useCallback(() => {
        inputRef.current?.blur();
    }, []);

    useEffect(() => {
        if (!collapsible) {
            progress.value = 1;
            return;
        }
        progress.value = withTiming(
            isExpanded ? 1 : 0,
            { duration: 600, easing: Easing.out(Easing.cubic) },
            (finished) => {
                if (finished && isExpanded) {
                    runOnJS(focusInput)();
                }
            }
        );
    }, [isExpanded, focusInput, progress, collapsible]);

    useEffect(() => {
        if (value !== localValue && !isFocused) {
            setLocalValue(value);
        }
        if (value === '' && localValue !== '') {
            setLocalValue('');
        }
    }, [value, localValue, isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        const collapsedWidth = collapsedLabel ? COLLAPSED_MIN_WIDTH : 44;
        const width = !collapsible
            ? '100%'
            : (containerWidth.value > 0
                ? interpolate(
                    progress.value,
                    [0, 1],
                    [collapsedWidth, containerWidth.value]
                )
                : '100%');
        const paddingHorizontal = (!collapsible || collapsedLabel)
            ? spacing.md
            : interpolate(progress.value, [0, 1], [0, spacing.md]);
        return {
            width,
            paddingHorizontal,
            transform: [
                { scale: interpolate(progress.value, [0, 1], [0.99, 1]) },
            ],
            justifyContent: !collapsible ? 'center' : undefined,
        };
    });

    const inputAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 1]),
    }));

    const labelAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [1, 0]),
    }));

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0) containerWidth.value = width;
    };

    const handleChange = (text: string) => {
        setLocalValue(text);
        onChange(text);
    };

    const handleCollapse = () => {
        if (!collapsible) return;
        setExpanded(false);
        setLocalValue('');
        onChange('');
        blurInput();
    };

    return (
        <View style={[styles.wrapper, style]} onLayout={handleLayout}>
            <Animated.View
            style={[
                styles.container,
                animatedStyle,
                collapsible && !collapsedLabel && !isExpanded ? styles.containerCentered : null,
            ]}
            pointerEvents="box-none">
                <IonIcon
                    name="search-outline"
                    size={18}
                    color={colors.accent.purple.base}
                    iconStyles={[
                        styles.icon,
                        collapsible && !collapsedLabel && !isExpanded ? styles.iconCentered : null,
                    ]}
                />

                <Animated.View
                style={[
                    styles.inputWrapper,
                    inputAnimatedStyle,
                    collapsible && !collapsedLabel && !isExpanded ? styles.hiddenSlot : null,
                ]}
                pointerEvents={isExpanded ? 'auto' : 'none'}>
                    <TextInput
                        ref={inputRef}
                        value={localValue}
                        placeholder={placeholder}
                        placeholderTextColor={colors.accent.gray.text}
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={handleChange}
                        onSubmitEditing={() => onSubmit?.(localValue)}
                        editable={isExpanded}
                        onFocus={() => {
                            setIsFocused(true);
                            if (collapsible) setExpanded(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                            if (collapsible && value.length === 0) setExpanded(false);
                        }}
                    />
                </Animated.View>

                <Animated.View
                style={[
                    styles.closeWrapper,
                    inputAnimatedStyle,
                    collapsible && !collapsedLabel && !isExpanded ? styles.hiddenSlot : null,
                ]}
                pointerEvents={isExpanded ? 'auto' : 'none'}>
                    <Pressable onPress={handleCollapse} hitSlop={10}>
                        <IonIcon
                            name="close"
                            size={18}
                            color={colors.accent.gray.text}
                        />
                    </Pressable>
                </Animated.View>

                {collapsible && collapsedLabel && (
                    <Animated.View
                    style={[styles.collapsedLabel, labelAnimatedStyle]}
                    pointerEvents={isExpanded ? 'none' : 'auto'}>
                        <Pressable
                        style={styles.collapsedPress}
                        onPress={() => setExpanded(true)}>
                            <Text style={styles.collapsedText}>{collapsedLabel}</Text>
                        </Pressable>
                    </Animated.View>
                )}

                {collapsible && !collapsedLabel && (
                    <Pressable
                        style={styles.iconTap}
                        onPress={() => setExpanded(true)}
                        pointerEvents={isExpanded ? 'none' : 'auto'}
                    />
                )}
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

    /* ------------------ Collapsed label ------------------ */
    collapsedLabel: {
        position: 'absolute',
        left: spacing.md + 22,
        right: spacing.md,
        height: '100%',
        justifyContent: 'center',
    },
    collapsedPress: {
        height: '100%',
        justifyContent: 'center',
    },
    collapsedText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.accent.gray.text,
    },

    /* ------------------ Expanded ------------------ */

    container: {
        height: 44,
        width: '100%',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.accent.gray.icon,
        backgroundColor: colors.bone.soft,
        flexDirection: 'row',
        alignItems: 'center',
        shadowOpacity: 0,
        elevation: 0,
        overflow: 'hidden',
    },
    containerCentered: {
        justifyContent: 'center',
    },

    icon: {
        marginRight: spacing.sm,
    },
    iconCentered: {
        marginRight: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },

    inputWrapper: {
        flex: 1,
    },

    closeWrapper: {
        marginLeft: spacing.xs,
    },
    hiddenSlot: {
        width: 0,
        opacity: 0,
    },

    collapsedOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    iconTap: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },

    input: {
        flex: 1,
        fontSize: 14,
        color: colors.dark.base,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
});
