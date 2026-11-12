import { useMemo, useRef, type RefObject } from 'react';
import { RivuletSystem, type RivuletPath } from '../../lib/rivulets';
import { useCanvasLoop } from '../../lib/useCanvasLoop';
import { createPulses, pulseIntensity, pulsesDuration, type Pulse } from '../../lib/lightning';

/**
 * Percorsi dell'acqua sul volto, in coordinate normalizzate su hero-statue.webp.
 * Seguono le colature e le crepe già presenti nella fotografia.
 */
const FACE_RIVULETS: RivuletPath[] = [
  { points: [[0.42, 0.415], [0.418, 0.55], [0.421, 0.7], [0.424, 0.86], [0.427, 0.985]], rate: 2.4, width: 1.5 },
  { points: [[0.596, 0.29], [0.582, 0.34], [0.556, 0.41], [0.536, 0.5], [0.535, 0.66], [0.538, 0.8], [0.54, 0.93]], rate: 2.8, width: 1.35 },
  { points: [[0.47, 0.4], [0.468, 0.5], [0.466, 0.62], [0.47, 0.75]], rate: 3.6, drip: true, width: 1.1 },
  { points: [[0.352, 0.55], [0.357, 0.63], [0.362, 0.71]], rate: 3.2, drip: true, width: 1.1 },
  { points: [[0.312, 0.715], [0.313, 0.775], [0.314, 0.825]], rate: 4, drip: true, width: 1 },
  { points: [[0.743, 0.6], [0.744, 0.7], [0.745, 0.8], [0.745, 0.9]], rate: 3.4, drip: true, width: 1.1 },
  { points: [[0.584, 0.63], [0.586, 0.72], [0.588, 0.82]], rate: 4.2, drip: true, width: 1 },
  { points: [[0.69, 0.5], [0.684, 0.56], [0.676, 0.63], [0.672, 0.7]], rate: 4.6, drip: true, width: 0.95 },
];

interface Props {
  /** copia schiarita della statua: viene accesa dai lampi lontani */
  flashRef?: RefObject<HTMLElement | null>;
}

export function WaterEffect({ flashRef }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const system = useMemo(() => new RivuletSystem(FACE_RIVULETS, 7), []);
  const storm = useRef<{ pulses: Pulse[]; age: number } | null>(null);
  const wait = useRef(3.5);

  useCanvasLoop(
    ref,
    (ctx, { width, height, dt, reduced }) => {
      ctx.clearRect(0, 0, width, height);
      const flash = flashRef?.current;
      let glow = 0;

      if (!reduced) {
        system.update(dt);
        if (!storm.current) {
          wait.current -= dt;
          if (wait.current <= 0) storm.current = { pulses: createPulses(), age: 0 };
        } else {
          storm.current.age += dt;
          glow = pulseIntensity(storm.current.pulses, storm.current.age, 0.2);
          if (storm.current.age > pulsesDuration(storm.current.pulses)) {
            storm.current = null;
            wait.current = 5 + Math.random() * 7;
          }
        }
      }

      if (flash) flash.style.opacity = (glow * 0.6).toFixed(3);
      system.draw(ctx, (nx, ny) => [nx * width, ny * height], Math.max(0.7, width / 820), !reduced, glow);
    },
    { maxDpr: 2 },
  );

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
