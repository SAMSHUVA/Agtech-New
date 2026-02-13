export interface AnimatedNumberFormatOptions {
  decimals?: number;
  grouping?: boolean;
}

const NUMBER_FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function easeOutCubic(progress: number): number {
  const t = clampProgress(progress);
  return 1 - (1 - t) ** 3;
}

export function parseNumericValue(value: number | string): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatAnimatedNumber(value: number, options: AnimatedNumberFormatOptions = {}): string {
  const { decimals = 0, grouping = true } = options;
  const safeValue = Number.isFinite(value) ? value : 0;
  const fractionDigits = Math.max(0, decimals);
  const cacheKey = `${fractionDigits}-${grouping ? 'group' : 'plain'}`;
  const cachedFormatter = NUMBER_FORMATTER_CACHE.get(cacheKey);

  if (cachedFormatter) {
    return cachedFormatter.format(safeValue);
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    useGrouping: grouping,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  NUMBER_FORMATTER_CACHE.set(cacheKey, formatter);
  return formatter.format(safeValue);
}
