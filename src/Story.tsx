import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Timing} from './timing';
import {buildPlan, direct} from './director';
import {Atmosphere, Hills, Pump, Rain, Road, Sky, Soil, StationBack, Tanks} from './Scenery';
import {Cable, DataRoom} from './Underground';
import {KakekRider, Motor, Petugas} from './Characters';
import {ScreenOverlays, Subtitles, WorldOverlays} from './Overlays';
import {SoundLayer} from './Sound';
import {INK, PUMP_L, PUMP_X, SURFACE, TANK_CAP_DX, TANK_CAP_DY} from './world';

export type StoryProps = {timing: Timing};

export const Story: React.FC<StoryProps> = ({timing}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const plan = useMemo(() => buildPlan(timing), [timing]);
  const d = direct(t, timing, plan);
  const {T} = d;

  const tankScale = d.idx === 1 ? 1 + 0.07 * Math.sin(t * 9) : 1;
  const hlX = t >= T(8) && t < T(10) ? 1 : 0;
  const hlL = t >= T(10) && t < T(11) ? 1 : 0;
  const fillL = d.nozzleOn ? 0.2 + 0.8 * ((t * 1.5) % 1) : 0.08;

  const capX = d.motorX + d.motorDir * TANK_CAP_DX;
  const capY = SURFACE + TANK_CAP_DY;
  const hose = `M${PUMP_L - 42},840 Q${(PUMP_L + capX) / 2},${Math.max(capY, 840) + 90} ${capX},${capY}`;
  const camTf = `translate(540 960) scale(${d.cam.z}) translate(${-d.cam.x} ${-d.cam.y})`;
  const motorVisible = d.motorX > -520 && d.motorX < 1600;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={camTf}>
          <Sky t={t} tod={d.tod} />
          <Hills tod={d.tod} />
          <StationBack />
          <Soil />
          <Road />
          <Tanks t={t} />
          <Cable t={t} T={T} />
          <DataRoom t={t} T={T} />
          <Pump x={PUMP_L} color="#2faa4a" hl={hlL} t={t} fill={fillL} />
          <Pump x={PUMP_X} color="#2d7fe0" hl={hlX} t={t} fill={0.15} />
          {motorVisible ? (
            <g transform={`translate(${d.motorX} ${SURFACE}) scale(${d.motorDir} 1)`}>
              <Motor wheelDeg={d.wheelDeg * d.motorDir} tankScale={tankScale}>
                <KakekRider expr={d.kakekExpr} gesture={d.gesture} t={t} />
              </Motor>
            </g>
          ) : null}
          {d.nozzleOn ? (
            <g>
              <path d={hose} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
              <path d={hose} fill="none" stroke="#3a3a3a" strokeWidth={7} strokeLinecap="round" />
              <circle cx={capX} cy={capY} r={9} fill="#2faa4a" stroke={INK} strokeWidth={4} />
            </g>
          ) : null}
          <g transform={`translate(${d.petugasX} ${SURFACE})`}>
            <Petugas expr={d.petugasExpr} gesture={d.petGesture} t={t} />
          </g>
          <Atmosphere tod={d.tod} />
          <Rain t={t} amount={d.rain} />
          <WorldOverlays d={d} />
        </g>
      </svg>
      <ScreenOverlays d={d} />
      <Subtitles t={t} timing={timing} />
      <SoundLayer timing={timing} plan={plan} fps={fps} />
    </AbsoluteFill>
  );
};
