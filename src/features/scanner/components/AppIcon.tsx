import React, { memo, useMemo, useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { FallbackIcon } from './FallbackIcon';
import { getAppIconCached } from '../services/roku-apps.service';

interface AppIconProps {
    name: string;
    appId: string;
    deviceId?: string;
    deviceIp?: string;
    style?: StyleProp<ImageStyle>;
}

export const AppIcon = memo(function AppIcon({
    name,
    appId,
    deviceId,
    deviceIp,
    style,
}: AppIconProps) {
    const [hasError, setHasError] = useState(false);

    const cachedUri = useMemo(() => {
        if (hasError || !deviceId || !deviceIp) return null;

        return getAppIconCached(
            deviceId,
            appId,
            deviceIp
        );
    }, [appId, deviceId, deviceIp, hasError]);

    if (!cachedUri) {
        return <FallbackIcon name={name} />;
    }

    return (
        <Image
            source={{ uri: cachedUri }}
            style={style}
            onError={() => setHasError(true)}
        />
    );
});
