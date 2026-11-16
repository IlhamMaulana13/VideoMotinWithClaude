import React from 'react';
import {clamp, mix, rand, ramp} from './utils';
import {INK, PUMP_L, PUMP_X, SURFACE} from './world';

const K = INK;

const SKY_TOP: Array<[number, string]> = [
  [0, '#6fa8f0'],
  [0.35, '#2f8df0'],
  [0.62, '#5b6fd0'],
  [0.82, '#2a2a6a'],
  [1, '#0b1030'],
];
const SKY_BOT: Array<[number, string]> = [
  [0, '#ffd9a0'],
  [0.35, '#bfe7ff'],
  [0.62, '#ffb070'],
  [0.82, '#e0705a'],
  [1, '#27306a'],
];
const HILL_FAR: Array<[number, string]> = [
  [0, '#9ed38b'],
  [0.35, '#86c96c'],
  [0.62, '#8aa85a'],
  [0.82, '#3d5a4a'],
  [1, '#1e3a30'],
];
const HILL_NEAR: Array<[number, string]> = [
  [0, '#6fbd57'],
  [0.35, '#55b043'],
  [0.62, '#6c9a40'],
  [0.82, '#2f4a3a'],
  [1, '#17302a'],
];

const night = (tod: number): number => clamp((tod - 0.72) / 0.22, 0, 1);

