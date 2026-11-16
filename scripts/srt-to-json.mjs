// Mengisi public/timing.json dari public/narasi.srt (satu entri SRT = satu adegan).
// Pakai:  npm run timing
//         node scripts/srt-to-json.mjs --audio=48.509375
// Kolom "subtitle" boleh diedit manual (huruf besar, tanda baca); nilainya dipertahankan
// selama teks SRT di adegan itu tidak berubah.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srtPath = path.join(root, 'public', 'narasi.srt');
const jsonPath = path.join(root, 'public', 'timing.json');

const toSec = (s) => {
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) throw new Error('Format waktu SRT tidak dikenali: ' + s);
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, '0')) / 1000;
};

const old = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8')) : null;
const audioArg = process.argv.find((a) => a.startsWith('--audio='));
const blocks = fs.readFileSync(srtPath, 'utf8').replace(/\r/g, '').trim().split(/\n\s*\n/);

const scenes = blocks.map((blk, i) => {
  const lines = blk.split('\n');
  const [a, b] = lines[1].split('-->');
  const text = lines.slice(2).join(' ').trim();
  const prev = old && old.scenes && old.scenes[i] && old.scenes[i].text === text ? old.scenes[i].subtitle : '';
  return {
    id: Number(lines[0]),
    start: toSec(a),
    end: toSec(b),
    text,
    subtitle: prev || text.charAt(0).toUpperCase() + text.slice(1),
  };
});

const out = {
  fps: 30,
  audioFile: 'narasi.mp3',
  audioDuration: audioArg ? Number(audioArg.split('=')[1]) : old ? old.audioDuration : scenes[scenes.length - 1].end,
  tailSeconds: old ? old.tailSeconds : 1,
  scenes,
};
fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));
console.log('timing.json ditulis: ' + scenes.length + ' adegan, audio ' + out.audioDuration + ' dtk');
