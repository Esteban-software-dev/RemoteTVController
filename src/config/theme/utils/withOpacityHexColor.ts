/**
 * Convert an hex color to RGBA with opacity
 * @param hexColor - string with '#RRGGBB' o '#RGB' format
 * @param alpha - number between 0 - 1 (opacity)
 * @returns string with 'rgba(r, g, b, alpha)' format
 */
export function withOpacityHex(hexColor: string, alpha: number): string {
    let hex = hexColor.replace('#', '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length !== 6) {
        throw new Error(`Formato inválido: "${hexColor}". Usa '#RRGGBB' o '#RGB'`);
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
