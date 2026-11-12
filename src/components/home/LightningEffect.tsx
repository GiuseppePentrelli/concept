import { useMemo, useRef, type RefObject } from 'react';
import { RivuletSystem, coverMapper, type RivuletPath } from '../../lib/rivulets';
import { useCanvasLoop } from '../../lib/useCanvasLoop';
import { createPulses, pulseIntensity, pulsesDuration, type Pulse } from '../../lib/lightning';

type Point = [number, number];

interface Strike {
  age: number;
  duration: number;
  origin: Point;
  main: Point[];
  branches: Point[][];
  pulses: Pulse[];
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

const ROCK_RIVULETS: RivuletPath[] = [
  { points: [[0.215, 0.36], [0.22, 0.52], [0.218, 0.68], [0.222, 0.86]], rate: 3, width: 1.1 },
  { points: [[0.268, 0.5], [0.273, 0.66], [0.27, 0.84]], rate: 3.8, drip: true, width: 1 },
  { points: [[0.13, 0.58], [0.133, 0.76], [0.13, 0.92]], rate: 4.4, width: 0.95 },
  { points: [[0.315, 0.56], [0.318, 0.7], [0.315, 0.84]], rate: 4, drip: true, width: 0.95 },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function jagged(a: Point, b: Point, displacement: number, depth: number): Point[] {
  if (depth === 0) return [a, b];
  const mid: Point = [
    (a[0] + b[0]) / 2 + (Math.random() - 0.5) * displacement,
    (a[1] + b[1]) / 2 + (Math.random() - 0.5) * displacement * 0.35,
  ];
  const left = jagged(a, mid, displacement * 0.55, depth - 1);
  const right = jagged(mid, b, displacement * 0.55, depth - 1);
  return [...left, ...right.slice(1)];
}

function createStrike(width: number, height: number): Strike {
  const x = Math.random() < 0.72 ? rand(0.56, 0.95) * width : rand(0.3, 0.5) * width;
  const origin: Point = [x, -6];
  const end: Point = [x + rand(-0.16, 0.12) * width, rand(0.62, 1.02) * height];
  const main = jagged(origin, end, Math.min(width, 900) * 0.16, 6);

  const branches: Point[][] = [];
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const from = main[Math.floor(rand(0.2, 0.75) * main.length)];
    const side = Math.random() < 0.5 ? -1 : 1;
    const to: Point = [from[0] + side * rand(0.04, 0.12) * width, from[1] + rand(0.12, 0.3) * height];
    branches.push(jagged(from, to, 60, 4));
  }

  const pulses: Pulse[] = createPulses();
  return { age: 0, duration: pulsesDuration(pulses), origin, main, branches, pulses };
}

function strokePath(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();
}

interface Props {
  flashRef: RefObject<HTMLElement | null>;
  imageRatio: number;
  onActiveChange?: (active: boolean) => void;
}

/** Fulmini irregolari, pioggia finissima e rivoli sulle rocce del banner DROP 00. */
export function LightningEffect({ flashRef, imageRatio, onActiveChange }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strike = useRef<Strike | null>(null);
  const wait = useRef(1.2);
  const rain = useRef<Drop[]>([]);
  const rivulets = useMemo(() => new RivuletSystem(ROCK_RIVULETS, 3), []);

  useCanvasLoop(
    ref,
    (ctx, { width, height, dt, reduced }) => {
      ctx.clearRect(0, 0, width, height);
      const flash = flashRef.current;
      const map = coverMapper(width, height, imageRatio, width < 768 ? 0.16 : 0.5, 0.5);

      if (reduced) {
        if (flash) flash.style.opacity = '0';
        rivulets.draw(ctx, map, 1, false);
        return;
      }

      const lit = strike.current ? pulseIntensity(strike.current.pulses, strike.current.age) : 0;

      // pioggia sottile, illuminata dai lampi
      const target = Math.min(120, Math.round(width / 11));
      const drops = rain.current;
      while (drops.length < target) {
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: rand(12, 30),
          speed: rand(420, 760),
          alpha: rand(0.07, 0.2),
        });
      }
      ctx.lineWidth = 1;
      for (const d of drops) {
        d.y += d.speed * dt;
        d.x -= d.speed * dt * 0.2;
        if (d.y > height + 20 || d.x < -20) {
          d.y = -20;
          d.x = Math.random() * (width + 120);
        }
        ctx.strokeStyle = `rgba(205, 212, 222, ${Math.min(0.9, d.alpha * (1 + lit * 3.2)).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.length * 0.2, d.y - d.length);
        ctx.stroke();
      }

      rivulets.update(dt);
      rivulets.draw(ctx, map, Math.max(0.8, height / 380), true, lit);

      // fulmini
      if (!strike.current) {
        wait.current -= dt;
        if (wait.current <= 0) {
          strike.current = createStrike(width, height);
          flash?.style.setProperty('--fx', `${((strike.current.origin[0] / width) * 100).toFixed(1)}%`);
        }
      }

      let intensity = 0;
      const current = strike.current;
      if (current) {
        current.age += dt;
        intensity = pulseIntensity(current.pulses, current.age) * (0.82 + Math.random() * 0.18);

        if (intensity > 0.01) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          // bagliore diffuso su tutta la scena
          ctx.fillStyle = `rgba(200, 210, 232, ${(intensity * 0.1).toFixed(3)})`;
          ctx.fillRect(0, 0, width, height);
          const glow = ctx.createRadialGradient(current.origin[0], 0, 0, current.origin[0], 0, width * 0.62);
          glow.addColorStop(0, `rgba(215, 224, 245, ${(intensity * 0.5).toFixed(3)})`);
          glow.addColorStop(0.45, `rgba(200, 210, 235, ${(intensity * 0.16).toFixed(3)})`);
          glow.addColorStop(1, 'rgba(200, 210, 235, 0)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, width, height);

          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          const passes: [number, number][] = [
            [22, 0.05],
            [10, 0.12],
            [4, 0.4],
            [1.7, 1],
          ];
          for (const [lineWidth, alpha] of passes) {
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = `rgba(240, 244, 255, ${Math.min(1, alpha * intensity * 1.25).toFixed(3)})`;
            strokePath(ctx, current.main);
            ctx.lineWidth = lineWidth * 0.55;
            ctx.strokeStyle = `rgba(240, 244, 255, ${Math.min(1, alpha * intensity * 0.7).toFixed(3)})`;
            for (const branch of current.branches) strokePath(ctx, branch);
          }
          ctx.restore();
        }

        if (current.age > current.duration) {
          strike.current = null;
          wait.current = 2.4 + Math.pow(Math.random(), 1.3) * 5;
        }
      }

      if (flash) flash.style.opacity = Math.min(1, intensity * 1.05).toFixed(3);
    },
    { maxDpr: 1.5, onActiveChange },
  );

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
