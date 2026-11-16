import React from 'react';
import {CalculateMetadataFunction, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import timingJson from '../public/timing.json';
import {Story, StoryProps} from './Story';
import {Timing, totalSeconds} from './timing';

const FPS = 30;
const defaultTiming = timingJson as unknown as Timing;

/**
 * Durasi = durasi narasi + tailSeconds (default 1 detik).
 * - Timing adegan dibaca LANGSUNG dari public/timing.json (bukan dari bundle),
 *   jadi cukup edit file itu lalu refresh Studio / render ulang.
 * - narasi.mp3 hanya dipakai untuk membaca durasinya (dan diputar apa adanya).
 */
const calculate: CalculateMetadataFunction<StoryProps> = async ({props}) => {
  let timing: Timing = props.timing;
  try {
    const res = await fetch(staticFile('timing.json'));
    if (res.ok) timing = (await res.json()) as Timing;
  } catch (e) {
    // pakai timing bawaan bundle bila fetch gagal
  }
  let audioSec = timing.audioDuration;
  try {
    audioSec = await getAudioDurationInSeconds(staticFile(timing.audioFile));
  } catch (e) {
    // pakai audioDuration dari timing.json bila durasi tak terbaca
  }
  const next: Timing = {...timing, audioDuration: audioSec};
  return {
    durationInFrames: Math.max(1, Math.ceil(totalSeconds(next) * FPS)),
    props: {timing: next},
  };
};

export const Root: React.FC = () => (
  <Composition
    id="BangRio"
    component={Story}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={Math.ceil(totalSeconds(defaultTiming) * FPS)}
    defaultProps={{timing: defaultTiming}}
    calculateMetadata={calculate}
  />
);
