import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';

import { formatAnimatedNumber, easeOutCubic } from '@/lib/numberAnimation';
import { cn } from '@/lib/utils';

export interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  startDelayMs?: number;
  grouping?: boolean;
  play?: boolean;
  onComplete?: () => void;
  className?: string;
}

const FINISH_EFFECT_MS = 340;
const DEFAULT_DURATION_MS = 1400;

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clearFrame(frameRef: MutableRefObject<number | null>) {
  if (frameRef.current !== null) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }
}

function clearTimeoutRef(timeoutRef: MutableRefObject<number | null>) {
  if (timeoutRef.current !== null) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}

export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = DEFAULT_DURATION_MS,
  startDelayMs = 0,
  grouping = true,
  play = true,
  onComplete,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const completedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startDelayRef = useRef<number | null>(null);
  const finishDelayRef = useRef<number | null>(null);
  const pendingVisibilityStartRef = useRef(false);

  useEffect(() => {
    if (completedRef.current || !play) return undefined;

    const finishAnimation = () => {
      setDisplayValue(value);
      setIsFinishing(true);
      completedRef.current = true;
      onComplete?.();
      clearTimeoutRef(finishDelayRef);
      finishDelayRef.current = window.setTimeout(() => {
        setIsFinishing(false);
      }, FINISH_EFFECT_MS);
    };

    const runAnimation = () => {
      if (completedRef.current) return;
      if (shouldReduceMotion()) {
        finishAnimation();
        return;
      }

      if (document.visibilityState !== 'visible') {
        pendingVisibilityStartRef.current = true;
        return;
      }

      pendingVisibilityStartRef.current = false;
      setDisplayValue(0);
      const safeDuration = Math.max(0, durationMs);
      const startedAt = performance.now();

      const animateFrame = (now: number) => {
        const elapsed = now - startedAt;
        const progress = safeDuration === 0 ? 1 : Math.min(1, elapsed / safeDuration);
        const easedValue = value * easeOutCubic(progress);
        setDisplayValue(easedValue);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animateFrame);
          return;
        }

        finishAnimation();
      };

      rafRef.current = requestAnimationFrame(animateFrame);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && pendingVisibilityStartRef.current) {
        runAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    clearTimeoutRef(startDelayRef);
    startDelayRef.current = window.setTimeout(runAnimation, Math.max(0, startDelayMs));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearFrame(rafRef);
      clearTimeoutRef(startDelayRef);
      clearTimeoutRef(finishDelayRef);
      pendingVisibilityStartRef.current = false;
    };
  }, [durationMs, onComplete, play, startDelayMs, value]);

  const renderedNumber = useMemo(
    () => formatAnimatedNumber(displayValue, { decimals, grouping }),
    [decimals, displayValue, grouping],
  );
  const finalValue = useMemo(
    () => `${prefix}${formatAnimatedNumber(value, { decimals, grouping })}${suffix}`,
    [decimals, grouping, prefix, suffix, value],
  );

  return (
    <span
      className={cn('inline-block tabular-nums', className, isFinishing && 'animate-number-settle')}
      aria-label={finalValue}
    >
      <span className={cn('inline-block', isFinishing && 'animate-number-glow')}>
        {prefix}
        {renderedNumber}
        {suffix}
      </span>
    </span>
  );
}
