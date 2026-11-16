import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {Plan, movingSegments} from './director';
import {Timing} from './timing';

type Ev = {sfx: string; t: number; vol: number};

const buildEvents = (plan: Plan): Ev[] => {
  const {T} = plan;
  const ev: Ev[] = [];
  const add = (sfx: string, idx: number, off: number, vol: number) => ev.push({sfx, t: T(idx, off), vol});
  [1, 4, 6, 8, 10, 11, 13, 16, 18, 20, 22].forEach((i) => add('whoosh', i, -0.12, 0.35));
  const pops: Array<[number, number]> = [
    [0, 1.3], [1, 0.15], [4, 0.1], [5, 0.0], [6, 0.1], [6, 0.8], [6, 1.45], [8, 0.2], [9, 0.2],
    [13, 0.1], [13, 0.2], [13, 0.48], [13, 0.76], [14, 0.1], [15, 0.05], [15, 0.15], [15, 0.25],
    [16, 0.1], [20, 0.5], [21, 0.15],
  ];
  pops.forEach(([i, o]) => add('pop', i, o, 0.5));
  add('coin', 4, 0.15, 0.45);
  [0.3, 0.8, 1.3].forEach((o) => add('coin', 10, o, 0.45));
  add('thud', 7, 0.05, 0.8);
  add('thud', 19, 0.25, 0.7);
  add('stamp', 17, 0.25, 0.9);
  add('stamp', 18, 0.35, 0.9);
  add('buzz', 17, 0.3, 0.45);
  [0.5, 0.85, 1.2].forEach((o) => add('blip', 11, o, 0.4));
  [0.15, 0.55, 0.95].forEach((o) => add('ding', 12, o, 0.5));
  add('sparkle', 20, 0.55, 0.4);
  add('sparkle', 22, 0.1, 0.4);
  add('sparkle', 22, 0.8, 0.35);
  return ev;
};

/** Narasi + musik lembut + SFX halus. Semua berkas ada di public/ (hasil sintesis, bukan sampel berhak cipta). */
export const SoundLayer: React.FC<{timing: Timing; plan: Plan; fps: number}> = ({timing, plan, fps}) => {
  const events = buildEvents(plan);
  const engines = movingSegments(plan);
  return (
    <>
      <Audio src={staticFile(timing.audioFile)} volume={1} />
      <Audio src={staticFile('audio/music.wav')} volume={0.2} />
      {events.map((e, i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, Math.round(e.t * fps))}>
          <Audio src={staticFile(`audio/${e.sfx}.wav`)} volume={e.vol} />
        </Sequence>
      ))}
      {engines.map(([a, b], i) => (
        <Sequence key={`eng${i}`} from={Math.max(0, Math.round(a * fps))} durationInFrames={Math.max(1, Math.round((b - a) * fps))}>
          <Audio src={staticFile('audio/engine.wav')} volume={0.11} loop />
        </Sequence>
      ))}
    </>
  );
};
