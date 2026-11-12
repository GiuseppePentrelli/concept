/** Treno di impulsi luminosi di un fulmine: salita rapidissima, decadimento esponenziale, ri-accensioni. */
export interface Pulse {
  at: number;
  peak: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function createPulses(): Pulse[] {
  const pulses: Pulse[] = [{ at: 0, peak: rand(0.8, 1) }];
  pulses.push({ at: rand(0.09, 0.16), peak: rand(0.45, 0.85) });
  if (Math.random() < 0.55) pulses.push({ at: rand(0.3, 0.5), peak: rand(0.6, 1) });
  return pulses;
}

export function pulseIntensity(pulses: Pulse[], age: number, decay = 0.14) {
  let value = 0;
  for (const pulse of pulses) {
    const t = age - pulse.at;
    if (t < 0) continue;
    value = Math.max(value, pulse.peak * Math.min(1, t / 0.016) * Math.exp(-t / decay));
  }
  return value;
}

export const pulsesDuration = (pulses: Pulse[]) => pulses[pulses.length - 1].at + 0.9;
