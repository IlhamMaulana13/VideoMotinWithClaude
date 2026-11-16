import React from 'react';
import {Direction} from './director';
import {Timing} from './timing';
import {clamp, ease, easeOutBack, pointOnPolyline, prog} from './utils';
import {CABLE, FONT, INK, PUMP_L, PUMP_X, STOP_X} from './world';
import {Plate} from './Underground';

const K = INK;

/** Jendela waktu dengan fade masuk/keluar (0..1). */
const fw = (t: number, a: number, b: number, fi = 0.15, fo = 0.2): number => {
  if (t < a || t > b) return 0;
  return Math.min(1, (t - a) / fi, (b - t) / fo);
};

const Pop: React.FC<{x: number; y: number; a: number; s?: number; rot?: number; children?: React.ReactNode}> = ({x, y, a, s = 1, rot = 0, children}) =>
  a <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${Math.max(0.01, s)})`} opacity={a}>
      {children}
    </g>
  );

const PillSvg: React.FC<{text: string; fill: string; color?: string; size?: number}> = ({text, fill, color = '#fff', size = 40}) => {
  const w = text.length * size * 0.62 + 64;
  const h = size + 34;
  return (
    <g>
      <rect x={-w / 2 + 5} y={-h / 2 + 6} width={w} height={h} rx={h / 2} fill={K} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={K} strokeWidth={6} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

const Padlock: React.FC<{open: boolean}> = ({open}) => (
  <g>
    <path d={open ? 'M-22,0 V-30 Q-22,-58 4,-58 Q28,-58 30,-34' : 'M-22,0 V-30 Q-22,-58 0,-58 Q22,-58 22,-30 V0'} fill="none" stroke={K} strokeWidth={14} strokeLinecap="round" />
    <path d={open ? 'M-22,0 V-30 Q-22,-58 4,-58 Q28,-58 30,-34' : 'M-22,0 V-30 Q-22,-58 0,-58 Q22,-58 22,-30 V0'} fill="none" stroke="#cfd4d9" strokeWidth={7} strokeLinecap="round" />
    <rect x={-40} y={-4} width={80} height={62} rx={12} fill="#f2b632" stroke={K} strokeWidth={6} />
    <circle cx={0} cy={22} r={8} fill={K} />
    <rect x={-3} y={24} width={6} height={18} rx={3} fill={K} />
  </g>
);

const Coin: React.FC<{label?: string}> = ({label = 'Rp'}) => (
  <g>
    <circle r={32} fill="#ffd23f" stroke={K} strokeWidth={6} />
    <circle r={23} fill="none" stroke="#e0a21a" strokeWidth={4} />
    <text x={0} y={9} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={24} fill={K}>
      {label}
    </text>
  </g>
);

const Shield: React.FC = () => (
  <g>
    <path d="M0,-70 L60,-46 V12 Q60,58 0,86 Q-60,58 -60,12 V-46 Z" fill="#d92d2d" stroke={K} strokeWidth={7} strokeLinejoin="round" />
    <Plate x={-42} y={-24} w={84} fs={12} />
    <line x1={-50} y1={-34} x2={50} y2={42} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
    <line x1={-50} y1={-34} x2={50} y2={42} stroke="#d92d2d" strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Pin: React.FC<{c?: string}> = ({c = '#e53935'}) => (
  <g>
    <path d="M0,0 Q-38,-44 -38,-66 A38,38 0 1 1 38,-66 Q38,-44 0,0 Z" fill={c} stroke={K} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={0} cy={-66} r={14} fill="#fff" stroke={K} strokeWidth={4} />
  </g>
);

const Badge: React.FC<{label: string; fill?: string; r?: number; fs?: number}> = ({label, fill = '#ffd23f', r = 54, fs = 46}) => (
  <g>
    <circle r={r} fill={fill} stroke={K} strokeWidth={7} />
    <text x={0} y={fs * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill={K}>
      {label}
    </text>
  </g>
);

const Jerigen: React.FC = () => (
  <g>
    <path d="M-52,60 V-30 Q-52,-46 -36,-46 H-18 L-4,-70 H40 Q54,-70 54,-54 V60 Z" fill="#e0a21a" stroke={K} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-34} y={-24} width={72} height={34} rx={8} fill="#f6c34b" stroke={K} strokeWidth={4} />
    <circle cx={24} cy={-78} r={10} fill="#333" stroke={K} strokeWidth={4} />
    <path d="M-62,-70 L64,70 M64,-70 L-62,70" stroke="#d92d2d" strokeWidth={16} strokeLinecap="round" />
    <path d="M-62,-70 L64,70 M64,-70 L-62,70" stroke="#ff6b6b" strokeWidth={7} strokeLinecap="round" />
  </g>
);

const CheckBadge: React.FC = () => (
  <g>
    <circle r={50} fill="#3fcf4a" stroke={K} strokeWidth={7} />
    <path d="M-24,2 L-6,22 L28,-18" fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const Magnifier: React.FC = () => (
  <g>
    <line x1={22} y1={22} x2={58} y2={58} stroke={K} strokeWidth={16} strokeLinecap="round" />
    <circle r={34} fill="#cfe9ff" fillOpacity={0.55} stroke={K} strokeWidth={8} />
    <path d="M-14,-6 Q0,-20 14,-6" fill="none" stroke={K} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Sparkle: React.FC = () => (
  <polygon points="0,-30 8,-8 30,0 8,8 0,30 -8,8 -30,0 -8,-8" fill="#fff27a" stroke={K} strokeWidth={4} strokeLinejoin="round" />
);

const Burst: React.FC<{text: string}> = ({text}) => {
  const pts: string[] = [];
  for (let i = 0; i < 20; i++) {
    const r = i % 2 === 0 ? 92 : 62;
    const a = (i / 20) * Math.PI * 2;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g>
      <polygon points={pts.join(' ')} fill="#ffd23f" stroke={K} strokeWidth={7} strokeLinejoin="round" />
      <text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#d92d2d">
        {text}
      </text>
    </g>
  );
};

const Stamp: React.FC<{text: string; color?: string; fs?: number}> = ({text, color = '#d92d2d', fs = 60}) => {
  const w = text.length * fs * 0.66 + 50;
  return (
    <g>
      <rect x={-w / 2} y={-fs * 0.78} width={w} height={fs * 1.56} rx={14} fill="#fff" fillOpacity={0.92} stroke={color} strokeWidth={11} />
      <text x={0} y={fs * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** Ikon & penanda yang menempel di dunia (ikut bergerak dengan kamera). */
export const WorldOverlays: React.FC<{d: Direction}> = ({d}) => {
  const {t, T, motorX, petugasX} = d;
  const mx = motorX;
  const p = (start: number, dur = 0.35): number => easeOutBack((t - start) / dur);
  const wob = Math.sin(t * 7) * 4;

  const eyeU = ease(prog(t, T(11, 0.2), 1.2));
  const eyePos = pointOnPolyline(CABLE, eyeU);
  const flyU = ease(prog(t, T(12, 0.0), 0.55));
  const flyPos = pointOnPolyline(CABLE, flyU);

  return (
    <g>
      {/* 0: papan nama */}
      <Pop x={mx - 20} y={520} a={fw(t, T(0, 1.3), T(1, 0.5), 0.2, 0.3)} s={0.7 + 0.3 * p(T(0, 1.3))}>
        <PillSvg text="BANG RIO" fill="#ffd23f" color={K} size={40} />
      </Pop>
      {/* 1: tangki besar */}
      <Pop x={mx + 130} y={690} a={fw(t, T(1, 0.15), T(2, 0.1), 0.2, 0.3)} s={0.5 + 0.5 * p(T(1, 0.15), 0.4)} rot={-8 + wob}>
        <Burst text="BESAR!" />
      </Pop>
      {/* 4: hemat */}
      <g opacity={fw(t, T(4, 0.1), T(5, 0.1), 0.25, 0.25)}>
        <circle cx={mx - 8} cy={598} r={9} fill="#fff" stroke={K} strokeWidth={4} />
        <circle cx={mx + 8} cy={560} r={14} fill="#fff" stroke={K} strokeWidth={4} />
        <g transform={`translate(${mx + 70} ${470})`}>
          <ellipse rx={150} ry={84} fill="#fff" stroke={K} strokeWidth={7} />
          <g transform={`scale(${Math.abs(Math.cos(t * 3))} 1) translate(-70 -6)`}>
            <Coin />
          </g>
          <text x={46} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill="#2faa4a" stroke={K} strokeWidth={1.5}>
            HEMAT
          </text>
        </g>
      </g>
      {/* 5: tanda tanya */}
      <Pop x={mx - 10} y={500} a={fw(t, T(5, 0), T(6, 0.1), 0.1, 0.25)} s={0.4 + 0.6 * p(T(5, 0), 0.4)} rot={-8 + wob}>
        <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={230} fill="#ffd23f" stroke={K} strokeWidth={14} paintOrder="stroke">
          ?
        </text>
      </Pop>
      {/* 6: hitungan isi bensin */}
      {[
        {x: 640, label: '1×', st: T(6, 0.1), fill: '#ffd23f'},
        {x: 800, label: '2×', st: T(6, 0.8), fill: '#ffb36b'},
        {x: 960, label: '3×?', st: T(6, 1.45), fill: '#ff7a7a'},
      ].map((b, i) => (
        <Pop key={`cnt${i}`} x={b.x} y={440} a={fw(t, b.st, T(7, 0.1), 0.12, 0.25)} s={0.5 + 0.5 * p(b.st)}>
          <Badge label={b.label} fill={b.fill} />
        </Pop>
      ))}
      {/* 8-9: Pertamax non-subsidi, tanpa jatah */}
      <Pop x={PUMP_X} y={540} a={fw(t, T(8, 0.2), T(10, 0.1), 0.2, 0.3)} s={0.7 + 0.3 * p(T(8, 0.2))}>
        <PillSvg text="NON-SUBSIDI" fill="#2d7fe0" size={38} />
      </Pop>
      <Pop x={PUMP_X} y={440} a={fw(t, T(9, 0.2), T(10, 0.1), 0.2, 0.3)} s={0.5 + 0.5 * p(T(9, 0.2), 0.45)} rot={wob}>
        <Padlock open={true} />
      </Pop>
      {/* 10: Pertalite subsidi */}
      <Pop x={PUMP_L} y={540} a={fw(t, T(10, 0.15), T(11, 0.1), 0.2, 0.3)} s={0.7 + 0.3 * p(T(10, 0.15))}>
        <PillSvg text="SUBSIDI" fill="#2faa4a" size={38} />
      </Pop>
      {[0, 1, 2].map((i) => {
        const st = T(10, 0.3) + i * 0.5;
        const u = prog(t, st, 0.6);
        return (
          <Pop key={`coin${i}`} x={PUMP_L - 30 + i * 30} y={300 + u * 210} a={fw(t, st, st + 0.65, 0.08, 0.15)} s={0.8}>
            <Coin />
          </Pop>
        );
      })}
      {/* 11: dipantau */}
      <Pop x={eyePos[0] + 40} y={eyePos[1]} a={fw(t, T(11, 0.2), T(12, 0.25), 0.15, 0.25)} s={0.9}>
        <Magnifier />
      </Pop>
      <Pop x={700} y={1085} a={fw(t, T(11, 0.15), T(12, 0.2), 0.2, 0.3)} s={0.7 + 0.3 * p(T(11, 0.15))}>
        <PillSvg text="DIPANTAU" fill="#7c4dff" size={36} />
      </Pop>
      {/* 12: plat tercatat */}
      <g opacity={fw(t, T(12, 0.0), T(12, 0.62), 0.05, 0.1)}>
        <Plate x={flyPos[0] - 60} y={flyPos[1] - 20} w={120} fs={18} />
      </g>
      <Pop x={330} y={1768} a={fw(t, T(12, 0.3), T(13, 0.2), 0.2, 0.3)} s={0.7 + 0.3 * p(T(12, 0.3))}>
        <PillSvg text="TERCATAT" fill="#2faa4a" size={30} />
      </Pop>
      {/* 13: beberapa daerah */}
      <Pop x={540} y={330} a={fw(t, T(13, 0.1), T(14, 0.3), 0.2, 0.3)} s={0.7 + 0.3 * p(T(13, 0.1))}>
        <PillSvg text="DI BEBERAPA DAERAH" fill="#ffffff" color={K} size={36} />
      </Pop>
      {[300, 540, 780].map((x, i) => (
        <Pop key={`pin${i}`} x={x} y={i === 1 ? 560 : 640} a={fw(t, T(13, 0.2 + i * 0.28), T(14, 0.3), 0.12, 0.3)} s={0.4 + 0.6 * p(T(13, 0.2 + i * 0.28), 0.4)}>
          <Pin />
        </Pop>
      ))}
      {/* 14: sekali sehari */}
      <Pop x={STOP_X + 10} y={480} a={fw(t, T(14, 0.1), T(15, 0.1), 0.2, 0.3)} s={0.5 + 0.5 * p(T(14, 0.1), 0.45)} rot={wob * 0.5}>
        <rect x={-84} y={-84} width={168} height={168} rx={18} fill="#fff" stroke={K} strokeWidth={7} />
        <rect x={-84} y={-84} width={168} height={46} rx={18} fill="#d92d2d" stroke={K} strokeWidth={7} />
        <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={82} fill={K}>
          1×
        </text>
        <text x={0} y={-48} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill="#fff">
          SEHARI
        </text>
      </Pop>
      {/* 15: isian ke-3 */}
      {[
        {x: 450, label: '1', fill: '#e8e8e8', r: 38},
        {x: 530, label: '2', fill: '#e8e8e8', r: 38},
        {x: 640, label: '3', fill: '#ff7a7a', r: 58},
      ].map((b, i) => (
        <Pop key={`isi${i}`} x={b.x} y={470} a={fw(t, T(15, 0.05 + i * 0.1), T(16, 0.2), 0.1, 0.3)} s={0.5 + 0.5 * p(T(15, 0.05 + i * 0.1))}>
          <Badge label={b.label} fill={b.fill} r={b.r} fs={Math.round(b.r * 0.9)} />
        </Pop>
      ))}
      {/* 16: curiga */}
      <Pop x={petugasX - 40} y={620} a={fw(t, T(16, 0.1), T(17, 0.1), 0.15, 0.2)} s={0.5 + 0.5 * p(T(16, 0.1))} rot={wob}>
        <text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#ffd23f" stroke={K} strokeWidth={12} paintOrder="stroke">
          ?
        </text>
      </Pop>
      <Pop x={petugasX - 130 + Math.sin(t * 4) * 12} y={860} a={fw(t, T(16, 0.2), T(17, 0.2), 0.15, 0.2)} s={0.8}>
        <Magnifier />
      </Pop>
      {/* 17: ditolak */}
      <Pop x={petugasX - 110} y={500} a={fw(t, T(17, 0.2), T(18, 0.2), 0.1, 0.25)} s={0.5 + 0.5 * p(T(17, 0.2), 0.4)}>
        <Shield />
      </Pop>
      <Pop x={560} y={640} a={fw(t, T(17, 0.25), T(18, 0.2), 0.05, 0.25)} s={1 + 1.2 * Math.max(0, 1 - (t - T(17, 0.25)) / 0.14) ** 2} rot={-10}>
        <Stamp text="DITOLAK" fs={64} />
      </Pop>
      {/* 20: seperlunya */}
      <Pop x={560} y={470} a={fw(t, T(20, 0.5), T(21, 0.1), 0.15, 0.3)} s={0.5 + 0.5 * p(T(20, 0.5), 0.4)}>
        <CheckBadge />
      </Pop>
      <Pop x={560} y={560} a={fw(t, T(20, 0.7), T(21, 0.1), 0.15, 0.3)} s={0.7 + 0.3 * p(T(20, 0.7))}>
        <PillSvg text="SEPERLUNYA" fill="#2faa4a" size={36} />
      </Pop>
      {/* 21: jangan menimbun */}
      <Pop x={250} y={880} a={fw(t, T(21, 0.15), T(22, 0.1), 0.15, 0.3)} s={0.5 + 0.5 * p(T(21, 0.15), 0.4)} rot={wob}>
        <Jerigen />
      </Pop>
      <Pop x={300} y={740} a={fw(t, T(21, 0.3), T(22, 0.1), 0.15, 0.3)} s={0.7 + 0.3 * p(T(21, 0.3))}>
        <PillSvg text="NGGAK NIMBUN" fill="#d92d2d" size={36} />
      </Pop>
      {/* 22: kilau penutup */}
      {[0, 1, 2, 3, 4].map((i) => {
        const st = T(22, 0.1) + i * 0.35;
        const sx = 380 + i * 90;
        const sy = 520 + Math.sin(i * 2.3) * 70;
        return (
          <Pop key={`sp${i}`} x={sx} y={sy - prog(t, st, 1.2) * 40} a={fw(t, st, st + 1.2, 0.15, 0.5)} s={0.6 + 0.4 * Math.sin(t * 5 + i)} rot={t * 40}>
            <Sparkle />
          </Pop>
        );
      })}
    </g>
  );
};

const Banner: React.FC<{lines: string[]; a: number; s: number; rot: number; top: number; size?: number}> = ({lines, a, s, rot, top, size = 128}) =>
  a <= 0.01 ? null : (
    <div
      style={{
        position: 'absolute',
        left: 0,
        width: 1080,
        top,
        textAlign: 'center',
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: a,
        fontFamily: FONT,
        fontWeight: 900,
        lineHeight: 1.0,
      }}
    >
      {lines.map((ln, i) => (
        <div
          key={ln}
          style={{
            fontSize: i === 0 ? size : Math.round(size * 0.78),
            color: i === 0 ? '#ffd23f' : '#ffffff',
            WebkitTextStroke: '14px #141414',
            paintOrder: 'stroke fill',
            textShadow: '0 10px 0 #141414',
          }}
        >
          {ln}
        </div>
      ))}
    </div>
  );

/** Teks layar (bukan bagian dunia): punchline, penegas, dan end card. */
export const ScreenOverlays: React.FC<{d: Direction}> = ({d}) => {
  const {t, T} = d;
  const bannerA = fw(t, T(7, 0.0), T(8, 0.0), 0.12, 0.25);
  const bannerS = 0.5 + 0.5 * easeOutBack((t - T(7, 0.0)) / 0.4);
  const wallA = fw(t, T(19, 0.25), T(20, 0.0), 0.2, 0.3);
  const wallS = 0.6 + 0.4 * easeOutBack((t - T(19, 0.25)) / 0.4);
  const endU = clamp((t - T(22, 0.25)) / 0.5, 0, 1);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
      <Banner lines={['MARI KITA', 'GARAP!']} a={bannerA} s={bannerS} rot={-4} top={300} size={150} />
      <Banner lines={['RATUSAN RIBU', 'DIBLOKIR']} a={wallA} s={wallS} rot={-3} top={260} size={112} />
      {endU > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 560,
            width: 860,
            padding: '44px 40px 40px',
            textAlign: 'center',
            background: '#fff7e0',
            border: '10px solid #141414',
            borderRadius: 44,
            boxShadow: '14px 14px 0 #141414',
            transform: `scale(${0.6 + 0.4 * easeOutBack(endU)}) rotate(${-2 + 2 * ease(endU)}deg)`,
            opacity: clamp(endU * 3, 0, 1),
            fontFamily: FONT,
          }}
        >
          <div style={{fontSize: 92, fontWeight: 900, color: '#1d6f77', WebkitTextStroke: '3px #141414', paintOrder: 'stroke fill'}}>@marigarap.id</div>
          <div style={{fontSize: 40, fontWeight: 900, color: '#141414', marginTop: 12}}>TIPS LAINNYA MENUNGGU!</div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 28,
              padding: '16px 76px',
              borderRadius: 60,
              background: '#ffd23f',
              border: '9px solid #141414',
              fontSize: 60,
              fontWeight: 900,
              color: '#141414',
              transform: `scale(${1 + 0.05 * Math.sin(t * 6)})`,
            }}
          >
            IKUTI
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** Subtitle komik: kata yang sedang diucapkan disorot hijau (perkiraan per kata dari durasi SRT). */
export const Subtitles: React.FC<{t: number; timing: Timing}> = ({t, timing}) => {
  const sc = timing.scenes.find((s) => t >= s.start - 0.04 && t <= s.end + 0.18);
  if (!sc) return null;
  const words = sc.subtitle.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return null;
  const weights = words.map((w) => w.length + 1.5);
  const total = weights.reduce((a, b) => a + b, 0);
  const u = clamp((t - sc.start) / Math.max(0.2, sc.end - sc.start), 0, 0.9999);
  let acc = 0;
  let cur = words.length - 1;
  for (let i = 0; i < words.length; i++) {
    acc += weights[i] / total;
    if (u < acc) {
      cur = i;
      break;
    }
  }
  const a = Math.min(1, (t - (sc.start - 0.04)) / 0.12, (sc.end + 0.18 - t) / 0.15);
  const pop = 0.92 + 0.08 * easeOutBack((t - sc.start) / 0.2);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        width: 920,
        top: 1360,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: clamp(a, 0, 1),
        transform: `scale(${pop})`,
      }}
    >
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.32}}>
        {words.map((w, i) => (
          <span
            key={`${sc.id}-${i}`}
            style={
              i === cur
                ? {
                    display: 'inline-block',
                    margin: '0 6px',
                    padding: '0 16px',
                    borderRadius: 16,
                    background: '#43d11a',
                    color: '#0b0b0b',
                    border: '5px solid #141414',
                  }
                : {
                    display: 'inline-block',
                    margin: '0 10px',
                    color: '#ffffff',
                    WebkitTextStroke: '11px #141414',
                    paintOrder: 'stroke fill',
                  }
            }
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

