export const roundToDecimals = (
    value: number | string,
    decimals = 2
): number => {
    const numericValue = typeof value === "string" ? Number(value) : value;

    if (Number.isNaN(numericValue)) {
        console.warn("Invalid number:", value);
        return NaN;
    }

    const factor = 10 ** decimals;
    return Math.round(numericValue * factor) / factor;
};

export const formatVersion = (
    value: number | string,
    lastSegmentMaxLength = 2
): string => {
    const parts = String(value).trim().split(".");

    if (parts.length === 0) return "";
    const lastIndex = parts.length - 1;
    const last = parts[lastIndex];

    parts[lastIndex] = last.slice(0, lastSegmentMaxLength);

    return parts.join(".");
};
