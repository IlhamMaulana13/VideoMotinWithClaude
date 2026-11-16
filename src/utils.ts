export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const ease = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};
export const easeOutBack = (t: number): number => {
  const c = clamp(t, 0, 1);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
};
/** Kemajuan 0..1 dari `start` selama `dur` detik. */
export const prog = (t: number, start: number, dur: number): number => clamp((t - start) / dur, 0, 1);
/** Acak deterministik (supaya setiap frame sama persis saat render). */
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const css = (c: RGB): string => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
export const mix = (a: string, b: string, t: number): string => {
  const A = hex(a);
  const B = hex(b);
  const k = clamp(t, 0, 1);
  return css([lerp(A[0], B[0], k), lerp(A[1], B[1], k), lerp(A[2], B[2], k)]);
};
/** Gradasi banyak titik: stops = [[posisi, '#rrggbb'], ...] urut naik. */
export const ramp = (stops: Array<[number, string]>, t: number): string => {
  if (t <= stops[0][0]) return css(hex(stops[0][1]));
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (t <= p1) return mix(c0, c1, (t - p0) / (p1 - p0));
  }
  return css(hex(stops[stops.length - 1][1]));
};

/**
 * Nilai yang berubah per adegan, dengan transisi halus.
 * pts = [[indeksAdegan(boleh pecahan), nilai1, nilai2, ...], ...] urut naik.
 */
export const trackAt = (t: number, T: (idx: number, off?: number) => number, pts: number[][], trans: number): number[] => {
  let k = -1;
  for (let i = 0; i < pts.length; i++) {
    if (T(pts[i][0]) <= t + 1e-9) k = i;
  }
  if (k < 0) return pts[0].slice(1);
  const cur = pts[k].slice(1);
  if (k === 0) return cur;
  const prev = pts[k - 1].slice(1);
  const p = ease((t - T(pts[k][0])) / trans);
  return cur.map((v, i) => lerp(prev[i], v, p));
};

export type Way = {x: number; dir: number; moving: boolean};
/** Jalur motor: titik [waktuDetik, x]; arah ditentukan dari gerak terakhir. */
export const wayPos = (t: number, wps: Array<[number, number]>): Way => {
  let dir = 1;
  if (t <= wps[0][0]) return {x: wps[0][1], dir, moving: false};
  for (let i = 0; i < wps.length - 1; i++) {
    const [t0, x0] = wps[i];
    const [t1, x1] = wps[i + 1];
    const dx = x1 - x0;
    if (dx !== 0) dir = dx > 0 ? 1 : -1;
    if (t < t1) {
      if (dx === 0) return {x: x0, dir, moving: false};
      return {x: lerp(x0, x1, ease((t - t0) / Math.max(1e-6, t1 - t0))), dir, moving: true};
    }
  }
  return {x: wps[wps.length - 1][1], dir, moving: false};
};

/** Titik pada polyline berdasarkan proporsi panjang u (0..1). */
export const pointOnPolyline = (pts: Array<[number, number]>, u: number): [number, number] => {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    lens.push(l);
    total += l;
  }
  let d = clamp(u, 0, 1) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const f = lens[i] === 0 ? 0 : clamp(d / lens[i], 0, 1);
      return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
};
