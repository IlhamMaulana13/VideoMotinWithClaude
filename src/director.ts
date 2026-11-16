import {clamp, trackAt, wayPos, Way} from './utils';
import {Timing, sceneStarts, totalSeconds} from './timing';
import {STOP_X, WHEEL_R} from './world';

export type Expr = 'senang' | 'sedih' | 'kaget' | 'tekad' | 'netral';

export type Clock = (idx: number, off?: number) => number;

export type Direction = {
  t: number;
  idx: number;
  local: number; // detik sejak adegan ini mulai
  T: Clock;
  cam: {x: number; y: number; z: number};
  tod: number; // 0=subuh, 0.35=siang, 0.65=sore, 0.85=senja, 1=malam
  rain: number;
  motorX: number;
  motorDir: number;
  motorMoving: boolean;
  wheelDeg: number;
  petugasX: number;
  kakekExpr: Expr;
  petugasExpr: Expr;
  gesture: number; // 0 pegang stang, 1 lambaikan tangan, 2 satu jari, 4 goyang jari (tidak)
  petGesture: number; // 0 pegang EDC, 1 telapak "stop", 2 memeriksa
  nozzleOn: boolean;
  shake: {x: number; y: number};
};

export type Plan = {
  S: number[];
  total: number;
  T: Clock;
  wps: Array<[number, number]>;
  nozzle: Array<[number, number]>;
};

/** Indeks adegan boleh pecahan: 3.5 = tengah adegan ke-4. */
export const makeClock = (tm: Timing): {T: Clock; S: number[]; total: number} => {
  const S = sceneStarts(tm);
  const total = totalSeconds(tm);
  const n = S.length;
  const T: Clock = (idx, off = 0) => {
    const i = Math.floor(idx);
    const f = idx - i;
    const a = S[Math.min(Math.max(i, 0), n - 1)];
    const b = i + 1 < n ? S[i + 1] : total;
    return a + f * (b - a) + off;
  };
  return {T, S, total};
};

// Kamera per adegan: [adegan, x, y, z]  (z=1 => lebar 1080 dunia)
const CAM: number[][] = [
  [0, 480, 800, 1.0],
  [1, 350, 800, 2.1],
  [2, 540, 800, 1.0],
  [4, 300, 700, 2.3],
  [5, 300, 700, 1.8],
  [6, 540, 780, 1.0],
  [7, 330, 800, 1.5],
  [8, 900, 840, 1.9],
  [10, 790, 840, 1.9],
  [11, 560, 1400, 1.1],
  [12, 330, 2030, 1.6],
  [13, 540, 720, 1.0],
  [14, 560, 800, 1.5],
  [15, 540, 800, 1.0],
  [16, 640, 770, 2.1],
  [17, 640, 800, 1.8],
  [18, 330, 2030, 1.6],
  [19, 540, 2060, 0.95],
  [20, 540, 780, 1.0],
  [21, 420, 760, 1.5],
  [22, 540, 780, 1.0],
];

// Waktu hari & hujan: [adegan, tod, hujan]
const TOD: number[][] = [
  [0, 0.03, 0],
  [2, 0.12, 0],
  [3, 0.38, 0],
  [3.55, 0.64, 0],
  [8, 0.34, 0],
  [15, 0.8, 0.35],
  [16, 0.84, 0.6],
  [17, 0.86, 0.9],
  [20, 0.1, 0],
  [22, 0.3, 0],
];

const PET_X: number[][] = [
  [0, 745],
  [16, 700],
  [17, 680],
  [20, 745],
];

const KAKEK_EXPR: Expr[] = [
  'senang', 'senang', 'senang', 'senang', 'senang', 'kaget', 'tekad', 'tekad',
  'senang', 'senang', 'netral', 'netral', 'netral', 'tekad', 'senang', 'senang',
  'sedih', 'kaget', 'sedih', 'sedih', 'senang', 'tekad', 'senang',
];
const PET_EXPR: Expr[] = [
  'senang', 'senang', 'senang', 'senang', 'senang', 'netral', 'netral', 'senang',
  'senang', 'senang', 'netral', 'netral', 'netral', 'netral', 'senang', 'netral',
  'tekad', 'tekad', 'tekad', 'netral', 'senang', 'senang', 'senang',
];
const pick = <V,>(arr: V[], i: number): V => arr[Math.min(Math.max(i, 0), arr.length - 1)];

