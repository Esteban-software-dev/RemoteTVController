import { PixelRatio } from 'react-native';
import { HEIGHT_SCALE, WIDTH_SCALE } from '../tokens/scales';

/** Aligns to device pixels — use for any layout size, not only “normalize” scaling. */
export function roundToLayoutPixel(size: number): number {
    return Math.round(PixelRatio.roundToNearestPixel(size));
}

/**
 * Scales a value from the design baseline (414×896 logical) to the current window.
 * Use for typography-like tokens, icons, strokes, etc.
 */
export function normalizeSize(size: number, based: 'width' | 'height' = 'width'): number {
    const scale = based === 'height' ? HEIGHT_SCALE : WIDTH_SCALE;
    return roundToLayoutPixel(size * scale);
}

/** Context menu app preview: square tile; uses same pixel rounding as {@link normalizeSize}. */
const CONTEXT_PREVIEW_MAX = 280;
const CONTEXT_PREVIEW_MIN = 168;
const CONTEXT_PREVIEW_WIDTH_FRAC = 0.68;
const CONTEXT_PREVIEW_HEIGHT_FRAC = 0.3;

export function getContextMenuPreviewTileSize(
    windowWidth: number,
    windowHeight: number,
): number {
    const raw = Math.min(
        windowWidth * CONTEXT_PREVIEW_WIDTH_FRAC,
        windowHeight * CONTEXT_PREVIEW_HEIGHT_FRAC,
        CONTEXT_PREVIEW_MAX,
    );
    return Math.max(CONTEXT_PREVIEW_MIN, roundToLayoutPixel(raw));
}
