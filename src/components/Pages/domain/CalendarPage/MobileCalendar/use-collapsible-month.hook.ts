import { useCallback, useEffect, useRef, useState } from 'react';

const COLLAPSE_SCROLL_THRESHOLD = 120;
const EXPAND_SCROLL_THRESHOLD = 24;
const SCROLL_DIRECTION_TOLERANCE = 6;
const MANUAL_INTENT_RELEASE_DELTA = 48;
const LAYOUT_SETTLE_MS = 240;
const PROGRAMMATIC_SCROLL_SETTLE_MS = 160;

export const useCollapsibleMonth = (enabled: boolean) => {
  const [isMonthCollapsed, setIsMonthCollapsed] = useState(false);

  const lastScrollY = useRef(0);
  const manualIntentScrollY = useRef<number | null>(null);
  const layoutSettledAt = useRef(0);
  const pendingFrame = useRef<number | null>(null);
  const programmaticScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScroll = useRef(false);

  const applyCollapsedState = useCallback((collapsed: boolean) => {
    layoutSettledAt.current = Date.now() + LAYOUT_SETTLE_MS;
    setIsMonthCollapsed(collapsed);
  }, []);

  const beginProgrammaticScroll = useCallback(() => {
    isProgrammaticScroll.current = true;
  }, []);

  const toggleMonthCollapsed = useCallback(() => {
    manualIntentScrollY.current = window.scrollY;

    setIsMonthCollapsed((collapsed) => {
      layoutSettledAt.current = Date.now() + LAYOUT_SETTLE_MS;

      return !collapsed;
    });
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsMonthCollapsed(false);

      return undefined;
    }

    const keepProgrammaticScrollAlive = () => {
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }

      programmaticScrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
        lastScrollY.current = window.scrollY;
      }, PROGRAMMATIC_SCROLL_SETTLE_MS);
    };

    const evaluateScrollPosition = () => {
      pendingFrame.current = null;

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY.current;

      if (Math.abs(scrollDelta) < SCROLL_DIRECTION_TOLERANCE) {
        return;
      }

      lastScrollY.current = scrollY;

      if (Date.now() < layoutSettledAt.current) {
        return;
      }

      const manualIntentAnchor = manualIntentScrollY.current;

      if (manualIntentAnchor !== null && Math.abs(scrollY - manualIntentAnchor) < MANUAL_INTENT_RELEASE_DELTA) {
        return;
      }

      const isScrollingDown = scrollDelta > 0;

      if (isScrollingDown && scrollY > COLLAPSE_SCROLL_THRESHOLD) {
        manualIntentScrollY.current = null;
        applyCollapsedState(true);

        return;
      }

      if (!isScrollingDown && scrollY <= EXPAND_SCROLL_THRESHOLD) {
        manualIntentScrollY.current = null;
        applyCollapsedState(false);
      }
    };

    const handleScroll = () => {
      if (isProgrammaticScroll.current) {
        keepProgrammaticScrollAlive();
        lastScrollY.current = window.scrollY;

        return;
      }

      if (pendingFrame.current !== null) {
        return;
      }

      pendingFrame.current = requestAnimationFrame(evaluateScrollPosition);
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (pendingFrame.current !== null) {
        cancelAnimationFrame(pendingFrame.current);
      }
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
    };
  }, [applyCollapsedState, enabled]);

  return { isMonthCollapsed, toggleMonthCollapsed, beginProgrammaticScroll };
};
