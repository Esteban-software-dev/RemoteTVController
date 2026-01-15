import React, { memo, useMemo, useState } from 'react'
import { Image, ImageStyle, StyleProp } from 'react-native'
import { FallbackIcon } from './FallbackIcon'
import { getAppIconCached } from '../services/roku-apps.service'
import { useRokuSessionStore } from '@src/store/roku/roku-session.store'

interface AppIconProps {
    name: string;
    appId: string;
    style?: StyleProp<ImageStyle>;
}

export const AppIcon = memo(function AppIcon({
    name,
    appId,
    style,
}: AppIconProps) {
    const { selectedDevice } = useRokuSessionStore();
    const [hasError, setHasError] = useState(false);

    const cachedUri = useMemo(() => {
        if (hasError || !selectedDevice) return null;

        return getAppIconCached(
            selectedDevice.deviceId,
            appId,
            selectedDevice.ip
        )
    }, [hasError, selectedDevice?.deviceId, selectedDevice?.ip, appId]);

    if (!cachedUri) {
        return <FallbackIcon name={name} />
    }

    return (
        <Image
            source={{ uri: cachedUri }}
            style={style}
            onError={() => setHasError(true)}
        />
    )
});
