/**
 * Sistema di rivoli d'acqua per canvas 2D.
 * I percorsi sono definiti in coordinate normalizzate (0–1) sull'immagine,
 * così l'acqua resta agganciata a crepe e superfici della fotografia.
 */

export interface RivuletPath {
  points: [number, number][];
  /** intervallo medio tra due gocce, in secondi */
  rate?: number;
  /** la goccia si stacca alla fine del percorso */
  drip?: boolean;
  width?: number;
}

export type Mapper = (nx: number, ny: number) => [number, number];

interface Track {
  path: RivuletPath;
  lengths: number[];
  total: number;
  seed: number;
  nextSpawn: number;
}

interface Bead {
  track: Track;
  t: number;
  speed: number;
  phase: number;
  size: number;
}

interface Drop {
  nx: number;
  ny: number;
  hang: number;
  vy: number;
  fall: number;
  size: number;
}

interface Glint {
  track: Track;
  t: number;
  offset: number;
  phase: number;
  speed: number;
}

const TINT = '226, 233, 240';

export class RivuletSystem {
  private tracks: Track[];
  private beads: Bead[] = [];
  private drops: Drop[] = [];
  private glints: Glint[] = [];
  private clock = 0;

  constructor(paths: RivuletPath[], glintsPerPath = 4) {
    this.tracks = paths.map((path, i) => {
      const lengths = [0];
      for (let k = 1; k < path.points.length; k++) {
        const [ax, ay] = path.points[k - 1];
        const [bx, by] = path.points[k];
        lengths.push(lengths[k - 1] + Math.hypot(bx - ax, by - ay));
      }
      return {
        path,
        lengths,
        total: lengths[lengths.length - 1],
        seed: i * 12.9898 + 4.1,
        nextSpawn: 0.4 + Math.random() * (path.rate ?? 5),
      };
    });

    for (const track of this.tracks) {
      for (let g = 0; g < glintsPerPath; g++) {
        this.glints.push({
          track,
          t: Math.random(),
          offset: (Math.random() - 0.5) * 0.02,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.9,
        });
      }
    }
  }

  private pointAt(track: Track, t: number): [number, number] {
    const { points } = track.path;
    const target = Math.max(0, Math.min(1, t)) * track.total;
    let k = 1;
    while (k < track.lengths.length - 1 && track.lengths[k] < target) k++;
    const span = track.lengths[k] - track.lengths[k - 1] || 1;
    const f = (target - track.lengths[k - 1]) / span;
    const [ax, ay] = points[k - 1];
    const [bx, by] = points[k];
    const meander = Math.sin(t * 34 + track.seed) * 0.0016 + Math.sin(t * 11 + track.seed * 2) * 0.0022;
    return [ax + (bx - ax) * f + meander, ay + (by - ay) * f];
  }

  update(dt: number) {
    this.clock += dt;

    for (const track of this.tracks) {
      track.nextSpawn -= dt;
      if (track.nextSpawn <= 0) {
        const rate = track.path.rate ?? 5;
        track.nextSpawn = rate * (0.55 + Math.random() * 0.9);
        this.beads.push({
          track,
          t: 0,
          speed: (0.16 + Math.random() * 0.12) / Math.max(0.25, track.total),
          phase: Math.random() * 10,
          size: 1.25 + Math.random() * 0.9,
        });
      }
    }

    for (const bead of this.beads) {
      // stick-slip: l'acqua sulla pietra si ferma, si accumula e riparte
      const slip = Math.sin(this.clock * 0.9 + bead.phase) * 0.5 + 0.5;
      const pace = 0.35 + 1.7 * slip * slip;
      bead.t += bead.speed * pace * dt;
    }

    this.beads = this.beads.filter((bead) => {
      if (bead.t < 1) return true;
      if (bead.track.path.drip) {
        const [nx, ny] = this.pointAt(bead.track, 1);
        this.drops.push({ nx, ny, hang: 0.5 + Math.random() * 0.7, vy: 0, fall: 0, size: bead.size });
      }
      return false;
    });

    for (const drop of this.drops) {
      if (drop.hang > 0) {
        drop.hang -= dt;
      } else {
        drop.vy += 1.9 * dt;
        drop.fall += drop.vy * dt;
      }
    }
    this.drops = this.drops.filter((d) => d.fall < 0.34);
  }

