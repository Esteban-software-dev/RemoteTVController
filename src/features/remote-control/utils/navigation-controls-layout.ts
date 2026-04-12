import { spacing } from '@src/config/theme/tokens';
import { roundToLayoutPixel } from '@src/config/theme/utils/normalize-size';

const DPAD_DESIGN = 212;
const DPAD_BORDER_RADIUS_DESIGN = 32;

/** Design content widths: CH + D-pad + volume — scale together */
const W_LEFT_REF = 72;
const W_DPAD_REF = 212;
const W_RIGHT_REF = 50;
const CONTENT_SUM_REF = W_LEFT_REF + W_DPAD_REF + W_RIGHT_REF;

const RIGHT_RAIL_DEFAULT = W_RIGHT_REF;
const RIGHT_RAIL_MIN = 48;
const LEFT_RAIL_MIN = 48;
const LEFT_RAIL_MAX = 48;
const DPAD_MAX = 212;
const DPAD_FLOOR = 56;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Horizontal space inside `controlsCard` for the navigation row (scroll + card padding).
 */
export function getNavigationRowInnerWidth(windowWidth: number): number {
  return windowWidth - spacing.sm * 2 - spacing.md * 2;
}

export type NavigationControlsLayout = {
  rowInnerWidth: number;
  leftRailWidth: number;
  rightRailWidth: number;
  dpadSize: number;
  dpadScale: number;
  dpadBorderRadius: number;
  columnGap: number;
};

function packContent(inner: number): { leftW: number; rightW: number; dpadSize: number } {
  const scale = inner / CONTENT_SUM_REF;

  let leftW = roundToLayoutPixel(W_LEFT_REF * scale);
  let rightW = roundToLayoutPixel(W_RIGHT_REF * scale);
  leftW = clamp(leftW, LEFT_RAIL_MIN, LEFT_RAIL_MAX);
  rightW = clamp(rightW, RIGHT_RAIL_MIN, RIGHT_RAIL_DEFAULT);

  let dpadSize = roundToLayoutPixel(inner - leftW - rightW);

  if (dpadSize < DPAD_FLOOR) {
    const need = DPAD_FLOOR - dpadSize;
    const fromLeft = Math.min(need, leftW - LEFT_RAIL_MIN);
    leftW -= fromLeft;
    const fromRight = Math.min(need - fromLeft, rightW - RIGHT_RAIL_MIN);
    rightW -= fromRight;
    dpadSize = roundToLayoutPixel(inner - leftW - rightW);
  }

  dpadSize = clamp(dpadSize, DPAD_FLOOR, DPAD_MAX);

  const slack = inner - leftW - rightW - dpadSize;
  if (slack !== 0) {
    dpadSize = clamp(dpadSize + slack, DPAD_FLOOR, DPAD_MAX);
  }

  return { leftW, rightW, dpadSize };
}

/**
 * CH, D-pad and volume share one scale from the reference sum (342px content).
 * Reserves a slightly larger `columnGap` on wider rows so the three blocks are not flush.
 */
export function getNavigationControlsLayout(windowWidth: number): NavigationControlsLayout {
  const rowInner = getNavigationRowInnerWidth(windowWidth);

  let columnGap = roundToLayoutPixel(
    Math.max(spacing.xs, Math.min(spacing.sm, rowInner * 0.042)),
  );

  let inner = rowInner - 2 * columnGap;
  let { leftW, rightW, dpadSize } = packContent(inner);

  if (leftW + rightW + dpadSize > inner) {
    dpadSize = Math.max(DPAD_FLOOR, roundToLayoutPixel(inner - leftW - rightW));
  }

  if (dpadSize < DPAD_FLOOR && columnGap > spacing.xs) {
    columnGap = spacing.xs;
    inner = rowInner - 2 * columnGap;
    ({ leftW, rightW, dpadSize } = packContent(inner));
    if (leftW + rightW + dpadSize > inner) {
      dpadSize = Math.max(52, roundToLayoutPixel(inner - leftW - rightW));
    }
  }

  inner = rowInner - 2 * columnGap;
  if (dpadSize < 52) {
    dpadSize = Math.max(48, roundToLayoutPixel(inner - leftW - rightW));
  }

  const totalUsed = leftW + rightW + dpadSize + 2 * columnGap;
  if (totalUsed !== rowInner) {
    dpadSize = roundToLayoutPixel(dpadSize + (rowInner - totalUsed));
    dpadSize = clamp(dpadSize, 48, DPAD_MAX);
  }

  const dpadScale = dpadSize / DPAD_DESIGN;
  const dpadBorderRadius = Math.max(
    18,
    Math.min(DPAD_BORDER_RADIUS_DESIGN, roundToLayoutPixel(DPAD_BORDER_RADIUS_DESIGN * dpadScale)),
  );

  return {
    rowInnerWidth: rowInner,
    leftRailWidth: leftW,
    rightRailWidth: rightW,
    dpadSize,
    dpadScale,
    dpadBorderRadius,
    columnGap,
  };
}

/** Positions for D-pad keys; `scale` = {@link NavigationControlsLayout.dpadScale}. */
export function getDpadButtonLayout(scale: number) {
  const directionalSize = roundToLayoutPixel(48 * scale);
  const directionalHalf = roundToLayoutPixel(directionalSize / 2);
  const centerSize = roundToLayoutPixel(60 * scale);
  const centerHalf = roundToLayoutPixel(centerSize / 2);
  const edgeInset = Math.max(2, roundToLayoutPixel(4 * scale));
  return {
    directionalSize,
    directionalOffset: -directionalHalf,
    centerSize,
    centerOffset: -centerHalf,
    edgeInset,
  };
}
