import { GRADIENT_PRESETS } from '../colors/gradient-presets';

function hashString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
}

export function getAppGradient(seed: string) {
    const hash = hashString(seed);
    const preset = GRADIENT_PRESETS[hash % GRADIENT_PRESETS.length];
    const angleVariant = hash % 3;

    const directions = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
        { start: { x: 0.2, y: 0 }, end: { x: 0.8, y: 1 } },
    ];

    return {
        colors: preset,
        ...directions[angleVariant],
    };
}