  draw(ctx: CanvasRenderingContext2D, map: Mapper, scale: number, animated = true, boost = 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const gain = 1 + boost * 1.6;

    // 1. filo d'acqua continuo: velo bagnato + scie luminose che scorrono verso il basso
    for (const track of this.tracks) {
      const w = (track.path.width ?? 1) * scale;
      const steps = Math.max(18, Math.round(track.total * 70));
      const flows = 3;
      const period = 2.6 + (track.seed % 1.7);
      for (let s = 0; s < steps; s++) {
        const t0 = s / steps;
        const t1 = (s + 1) / steps;
        const mid = (t0 + t1) / 2;
        let shine = 0;
        if (animated) {
          for (let f = 0; f < flows; f++) {
            const head = ((this.clock / period + f / flows + track.seed) % 1) * 1.25 - 0.1;
            const behind = head - mid;
            if (behind >= 0 && behind < 0.22) shine = Math.max(shine, Math.pow(1 - behind / 0.22, 1.6));
          }
        }
        const [x0, y0] = map(...this.pointAt(track, t0));
        const [x1, y1] = map(...this.pointAt(track, t1));
        // alone morbido
        ctx.strokeStyle = `rgba(${TINT}, ${((0.03 + shine * 0.1) * gain).toFixed(3)})`;
        ctx.lineWidth = w * (3.2 + shine * 2.4);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        // filo
        ctx.strokeStyle = `rgba(${TINT}, ${Math.min(1, (0.1 + shine * 0.62) * gain).toFixed(3)})`;
        ctx.lineWidth = w * (0.9 + shine * 0.9);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    }

    if (!animated) {
      ctx.restore();
      return;
    }

    // 2. scintillii di umidità
    for (const glint of this.glints) {
      const twinkle = Math.sin(this.clock * glint.speed + glint.phase);
      if (twinkle < 0.55) continue;
      const a = (twinkle - 0.55) / 0.45;
      const [nx, ny] = this.pointAt(glint.track, glint.t);
      const [x, y] = map(nx + glint.offset, ny);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, a * 0.75 * gain).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.3 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. gocce che scendono con la loro scia
    for (const bead of this.beads) {
      const fadeIn = Math.min(1, bead.t / 0.05);
      const fadeOut = bead.track.path.drip ? 1 : Math.min(1, (1 - bead.t) / 0.08);
      const presence = fadeIn * fadeOut;
      const trail = 0.16;
      const segments = 9;
      for (let s = 0; s < segments; s++) {
        const f0 = s / segments;
        const f1 = (s + 1) / segments;
        const t0 = bead.t - trail * (1 - f0);
        const t1 = bead.t - trail * (1 - f1);
        if (t1 <= 0) continue;
        const [x0, y0] = map(...this.pointAt(bead.track, Math.max(0, t0)));
        const [x1, y1] = map(...this.pointAt(bead.track, t1));
        ctx.strokeStyle = `rgba(${TINT}, ${(f1 * f1 * 0.85 * presence).toFixed(3)})`;
        ctx.lineWidth = (0.6 + f1 * 1.5) * bead.size * scale;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      const [hx, hy] = map(...this.pointAt(bead.track, bead.t));
      this.drawDroplet(ctx, hx, hy, bead.size * scale, 1, presence);
    }

    // 4. gocce che si staccano
    for (const drop of this.drops) {
      const [x] = map(drop.nx, drop.ny);
      const [, y1] = map(drop.nx, drop.ny + drop.fall);
      const alpha = Math.min(1, (1 - drop.fall / 0.34) * 1.6);
      const stretch = 1 + Math.min(1.5, drop.vy * 3.5);
      this.drawDroplet(ctx, x, y1, drop.size * scale * (drop.hang > 0 ? 1.1 : 0.8), stretch, alpha);
    }

    ctx.restore();
  }

  private drawDroplet(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, stretch: number, alpha: number) {
    const r = 1.9 * size;
    ctx.fillStyle = `rgba(${TINT}, ${(0.22 * alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.9, r * 2.4 * stretch, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(${TINT}, ${(0.8 * alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.75, r * 1.05 * stretch, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * alpha).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x - r * 0.2, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Mappa coordinate normalizzate dell'immagine su un contenitore con object-fit: cover. */
export function coverMapper(width: number, height: number, imageRatio: number, posX = 0.5, posY = 0.5): Mapper {
  const boxRatio = width / height;
  let w = width;
  let h = height;
  if (boxRatio > imageRatio) h = width / imageRatio;
  else w = height * imageRatio;
  const ox = (width - w) * posX;
  const oy = (height - h) * posY;
  return (nx, ny) => [ox + nx * w, oy + ny * h];
}
