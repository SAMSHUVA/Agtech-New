import { useEffect, useRef, useState } from 'react';

interface UseInViewOnceOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewOnce<T extends HTMLElement>(options: UseInViewOnceOptions = {}) {
  const { threshold = 0.35, rootMargin = '0px' } = options;
  const ref = useRef<T>(null);
  const [hasEntered, setHasEntered] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || hasEntered) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasEntered, rootMargin, threshold]);

  return { ref, hasEntered };
}