/** Jalur motor (detik absolut). Tiga kali bolak-balik ke SPBU, lalu pergi. */
export const buildPlan = (tm: Timing): Plan => {
  const {T, S, total} = makeClock(tm);
  const wps: Array<[number, number]> = [
    [0, -330],
    [T(0, 1.2), 330],
    [T(2, 0.0), 330],
    [T(2, 0.8), STOP_X],
    [T(2, 1.2), STOP_X],
    [T(2, 2.2), 150],
    [T(2, 2.45), 150],
    [T(3, 0.05), STOP_X],
    [T(3, 0.45), STOP_X],
    [T(4, 0.0), 300],
    [T(7, 0.9), 300],
    [T(8, 0.5), STOP_X],
    [T(14, 1.4), STOP_X],
    [T(14, 2.3), -380],
    [T(15, 0.0), -380],
    [T(15, 0.9), STOP_X],
    [T(22, 1.0), STOP_X],
    [T(22, 3.4), -380],
    [total + 1, -380],
  ];
  const nozzle: Array<[number, number]> = [
    [T(2, 0.85), T(2, 1.2)],
    [T(3, 0.05), T(3, 0.45)],
    [T(10, 0.3), T(10, 1.9)],
    [T(20, 0.4), T(21, 0.0)],
  ];
  return {S, total, T, wps, nozzle};
};

const shakeAt = (t: number, T: Clock): {x: number; y: number} => {
  const ev: Array<[number, number, number]> = [
    [T(7, 0.05), 12, 0.4],
    [T(17, 0.25), 16, 0.45],
    [T(18, 0.35), 18, 0.45],
    [T(19, 0.25), 12, 0.4],
  ];
  let x = 0;
  let y = 0;
  for (const [t0, amp, du] of ev) {
    if (t >= t0 && t < t0 + du * 1.8) {
      const e = Math.exp(-(t - t0) / (du / 3));
      x += amp * e * Math.sin((t - t0) * 70);
      y += amp * 0.7 * e * Math.cos((t - t0) * 83);
    }
  }
  return {x, y};
};

export const direct = (t: number, tm: Timing, plan: Plan): Direction => {
  const {T, S} = plan;
  let idx = 0;
  for (let i = 0; i < S.length; i++) {
    if (t >= S[i]) idx = i;
  }
  const cam = trackAt(t, T, CAM, 0.9);
  const tod = trackAt(t, T, TOD, 0.8);
  const pet = trackAt(t, T, PET_X, 0.7);
  const way: Way = wayPos(t, plan.wps);
  let nozzleOn = false;
  for (const [a, b] of plan.nozzle) {
    if (t >= a && t <= b) nozzleOn = true;
  }
  let gesture = 0;
  if (idx === 0 || idx === 22) gesture = 1;
  if (idx === 14) gesture = 2;
  if (idx === 21) gesture = 4;
  let petGesture = 0;
  if (idx === 16) petGesture = 2;
  if (idx === 17) petGesture = 1;
  const sh = shakeAt(t, T);
  const z = Math.max(0.2, cam[2]);
  return {
    t,
    idx,
    local: t - S[idx],
    T,
    cam: {x: cam[0] + sh.x / z, y: cam[1] + sh.y / z, z},
    tod: clamp(tod[0], 0, 1),
    rain: clamp(tod[1], 0, 1),
    motorX: way.x,
    motorDir: way.dir,
    motorMoving: way.moving,
    wheelDeg: (way.x / WHEEL_R) * (180 / Math.PI),
    petugasX: pet[0],
    kakekExpr: pick(KAKEK_EXPR, idx),
    petugasExpr: pick(PET_EXPR, idx),
    gesture,
    petGesture,
    nozzleOn,
    shake: sh,
  };
};

/** Interval motor sedang bergerak (untuk SFX mesin). */
export const movingSegments = (plan: Plan): Array<[number, number]> => {
  const out: Array<[number, number]> = [];
  for (let i = 0; i < plan.wps.length - 1; i++) {
    const [t0, x0] = plan.wps[i];
    const [t1, x1] = plan.wps[i + 1];
    if (x0 !== x1 && t1 > 0) out.push([Math.max(0, t0), t1]);
  }
  return out;
};

