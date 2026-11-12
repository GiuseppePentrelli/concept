import { useEffect, useRef, type RefObject } from 'react';

export interface Frame {
  width: number;
  height: number;
  dt: number;
  time: number;
  reduced: boolean;
}

type Render = (ctx: CanvasRenderingContext2D, frame: Frame) => void;

interface Options {
  maxDpr?: number;
  onActiveChange?: (active: boolean) => void;
}

/**
 * Loop requestAnimationFrame per canvas decorativi.
 * Si ferma quando il canvas è fuori dal viewport o la scheda è nascosta,
 * e con prefers-reduced-motion disegna un solo fotogramma statico.
 */
export function useCanvasLoop(ref: RefObject<HTMLCanvasElement | null>, render: Render, options: Options = {}) {
  const renderRef = useRef(render);
  renderRef.current = render;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let width = 0;
    let height = 0;
    let visible = false;
    let raf = 0;
    let last = 0;
    let time = 0;

    const draw = (dt: number) => {
      if (width === 0 || height === 0) return;
      renderRef.current(ctx, { width, height, dt, time, reduced });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      draw(dt);
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const sync = () => {
      const shouldRun = visible && !document.hidden && !reduced;
      optionsRef.current.onActiveChange?.(shouldRun);
      if (shouldRun && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun) {
        stop();
        if (reduced) draw(0);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, optionsRef.current.maxDpr ?? 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!raf) draw(0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: '80px' },
    );
    intersection.observe(canvas);

    const onMotionChange = () => {
      reduced = motionQuery.matches;
      sync();
    };
    motionQuery.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', sync);
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref]);
}
