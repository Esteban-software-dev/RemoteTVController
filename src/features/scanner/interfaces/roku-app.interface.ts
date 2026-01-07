export interface RokuApp {
    id: string;
    name: string;
    icon?: string;
    type: 'appl' | 'menu' | 'screensaver' | string;
    version?: string;
    isLaunchable: boolean;
    isSystem: boolean;
}