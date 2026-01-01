export interface RokuApp {
    id: string
    name: string
    type: 'appl' | 'menu' | 'screensaver' | string
    version?: string
    isSystemApp?: boolean
    lastUsedAt?: number
}
