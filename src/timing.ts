export type SceneTiming = {
  id: number;
  start: number; // detik, dari SRT
  end: number; // detik, dari SRT
  text: string; // teks SRT asli
  subtitle: string; // teks yang ditampilkan (boleh diedit)
};

export type Timing = {
  fps: number;
  audioFile: string;
  audioDuration: number;
  tailSeconds: number;
  scenes: SceneTiming[];
};

/** Awal tiap adegan: adegan pertama selalu mulai di 0, sisanya mengikuti SRT. */
export const sceneStarts = (tm: Timing): number[] => tm.scenes.map((s, i) => (i === 0 ? 0 : s.start));

/** Durasi total = durasi narasi + ekor (default 1 detik). */
export const totalSeconds = (tm: Timing): number => tm.audioDuration + tm.tailSeconds;

export const sceneIndexAt = (starts: number[], t: number): number => {
  let k = 0;
  for (let i = 0; i < starts.length; i++) {
    if (t >= starts[i]) k = i;
  }
  return k;
};
