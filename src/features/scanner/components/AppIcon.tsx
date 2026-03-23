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

function AppIconComponent({
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
}

export const AppIcon = memo(
    AppIconComponent,
    (prevProps, nextProps) =>
        prevProps.appId === nextProps.appId &&
        prevProps.name === nextProps.name &&
        prevProps.deviceId === nextProps.deviceId &&
        prevProps.deviceIp === nextProps.deviceIp &&
        prevProps.style === nextProps.style
);
