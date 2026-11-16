import React from 'react';
import {Clock} from './director';
import {easeOutBack, ease, pointOnPolyline, prog} from './utils';
import {CABLE, FONT, INK, PLATE_TEXT, ROOM} from './world';

const K = INK;

export const Plate: React.FC<{x: number; y: number; w?: number; fill?: string; text?: string; fs?: number}> = ({
  x,
  y,
  w = 150,
  fill = '#ffffff',
  text = PLATE_TEXT,
  fs = 22,
}) => {
  const h = w * 0.28;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={7} fill={fill} stroke={K} strokeWidth={4} />
      <rect x={4} y={4} width={9} height={h - 8} rx={3} fill="#2d7fe0" />
      <text x={w / 2 + 6} y={h * 0.72} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill={K}>
        {text}
      </text>
    </g>
  );
};

const TinySun: React.FC<{x: number; y: number; c: string; low?: boolean}> = ({x, y, c, low}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({length: 8}, (_, i) => (
      <line key={`r${i}`} x1={0} y1={-19} x2={0} y2={-26} stroke={c} strokeWidth={4} strokeLinecap="round" transform={`rotate(${i * 45})`} />
    ))}
    <circle r={14} fill={c} stroke={K} strokeWidth={3} />
    {low ? <rect x={-26} y={8} width={52} height={14} fill="#1b2733" /> : null}
  </g>
);

export const Cable: React.FC<{t: number; T: Clock}> = ({t, T}) => {
  const p = prog(t, T(11, 0.1), 1.2);
  const d = CABLE.map((c, i) => `${i === 0 ? 'M' : 'L'}${c[0]},${c[1]}`).join(' ');
  const packets: React.ReactNode[] = [];
  if (p > 0.02) {
    for (let i = 0; i < 3; i++) {
      const u = (((t - T(11, 0.2)) * 0.5 + i / 3) % 1 + 1) % 1;
      if (u <= p) {
        const [px, py] = pointOnPolyline(CABLE, u);
        packets.push(<circle key={`pk${i}`} cx={px} cy={py} r={10} fill="#7be495" stroke={K} strokeWidth={4} />);
      }
    }
  }
  return (
    <g>
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={K} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke="#ffcf3f" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      {packets}
    </g>
  );
};

type RoomProps = {t: number; T: Clock};

export const DataRoom: React.FC<RoomProps> = ({t, T}) => {
  const {x, y, w, h} = ROOM;
  const rowTimes = [T(12, 0.15), T(12, 0.55), T(12, 0.95)];
  const sunCols = ['#ffb36b', '#ffd23f', '#ff7a45'];
  const redP = ease((t - T(18, 0.2)) / 0.5);
  const stampP = easeOutBack((t - T(18, 0.35)) / 0.3);
  const crackP = prog(t, T(18, 0.5), 0.9);
  const crack1 = 'M300,1815 L342,1880 L312,1942 L356,2003 L326,2062 L352,2096';
  const crack2 = 'M342,1880 L430,1902 L472,1962';
  return (
    <g>
      {/* ruangan */}
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#3d4f63" stroke={K} strokeWidth={8} />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} rx={18} fill="#2f3f51" />
      <rect x={x + 14} y={2400} width={w - 28} height={46} rx={10} fill="#222d39" />
      {/* rak server */}
      {[110, 190, 270].map((rx, i) => (
        <g key={`rk${i}`}>
          <rect x={rx} y={2190} width={64} height={210} rx={8} fill="#5d6d7e" stroke={K} strokeWidth={5} />
          {Array.from({length: 6}, (_, j) => (
            <g key={`led${j}`}>
              <rect x={rx + 8} y={2204 + j * 32} width={34} height={14} rx={3} fill="#34495e" stroke={K} strokeWidth={2} />
              <circle cx={rx + 52} cy={2211 + j * 32} r={4.5} fill={Math.sin(t * 6 + i * 2 + j) > 0 ? '#7be495' : '#2e6b44'} />
            </g>
          ))}
        </g>
      ))}
      {/* monitor transaksi */}
      <rect x={124} y={1796} width={402} height={312} rx={18} fill="#1f1f24" stroke={K} strokeWidth={7} />
      <rect x={138} y={1810} width={374} height={284} rx={10} fill="#0e1a24" />
      <text x={170} y={1846} fontFamily={FONT} fontWeight={900} fontSize={24} fill="#7be495">
        TRANSAKSI
      </text>
      {rowTimes.map((rt, i) => {
        const p = ease((t - rt) / 0.35);
        const ry = 1866 + i * 72;
        return (
          <g key={`row${i}`} opacity={p} transform={`translate(${(1 - p) * 40} 0)`}>
            <rect x={152} y={ry} width={346} height={58} rx={10} fill="#ffffff" opacity={0.1} />
            <rect x={152} y={ry} width={346} height={58} rx={10} fill="#e53935" opacity={0.55 * redP} />
            <Plate x={164} y={ry + 8} w={168} fs={24} />
            <TinySun x={440} y={ry + 29} c={sunCols[i]} low={i === 2} />
          </g>
        );
      })}
      {/* retakan (tergambar bertahap) */}
      {[crack1, crack2].map((c, i) => (
        <g key={`ck${i}`}>
          <path d={c} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crackP} fill="none" stroke={K} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
          <path d={c} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crackP} fill="none" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {/* stempel DIBLOKIR */}
      {stampP > 0.01 ? (
        <g transform={`translate(325 1990) rotate(-12) scale(${stampP})`}>
          <rect x={-160} y={-44} width={320} height={88} rx={14} fill="#fff" fillOpacity={0.9} stroke="#d92d2d" strokeWidth={10} />
          <text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#d92d2d">
            DIBLOKIR
          </text>
        </g>
      ) : null}
      {/* dinding arsip */}
      <rect x={560} y={1790} width={440} height={590} rx={14} fill="#26333f" stroke={K} strokeWidth={5} />
      {Array.from({length: 56}, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const cx = 580 + col * 62;
        const cy = 1812 + row * 66;
        const p = easeOutBack((t - (T(19, 0.2) + i * 0.045)) / 0.28);
        const red = p > 0.02;
        const s = red ? 0.85 + 0.15 * Math.min(1.2, p) : 1;
        return (
          <g key={`cell${i}`} transform={`translate(${cx + 27} ${cy + 15}) scale(${s}) translate(-27 -15)`}>
            <rect x={0} y={0} width={54} height={30} rx={6} fill={red ? '#e53935' : '#dfe6ec'} stroke={K} strokeWidth={3} />
            <rect x={3} y={3} width={7} height={24} rx={2} fill={red ? '#8e1f1f' : '#2d7fe0'} />
            <line x1={16} y1={15} x2={48} y2={15} stroke={K} strokeWidth={3} opacity={0.45} strokeLinecap="round" />
            {red ? <path d="M30,4 L44,26 M44,4 L30,26" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </g>
  );
};