export const Sky: React.FC<{t: number; tod: number}> = ({t, tod}) => {
  const top = ramp(SKY_TOP, tod);
  const bot = ramp(SKY_BOT, tod);
  const sunP = clamp(tod / 0.86, 0, 1);
  const sunX = 120 + sunP * 840;
  const sunY = 930 - 780 * Math.sin(Math.PI * sunP);
  const sunA = 1 - clamp((tod - 0.82) / 0.1, 0, 1);
  const n = night(tod);
  const cloudCol = ramp(
    [
      [0, '#fff3e6'],
      [0.35, '#ffffff'],
      [0.62, '#ffd9c2'],
      [0.82, '#8a7fa8'],
      [1, '#3d4478'],
    ],
    tod,
  );
  const fireflies = clamp((tod - 0.55) / 0.3, 0, 1);
  const day = 1 - clamp((tod - 0.5) / 0.3, 0, 1);
  return (
    <g>
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
      </defs>
      <rect x={-900} y={-1200} width={3000} height={2200} fill="url(#skyGrad)" />
      {/* bintang & bulan */}
      {Array.from({length: 40}, (_, i) => (
        <circle
          key={`st${i}`}
          cx={-300 + rand(i + 1) * 1700}
          cy={-500 + rand(i + 7) * 1250}
          r={2 + rand(i + 13) * 3}
          fill="#fff8d6"
          opacity={n * (0.45 + 0.55 * Math.sin(t * 2 + i))}
        />
      ))}
      <g opacity={n} transform="translate(820 260)">
        <circle r={62} fill="#f4f1de" stroke={K} strokeWidth={6} />
        <circle cx={-18} cy={-12} r={12} fill="#dcd8c0" />
        <circle cx={20} cy={18} r={9} fill="#dcd8c0" />
        <circle cx={14} cy={-26} r={6} fill="#dcd8c0" />
      </g>
      {/* matahari */}
      <g opacity={sunA} transform={`translate(${sunX} ${sunY})`}>
        <circle r={120} fill="#fff3b0" opacity={0.28} />
        <g transform={`rotate(${t * 8})`}>
          {Array.from({length: 12}, (_, i) => (
            <line key={`ray${i}`} x1={0} y1={-86} x2={0} y2={-112} stroke="#ffd23f" strokeWidth={9} strokeLinecap="round" transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r={66} fill="#ffd23f" stroke={K} strokeWidth={6} />
        <circle cx={-18} cy={-20} r={16} fill="#fff6c9" opacity={0.7} />
      </g>
      {/* awan */}
      {Array.from({length: 6}, (_, i) => {
        const cx = ((rand(i + 20) * 2200 + t * (9 + rand(i + 3) * 14)) % 2200) - 500;
        const cy = 120 + rand(i + 31) * 520;
        const s = 0.8 + rand(i + 41) * 0.9;
        return (
          <g key={`cl${i}`} transform={`translate(${cx} ${cy}) scale(${s})`}>
            <path
              d="M-70,24 Q-92,24 -92,0 Q-92,-24 -62,-24 Q-52,-52 -16,-48 Q16,-70 44,-40 Q84,-46 90,-6 Q104,24 66,24 Z"
              fill={cloudCol}
              stroke={K}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
      {/* partikel: serbuk sari (siang), kunang-kunang (senja/malam) */}
      {Array.from({length: 26}, (_, i) => {
        const x = ((rand(i + 60) * 1500 + t * (8 + rand(i + 61) * 12) + Math.sin(t * 0.8 + i) * 30) % 1500) - 200;
        const y = 480 + rand(i + 62) * 480 + Math.sin(t * 1.1 + i * 1.7) * 22;
        const r = 2.5 + rand(i + 63) * 3;
        return (
          <g key={`pt${i}`}>
            <circle cx={x} cy={y} r={r} fill="#fffbe0" opacity={0.55 * day} />
            <circle cx={x} cy={y} r={r * 3.2} fill="#fff27a" opacity={0.28 * fireflies * (0.5 + 0.5 * Math.sin(t * 3 + i))} />
            <circle cx={x} cy={y} r={r} fill="#fff27a" opacity={0.95 * fireflies * (0.5 + 0.5 * Math.sin(t * 3 + i))} />
          </g>
        );
      })}
    </g>
  );
};

export const Hills: React.FC<{tod: number}> = ({tod}) => (
  <g>
    <path
      d="M-900,1000 L-900,860 Q-600,760 -300,850 T300,830 T900,850 T1500,820 T2000,860 L2000,1000 Z"
      fill={ramp(HILL_FAR, tod)}
      stroke={K}
      strokeWidth={5}
    />
    <path
      d="M-900,1000 L-900,930 Q-500,880 -100,940 T700,925 T1300,945 T2000,920 L2000,1000 Z"
      fill={ramp(HILL_NEAR, tod)}
      stroke={K}
      strokeWidth={5}
    />
  </g>
);

/** Lapisan warna sore/malam di atas semua objek di atas tanah. */
export const Atmosphere: React.FC<{tod: number}> = ({tod}) => {
  const warm = clamp(1 - Math.abs(tod - 0.64) / 0.18, 0, 1) * 0.16;
  const dusk = clamp((tod - 0.7) / 0.2, 0, 1) * 0.34;
  return (
    <g>
      <rect x={-900} y={-1200} width={3000} height={2200} fill="#ff8a3d" opacity={warm} />
      <rect x={-900} y={-1200} width={3000} height={2200} fill="#141a50" opacity={dusk} />
    </g>
  );
};

export const Rain: React.FC<{t: number; amount: number}> = ({t, amount}) => {
  if (amount <= 0.01) return null;
  const n = Math.round(90 * amount);
  return (
    <g stroke="#cfe6ff" strokeWidth={3} strokeLinecap="round" opacity={0.75}>
      {Array.from({length: n}, (_, i) => {
        const x = ((rand(i + 200) * 1700 - 300 + t * 220) % 1700) - 300;
        const y = ((rand(i + 300) * 1500 + t * (1300 + rand(i + 400) * 400)) % 1500) - 400;
        if (y > SURFACE - 6) return null;
        return <line key={`r${i}`} x1={x} y1={y} x2={x - 14} y2={y + 44} />;
      })}
    </g>
  );
};

export const Soil: React.FC = () => {
  const waves = [1180, 1560, 1900, 2300, 2700];
  return (
    <g>
      <defs>
        <linearGradient id="soilGrad" gradientUnits="userSpaceOnUse" x1="0" y1="1000" x2="0" y2="3400">
          <stop offset="0" stopColor="#a47148" />
          <stop offset="0.25" stopColor="#7a4d2c" />
          <stop offset="0.6" stopColor="#4d2f1a" />
          <stop offset="1" stopColor="#2a190d" />
        </linearGradient>
      </defs>
      <rect x={-900} y={SURFACE} width={3000} height={2500} fill="url(#soilGrad)" />
      {waves.map((y) => (
        <path
          key={`w${y}`}
          d={`M-900,${y} Q-600,${y - 34} -300,${y} T300,${y} T900,${y} T1500,${y} T2100,${y} L2100,${y + 80} L-900,${y + 80} Z`}
          fill="#000"
          opacity={0.1}
        />
      ))}
      {Array.from({length: 150}, (_, i) => (
        <circle
          key={`sp${i}`}
          cx={-800 + rand(i + 500) * 2700}
          cy={1040 + rand(i + 600) * 2300}
          r={1.5 + rand(i + 700) * 2.4}
          fill="#e9cfae"
          opacity={0.18}
        />
      ))}
      {Array.from({length: 34}, (_, i) => {
        const x = -600 + rand(i + 800) * 2300;
        const y = 1090 + rand(i + 900) * 2200;
        const rx = 14 + rand(i + 1000) * 28;
        const ry = 10 + rand(i + 1100) * 18;
        return (
          <g key={`stone${i}`} transform={`translate(${x} ${y}) rotate(${rand(i + 1200) * 30 - 15})`}>
            <ellipse rx={rx} ry={ry} fill="#9b9b9b" stroke="#222" strokeWidth={4} />
            <path d={`M${-rx * 0.5},${-ry * 0.2} Q0,${-ry * 0.7} ${rx * 0.45},${-ry * 0.2}`} stroke="#d4d4d4" strokeWidth={3} fill="none" strokeLinecap="round" />
            <ellipse cy={ry * 0.35} rx={rx * 0.8} ry={ry * 0.35} fill="#6f6f6f" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
};

/** Jalan (kiri), lantai SPBU (kanan), dan garis tanah putus-putus. */
export const Road: React.FC = () => (
  <g>
    <rect x={-900} y={SURFACE} width={1460} height={46} fill="#6b6b6b" stroke={K} strokeWidth={5} />
    <rect x={560} y={SURFACE} width={1500} height={46} fill="#b8b2a7" stroke={K} strokeWidth={5} />
    {Array.from({length: 40}, (_, i) => (
      <rect key={`ln${i}`} x={-880 + i * 56} y={SURFACE + 20} width={30} height={6} fill="#f5f5f5" opacity={0.8} />
    ))}
    <line x1={-900} y1={SURFACE} x2={2100} y2={SURFACE} stroke={K} strokeWidth={7} />
  </g>
);

/** Pompa bensin: warna tubuh, posisi x, dan kilau saat disorot. */
export const Pump: React.FC<{x: number; color: string; hl: number; t: number; fill: number}> = ({x, color, hl, t, fill}) => (
  <g transform={`translate(${x} ${SURFACE})`}>
    {hl > 0.01 ? (
      <g opacity={hl}>
        <rect x={-64} y={-262} width={128} height={266} rx={26} fill="none" stroke="#fff27a" strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 6)} />
      </g>
    ) : null}
    <rect x={-48} y={-230} width={96} height={228} rx={14} fill={color} stroke={K} strokeWidth={6} />
    <rect x={-36} y={-212} width={72} height={52} rx={8} fill="#0d1f14" stroke={K} strokeWidth={4} />
    <rect x={-30} y={-206 + 40 * (1 - fill)} width={60} height={Math.max(2, 40 * fill)} rx={4} fill="#7be495" opacity={0.9} />
    <rect x={-48} y={-130} width={96} height={20} fill="#fff" opacity={0.85} />
    <rect x={-42} y={-90} width={22} height={50} rx={8} fill="#2a2a2a" stroke={K} strokeWidth={4} />
    <rect x={-48} y={-10} width={96} height={10} fill="#333" />
  </g>
);

export const StationBack: React.FC = () => (
  <g>
    {/* tiang papan harga */}
    <rect x={604} y={560} width={14} height={440} fill="#9aa3ad" stroke={K} strokeWidth={5} />
    <rect x={548} y={470} width={126} height={108} rx={12} fill="#fff" stroke={K} strokeWidth={6} />
    <rect x={560} y={482} width={102} height={40} rx={6} fill="#2faa4a" stroke={K} strokeWidth={4} />
    <rect x={560} y={528} width={102} height={38} rx={6} fill="#2d7fe0" stroke={K} strokeWidth={4} />
    {/* kanopi */}
    <rect x={700} y={650} width={26} height={350} fill="#cfcfcf" stroke={K} strokeWidth={5} />
    <rect x={1050} y={650} width={26} height={350} fill="#cfcfcf" stroke={K} strokeWidth={5} />
    <rect x={670} y={596} width={460} height={56} rx={6} fill="#eeeeee" stroke={K} strokeWidth={6} />
    <rect x={670} y={634} width={460} height={18} fill="#d62828" stroke={K} strokeWidth={4} />
    <rect x={720} y={652} width={330} height={8} fill="#fff7b0" opacity={0.7} />
  </g>
);

export const Stations: React.FC<{t: number; hlL: number; hlX: number; fillL: number}> = ({t, hlL, hlX, fillL}) => (
  <g>
    <Pump x={PUMP_L} color="#2faa4a" hl={hlL} t={t} fill={fillL} />
    <Pump x={PUMP_X} color="#2d7fe0" hl={hlX} t={t} fill={0.15} />
  </g>
);

/** Tangki bawah tanah + pipa dari pompa. */
export const Tanks: React.FC<{t: number}> = ({t}) => {
  const pipe = (x: number) => (
    <g>
      <rect x={x - 15} y={SURFACE + 44} width={30} height={220} fill={K} />
      <rect x={x - 10} y={SURFACE + 44} width={20} height={220} fill="#9aa3ad" />
    </g>
  );
  return (
    <g>
      {pipe(PUMP_L)}
      {pipe(PUMP_X)}
      <rect x={600} y={1260} width={260} height={130} rx={62} fill="#2faa4a" stroke={K} strokeWidth={7} />
      <rect x={622} y={1274} width={216} height={22} rx={11} fill="#6be08a" opacity={0.7} />
      <rect x={890} y={1260} width={180} height={130} rx={62} fill="#2d7fe0" stroke={K} strokeWidth={7} />
      <rect x={912} y={1274} width={136} height={22} rx={11} fill="#7db8ff" opacity={0.7} />
      {[640, 700, 760, 820].map((x) => (
        <line key={`rv${x}`} x1={x} y1={1300} x2={x} y2={1352} stroke={K} strokeWidth={4} opacity={0.35} />
      ))}
      <ellipse cx={740} cy={1394 + Math.sin(t * 2) * 2} rx={110} ry={8} fill="#000" opacity={0.12} />
    </g>
  );
};
