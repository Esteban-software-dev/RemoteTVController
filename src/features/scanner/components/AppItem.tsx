import { View, Text, StyleSheet, Pressable, Image, GestureResponderEvent } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Gradient } from '@src/shared/components/Gradient';
import { radius, spacing } from '@src/config/theme/tokens';
import { colors } from '@src/config/theme/colors/colors';
import { SmallButton } from '@src/shared/components/SmallButton';
import { withOpacityHex } from '@src/config/theme/utils/withOpacityHexColor';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { globalStyles } from '@src/config/theme/styles/global.styles';
import { getAppGradient } from '@src/config/theme/utils/gradient-generator';
import { useContextMenu } from '@src/shared/context/ContextMenu';
import { useRokuSessionStore } from '@src/store/roku/roku-session.store';
import { getAppIcon } from '../services/roku-apps.service';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface RokuAppItemProps {
    appId: string;
    name: string;
    iconUrl?: string;
    index?: number;
    selected?: boolean;
    disabled?: boolean;
    onPress?: (appId: string) => void;
    onLongPress?: ({}: {e: GestureResponderEvent, appId: string}) => void;
}

export function AppItem({
    appId,
    name,
    disabled,
    iconUrl,
    index,
    onPress,
    onLongPress,
    selected,
}: RokuAppItemProps) {
  const { open } = useContextMenu();
  const { selectedDevice } = useRokuSessionStore();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const gradientConfig = getAppGradient(appId);

  const [hasError, setHasError] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const openAppContextMenu = () => {
    const app = {
      id: appId,
      name,
      icon: selectedDevice?.ip ? getAppIcon(selectedDevice.ip, appId) : '',
    };

    open({
      payload: app,
      renderTarget: () => (
        <AppItem
          appId={app.id}
          name={app.name}
          iconUrl={app.icon}
          selected
        />
      ),
      actions: [
        {
          key: 'highlight',
          label: 'Destacar',
          icon: 'star',
          onPress: app => console.log('highlight', app),
        },
        {
          key: 'pin',
          label: 'Pinnear',
          icon: 'pin',
          onPress: app => console.log('pin', app),
        },
        {
          key: 'hide',
          label: 'Ocultar',
          icon: 'eye-off',
          destructive: true,
          onPress: app => console.log('hide', app),
        },
      ],
    });
  
  }

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.6 : 1, { duration: 180 });
  }, [disabled]);

  return (
    <AnimatedPressable
    key={index}
    pointerEvents={selected ? 'none' : 'auto'}
    onPressIn={(e) => {
      if (selected) return;
      scale.value = withTiming(0.96, { duration: 90 });
    }}
    onPressOut={() => {
      if (selected) return;
      scale.value = withTiming(1, { duration: 120 });
    }}
    onPress={() => {
      if (selected) return;
      onPress?.(appId);
    }}
    onLongPress={(e: GestureResponderEvent) => {
      scale.value = withTiming(1, { duration: 120 });
      onLongPress?.({e, appId})
    }}
    delayLongPress={500}
    style={[globalStyles.shadow, styles.container, animatedStyle]}>
      <Gradient
        colors={gradientConfig.colors}
        start={gradientConfig.start}
        end={gradientConfig.end}
      />
      
      <SmallButton
      stopPropagation={true}
      size='sm'
      iconName='ellipsis-vertical'
      containerStyle={styles.moreButton}
      color={colors.white.base}
      variant='ghost'
      hitSlop={8}
      onPress={openAppContextMenu} />
        <View style={styles.iconZone}>
          {!iconUrl || hasError ? (
            <FallbackIcon name={name} />
          ) : (
            <Image
              style={styles.appIcon}
              source={{ uri: iconUrl }}
              onError={() => setHasError(true)}
            />
          )}
        </View>

      <View style={styles.textZone}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subtext} numberOfLines={1}>
          Last used · 2 days ago
        </Text>
      </View>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  moreButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10
  },
  iconZone: {
    backgroundColor: withOpacityHex(colors.white.base, .05),
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.xl,
    borderColor: withOpacityHex(colors.dark.base, .10),
    overflow: 'hidden'
  },
  textZone: {
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white.base,
  },
  subtext: {
    fontSize: 11,
    color: colors.white.base,
    opacity: 0.7,
  },
  appIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface FallbackIconProps {
  name: string;
}
function FallbackIcon({
  name
}: FallbackIconProps) {
  return (
    <View style={fallbackStyles.fallback}>
      <Text style={fallbackStyles.letter}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}

const fallbackStyles = StyleSheet.create({
  fallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white.base,
  },
  
});