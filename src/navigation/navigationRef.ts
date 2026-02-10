import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();


export const getCurrentRouteName = () => {
    if (!navigationRef.isReady()) return null;
    return navigationRef.getCurrentRoute()?.name ?? null;
};
