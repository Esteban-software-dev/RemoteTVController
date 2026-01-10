import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { IonIcon } from '@src/shared/components/IonIcon';
import { BlurBackground } from './BlurBackground';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';
import { scheduleOnRN } from 'react-native-worklets';
import { colors } from '@src/config/theme/colors/colors';
import { spacing } from '@src/config/theme/tokens';
import { globalStyles } from '@src/config/theme/styles/global.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurBackground = Animated.createAnimatedComponent(BlurBackground);

export type ContextMenuAction<T = any> = {
  key: string;
  label: string;
  icon?: IoniconsIconName;
  destructive?: boolean;
  onPress: (payload: T) => void;
};

interface ContextMenuProps<T> {
  payload: T;
  renderTarget: (payload: T) => ReactNode;
  actions: ContextMenuAction<T>[];
  onClose: () => void;
}

export function ContextMenuComponent<T>({
  payload,
  renderTarget,
  actions,
  onClose,
}: ContextMenuProps<T>) {
  const targetOpacity = useSharedValue(0);
  const targetTranslateY = useSharedValue(12);
  const targetScale = useSharedValue(0.96);

  const backdropOpacity = useSharedValue(0);

  const menuOpacity = useSharedValue(0);
  const menuTranslateY = useSharedValue(8);

  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: 180 });

    targetOpacity.value = withTiming(1, { duration: 180 });
    targetTranslateY.value = withTiming(0, { duration: 220 });
    targetScale.value = withTiming(1, { duration: 220 });

    menuOpacity.value = withTiming(1, { duration: 200 });
    menuTranslateY.value = withTiming(0, { duration: 220 });
  }, []);

  const close = () => {
    targetOpacity.value = withTiming(0, { duration: 120 });
    targetTranslateY.value = withTiming(12, { duration: 120 });
    targetScale.value = withTiming(0.96, { duration: 120 });

    menuOpacity.value = withTiming(0, { duration: 120 });
    menuTranslateY.value = withTiming(8, { duration: 120 });

    backdropOpacity.value = withTiming(0, { duration: 0 }, () => {
      scheduleOnRN(onClose);
    });
  };

  const targetStyle = useAnimatedStyle(() => ({
    opacity: targetOpacity.value,
    transform: [
      { translateY: targetTranslateY.value },
      { scale: targetScale.value },
    ],
    width: 350,
    height: 350
  }));

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ translateY: menuTranslateY.value }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]} pointerEvents="box-none">
      <AnimatedPressable style={StyleSheet.absoluteFill} onPress={close}>
        <AnimatedBlurBackground style={StyleSheet.absoluteFill} blurType="dark" />
      </AnimatedPressable>

      <View style={styles.centerContainer} pointerEvents="box-none">
        <Animated.View style={targetStyle}>
          {renderTarget(payload)}
        </Animated.View>

        <Animated.View style={[styles.menu, menuStyle]}>
          {actions.map(action => (
            <MenuItemButton
              key={action.key}
              label={action.label}
              destructive={action.destructive}
              icon={action.icon}
              onPress={() => {
                action.onPress(payload);
                close();
              }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  menu: {
    width: 220,
    backgroundColor: '#1c1c1e',
    borderRadius: spacing.md,
    paddingVertical: spacing.sm,
    ... globalStyles.shadow
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  menuText: {
    marginLeft: spacing.md,
    fontSize: 14,
    fontWeight: '500',
    color: colors.white.base,
  },
});

interface MenuItemButtonProps {
  label: string;
  icon?: IoniconsIconName;
  destructive?: boolean;
  onPress: () => void;
}

export function MenuItemButton({
  label,
  icon,
  destructive,
  onPress,
}: MenuItemButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
    onPress={onPress}
    onPressIn={() => {
      scale.value = withTiming(0.96, { duration: 90 });
      opacity.value = withTiming(0.85, { duration: 90 });
    }}
    onPressOut={() => {
      scale.value = withTiming(1, { duration: 120 });
      opacity.value = withTiming(1, { duration: 120 });
    }}
    style={[menuItemButtonStyles.container, animatedStyle]}>
      <View style={menuItemButtonStyles.content}>
        {icon && (
          <IonIcon
            name={icon}
            size={18}
            color={destructive ? colors.danger : colors.white.base}
          />
        )}

        <Text
        style={[
          menuItemButtonStyles.label,
          destructive && menuItemButtonStyles.destructiveText,
        ]}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
const menuItemButtonStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white.base,
  },
  destructiveText: {
    color: colors.danger,
  },
});
