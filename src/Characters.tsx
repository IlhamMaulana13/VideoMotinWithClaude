import React from 'react';
import {Expr} from './director';
import {INK} from './world';

const SK = '#e9b98c';
const SK_DARK = '#d29f72';
const K = INK;

const line = {
  stroke: K,
  strokeWidth: 5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

/** Wajah minimalis (mata & mulut garis). Pusat di (0,0); lebar sekitar 90. */
export const Face: React.FC<{expr: Expr; blink: boolean; mouthDy?: number; browColor?: string}> = ({
  expr,
  blink,
  mouthDy = 0,
  browColor = '#2a2a2a',
}) => {
  const my = 24 + mouthDy;
  const brow = {stroke: browColor, strokeWidth: 6, strokeLinecap: 'round' as const, fill: 'none'};
  if (expr === 'senang') {
    return (
      <g>
        <path d="M-27,-3 Q-17,-17 -7,-3" {...line} />
        <path d="M7,-3 Q17,-17 27,-3" {...line} />
        <path d={`M-17,${my - 8} Q0,${my + 14} 17,${my - 8}`} {...line} />
      </g>
    );
  }
  if (expr === 'sedih') {
    return (
      <g>
        <path d="M-32,-14 L-9,-24" {...brow} />
        <path d="M9,-24 L32,-14" {...brow} />
        {blink ? (
          <g>
            <path d="M-24,-2 L-10,-2" {...line} />
            <path d="M10,-2 L24,-2" {...line} />
          </g>
        ) : (
          <g>
            <circle cx={-17} cy={-2} r={4.5} fill={K} />
            <circle cx={17} cy={-2} r={4.5} fill={K} />
          </g>
        )}
        <path d={`M-14,${my + 6} Q0,${my - 8} 14,${my + 6}`} {...line} />
      </g>
    );
  }
  if (expr === 'kaget') {
    return (
      <g>
        <path d="M-30,-26 Q-17,-36 -5,-26" {...brow} />
        <path d="M5,-26 Q17,-36 30,-26" {...brow} />
        <circle cx={-17} cy={-6} r={10} fill="#fff" stroke={K} strokeWidth={4} />
        <circle cx={17} cy={-6} r={10} fill="#fff" stroke={K} strokeWidth={4} />
        <circle cx={-17} cy={-6} r={3.6} fill={K} />
        <circle cx={17} cy={-6} r={3.6} fill={K} />
        <ellipse cx={0} cy={my + 2} rx={9} ry={12} fill="#5a1d1d" stroke={K} strokeWidth={4} />
      </g>
    );
  }
  if (expr === 'tekad') {
    return (
      <g>
        <path d="M-33,-22 L-8,-9" {...brow} />
        <path d="M8,-9 L33,-22" {...brow} />
        {blink ? (
          <g>
            <path d="M-24,0 L-10,0" {...line} />
            <path d="M10,0 L24,0" {...line} />
          </g>
        ) : (
          <g>
            <circle cx={-17} cy={0} r={4.5} fill={K} />
            <circle cx={17} cy={0} r={4.5} fill={K} />
          </g>
        )}
        <path d={`M-13,${my} L13,${my}`} {...line} />
      </g>
    );
  }
  return (
    <g>
      {blink ? (
        <g>
          <path d="M-24,-2 L-10,-2" {...line} />
          <path d="M10,-2 L24,-2" {...line} />
        </g>
      ) : (
        <g>
          <circle cx={-17} cy={-2} r={4.5} fill={K} />
          <circle cx={17} cy={-2} r={4.5} fill={K} />
        </g>
      )}
      <path d={`M-10,${my} L10,${my}`} {...line} />
    </g>
  );
};

/** Lengan tebal dengan outline (garis hitam di bawah, warna kulit di atas). */
const Limb: React.FC<{d: string; w?: number; color?: string}> = ({d, w = 22, color = SK}) => (
  <g>
    <path d={d} stroke={K} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>
);

export type MotorProps = {
  wheelDeg: number;
  tankScale: number;
  children?: React.ReactNode;
};

/** Motor bertangki besar, menghadap kanan, titik (0,0) = tanah di antara roda. */
export const Motor: React.FC<MotorProps> = ({wheelDeg, tankScale, children}) => {
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} -62) rotate(${wheelDeg})`}>
      <circle r={62} fill="#2b2b2b" stroke={K} strokeWidth={6} />
      <circle r={38} fill="#cfd4d9" stroke={K} strokeWidth={5} />
      {[0, 45, 90, 135].map((a) => (
        <line key={a} x1={0} y1={-36} x2={0} y2={36} transform={`rotate(${a})`} stroke={K} strokeWidth={4} />
      ))}
      <circle r={9} fill="#6b6b6b" stroke={K} strokeWidth={4} />
    </g>
  );
  return (
    <g>
      {/* knalpot */}
      <path d="M20,-84 L-170,-76 L-176,-92 L20,-100 Z" fill="#b8bec5" stroke={K} strokeWidth={5} strokeLinejoin="round" />
      {wheel(-115)}
      {wheel(125)}
      {/* suspensi depan & lengan ayun */}
      <path d="M150,-176 L128,-66" stroke={K} strokeWidth={20} strokeLinecap="round" />
      <path d="M150,-176 L128,-66" stroke="#9aa3ad" strokeWidth={10} strokeLinecap="round" />
      <path d="M-115,-62 L-20,-108" stroke={K} strokeWidth={16} strokeLinecap="round" />
      {/* mesin */}
      <rect x={-28} y={-132} width={118} height={62} rx={14} fill="#6e7781" stroke={K} strokeWidth={6} />
      <rect x={-6} y={-122} width={70} height={14} rx={5} fill="#8b95a0" stroke={K} strokeWidth={3} />
      {/* spakbor belakang, lampu belakang, jok */}
      <path d="M-175,-128 Q-120,-168 -66,-122 L-80,-110 Q-120,-142 -168,-112 Z" fill="#b01e1e" stroke={K} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-188} y={-148} width={16} height={22} rx={5} fill="#ff5252" stroke={K} strokeWidth={4} />
      <rect x={-128} y={-168} width={118} height={26} rx={13} fill="#2e2e2e" stroke={K} strokeWidth={5} />
      {/* TANGKI BESAR */}
      <g transform={`translate(35 -196) scale(${tankScale})`}>
        <ellipse cx={0} cy={0} rx={112} ry={62} fill="#d32f2f" stroke={K} strokeWidth={7} />
        <path d="M-84,-26 Q-10,-62 76,-30" stroke="#ff8a80" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.85} />
        <ellipse cx={26} cy={-52} rx={20} ry={8} fill="#cfd4d9" stroke={K} strokeWidth={4} />
        <rect x={-60} y={14} width={78} height={14} rx={7} fill="#fff" opacity={0.85} />
      </g>
      {/* lampu depan, stang */}
      <circle cx={158} cy={-182} r={24} fill="#fff7c2" stroke={K} strokeWidth={6} />
      <path d="M118,-248 L168,-258" stroke={K} strokeWidth={13} strokeLinecap="round" />
      <path d="M130,-244 L132,-196" stroke={K} strokeWidth={12} strokeLinecap="round" />
      {/* pengendara duduk di jok */}
      <g transform="translate(-52 -166)">{children}</g>
    </g>
  );
};

/** Kakek pengendara: kumis putih, kaos oblong, sarung, tanpa caping. Titik (0,0) = pinggul. */
export const KakekRider: React.FC<{expr: Expr; gesture: number; t: number}> = ({expr, gesture, t}) => {
  const blink = (t * 30) % 110 < 4;
  const wave = Math.sin(t * 11) * 16;
  const wag = Math.sin(t * 15) * 26;
  const handleArm = 'M20,-100 Q112,-26 176,-72';
  const farArm = 'M6,-104 Q90,-8 166,-64';
  let freeArm = handleArm;
  let hand: React.ReactNode = null;
  if (gesture === 1) {
    freeArm = `M20,-100 Q92,-128 ${84 + wave},-206`;
    hand = (
      <g transform={`translate(${84 + wave} -218)`}>
        <circle r={21} fill={SK} stroke={K} strokeWidth={5} />
        {[-12, -4, 4, 12].map((dx) => (
          <path key={dx} d={`M${dx},-14 L${dx * 1.3},-34`} stroke={K} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    );
  } else if (gesture === 2 || gesture === 4) {
    freeArm = 'M20,-100 Q86,-120 90,-182';
    const rot = gesture === 4 ? wag : 0;
    hand = (
      <g transform={`translate(90 -194) rotate(${rot} 0 18)`}>
        <rect x={-7} y={-52} width={14} height={50} rx={7} fill={SK} stroke={K} strokeWidth={5} />
        <circle r={19} fill={SK} stroke={K} strokeWidth={5} />
      </g>
    );
  }
  return (
    <g>
      {/* lengan jauh (ke stang) */}
      <Limb d={farArm} w={20} color={SK_DARK} />
      {/* betis & sandal */}
      <Limb d="M82,46 L66,118" w={20} />
      <ellipse cx={72} cy={128} rx={28} ry={10} fill="#5b3a1e" stroke={K} strokeWidth={5} />
      {/* sarung (paha) */}
      <defs>
        <pattern id="sarongPat" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#1f6fb0" />
          <rect width="13" height="13" fill="#2e8bd6" />
          <rect x="13" y="13" width="13" height="13" fill="#2e8bd6" />
          <path d="M0 13H26M13 0V26" stroke="#e9f4ff" strokeWidth="2" opacity="0.6" />
        </pattern>
      </defs>
      <path d="M-46,-8 L56,-12 L104,32 L84,80 L-32,66 Z" fill="url(#sarongPat)" stroke={K} strokeWidth={6} strokeLinejoin="round" />
      {/* kaos oblong */}
      <g transform="rotate(5 0 0)">
        <path d="M-36,0 C-48,-50 -38,-92 -22,-120 L42,-120 C54,-88 50,-40 38,0 Z" fill="#f4efe3" stroke={K} strokeWidth={6} strokeLinejoin="round" />
        <path d="M-12,-120 Q10,-90 32,-120 Z" fill={SK} stroke={K} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-6,-20 Q8,-12 22,-20" stroke="#cfc6b0" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      {/* lengan bebas */}
      <Limb d={freeArm} w={22} />
      {hand}
      {gesture === 0 || gesture === 3 ? <circle cx={176} cy={-72} r={15} fill={SK} stroke={K} strokeWidth={5} /> : null}
      {/* kepala */}
      <g transform="translate(14 -172)">
        <ellipse cx={-45} cy={4} rx={9} ry={12} fill={SK} stroke={K} strokeWidth={4} />
        <ellipse cx={45} cy={4} rx={9} ry={12} fill={SK} stroke={K} strokeWidth={4} />
        <circle r={46} fill={SK} stroke={K} strokeWidth={6} />
        <path d="M-44,-18 Q-58,-26 -50,-42 Q-40,-34 -38,-24 Z" fill="#fff" stroke={K} strokeWidth={4} strokeLinejoin="round" />
        <path d="M44,-18 Q58,-26 50,-42 Q40,-34 38,-24 Z" fill="#fff" stroke={K} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-22,-44 Q0,-54 22,-44" stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none" />
        <Face expr={expr} blink={blink} mouthDy={12} browColor="#6b6b6b" />
        <circle cx={0} cy={8} r={7} fill={SK_DARK} stroke={K} strokeWidth={3} />
        <path
          d="M-32,18 Q-16,6 0,16 Q16,6 32,18 Q18,32 0,24 Q-18,32 -32,18 Z"
          fill="#fff"
          stroke={K}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
};

/** Petugas SPBU berdiri menghadap kiri. Titik (0,0) = tapak kaki. */
export const Petugas: React.FC<{expr: Expr; gesture: number; t: number}> = ({expr, gesture, t}) => {
  const blink = (t * 30 + 40) % 120 < 4;
  const lean = gesture === 2 ? -5 : 0;
  const scan = (t * 1.6) % 1;
  const devY = gesture === 2 ? -214 : -190;
  const handY = gesture === 2 ? -172 : -150;
  return (
    <g transform={`rotate(${lean} 0 0)`}>
      {/* kaki & sepatu */}
      <rect x={-27} y={-104} width={26} height={98} rx={6} fill="#2b2b3a" stroke={K} strokeWidth={5} />
      <rect x={1} y={-104} width={26} height={98} rx={6} fill="#2b2b3a" stroke={K} strokeWidth={5} />
      <ellipse cx={-22} cy={-4} rx={22} ry={9} fill="#1c1c1c" stroke={K} strokeWidth={4} />
      <ellipse cx={22} cy={-4} rx={22} ry={9} fill="#1c1c1c" stroke={K} strokeWidth={4} />
      {/* lengan jauh (telapak stop) */}
      {gesture === 1 ? (
        <g>
          <Limb d="M34,-196 Q74,-250 64,-300" w={20} />
          <g transform="translate(64 -314)">
            <circle r={26} fill={SK} stroke={K} strokeWidth={5} />
            {[-14, -5, 5, 14].map((dx) => (
              <path key={dx} d={`M${dx},-18 L${dx * 1.2},-40`} stroke={K} strokeWidth={6} strokeLinecap="round" />
            ))}
          </g>
        </g>
      ) : (
        <Limb d="M34,-196 Q52,-150 40,-112" w={20} />
      )}
      {/* badan */}
      <path d="M-46,-104 L-44,-206 Q0,-224 44,-206 L46,-104 Z" fill="#d92d2d" stroke={K} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-18,-214 L0,-190 L18,-214 Z" fill="#fff" stroke={K} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-48} y={-112} width={96} height={14} fill="#1c1c1c" stroke={K} strokeWidth={4} />
      <rect x={14} y={-178} width={24} height={13} rx={3} fill="#fff" stroke={K} strokeWidth={3} />
      {/* lengan dekat memegang EDC */}
      <Limb d={`M-34,-198 Q-84,-190 -94,${handY}`} w={20} />
      <g transform={`translate(-98 ${devY})`}>
        <rect x={-24} y={-34} width={48} height={70} rx={9} fill="#222" stroke={K} strokeWidth={5} />
        <rect x={-17} y={-26} width={34} height={36} rx={4} fill="#7be495" stroke={K} strokeWidth={3} />
        <rect x={-17} y={-26 + scan * 32} width={34} height={4} fill="#d8ffe3" opacity={0.9} />
        <circle cx={0} cy={24} r={5} fill="#ff5a5a" stroke={K} strokeWidth={2} />
      </g>
      <circle cx={-94} cy={handY} r={13} fill={SK} stroke={K} strokeWidth={4} />
      {/* kepala + topi */}
      <g transform="translate(0 -262)">
        <circle r={42} fill="#e8b48a" stroke={K} strokeWidth={6} />
        <path d="M-44,-8 Q0,-70 44,-8 Z" fill="#d92d2d" stroke={K} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-46,-8 L-88,-2 Q-90,10 -46,6 Z" fill="#a31f1f" stroke={K} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={-34} r={9} fill="#fff" stroke={K} strokeWidth={3} />
        <g transform="translate(0 6) scale(0.9)">
          <Face expr={expr} blink={blink} />
        </g>
      </g>
    </g>
  );
};
