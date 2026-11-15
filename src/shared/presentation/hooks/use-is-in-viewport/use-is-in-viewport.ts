import { type RefObject, useEffect, useState } from 'react';

export function useIsInViewport(elementRef: RefObject<Element | null>): boolean {
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setIsInViewport(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef]);

  return isInViewport;
}
