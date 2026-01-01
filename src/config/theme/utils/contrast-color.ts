import { colors } from "../colors/colors";

export const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
};

export const getLuminance = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const getContrastColor = (bgColor: string) => {
    return getLuminance(bgColor) > 0.55
        ? colors.dark.base
        : colors.white.base;
};
