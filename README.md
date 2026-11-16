# Bang Rio dan Aturan Isi BBM Subsidi — animasi Remotion 9:16

Animasi cerita 2D vektor datar (SVG) 1080×1920, 30 fps. Satu dunia penampang: langit, permukaan (SPBU),
bawah tanah (tangki, kabel data, ruang data). Satu entri SRT = satu adegan (23 adegan).
Narasi, musik lembut, dan SFX sudah masuk komposisi, jadi satu perintah render menghasilkan MP4 bersuara.

## Cara pakai

Butuh Node.js 18+ (Chrome untuk render diunduh Remotion otomatis saat pertama kali).

```bash
npm install
npm run render      # hasil: out/bang-rio.mp4
```

Pratinjau/atur di Studio: `npm start`.
Cek tipe: `npm run typecheck` (= `npx tsc --noEmit`).

Bila ada peringatan versi paket Remotion tidak sama, jalankan `npx remotion upgrade` agar semuanya sejajar.

## Menyetel timing

- Semua timing adegan dibaca dari **`public/timing.json`** saat Studio/render dimulai (lewat `calculateMetadata`),
  jadi cukup edit file itu lalu muat ulang Studio.
  - `scenes[i].start` = awal adegan (detik). Adegan pertama selalu mulai dari 0.
  - `scenes[i].end` = akhir kalimat; dipakai untuk menyorot kata di subtitle.
  - `scenes[i].subtitle` = teks yang tampil (boleh diedit bebas).
  - `tailSeconds` = ekor setelah narasi (default 1 detik).
- Durasi video = durasi `narasi.mp3` (dibaca otomatis) + `tailSeconds`. Sekarang: 48,509 + 1 = 49,509 dtk = 1486 frame.
- Mengisi ulang dari SRT: letakkan SRT baru di `public/narasi.srt`, lalu `npm run timing`
  (subtitle yang sudah Anda edit dipertahankan selama teks SRT adegan itu sama).
  Jumlah adegan boleh berubah, tapi pengaturan per adegan di `src/director.ts` (indeks adegan) perlu disesuaikan.

## Di mana mengubah apa

| Ingin ubah | File |
|---|---|
| Kamera per adegan (x, y, zoom) | `src/director.ts` → `CAM` |
| Waktu hari (subuh→malam) & hujan | `src/director.ts` → `TOD` |
| Jalur motor / kapan nozzle terpasang | `src/director.ts` → `buildPlan` |
| Ekspresi tokoh (senang, sedih, kaget, tekad, netral) | `src/director.ts` → `KAKEK_EXPR`, `PET_EXPR` |
| Ikon, label, stempel per adegan | `src/Overlays.tsx` → `WorldOverlays` |
| Tokoh & motor | `src/Characters.tsx` |
| Langit, tanah, SPBU, tangki | `src/Scenery.tsx` |
| Kabel data, ruang data, plat | `src/Underground.tsx` |
| Posisi/jenis SFX | `src/Sound.tsx` |
| Musik & SFX (sintesis) | `scripts/make-audio.py` → hasil di `public/audio/` |

Catatan desain: tokoh utama dibuat sebagai kakek (kumis putih, kaos oblong, sarung, tanpa caping)
sesuai arahan gaya, tetap bernama "Bang Rio" mengikuti narasi. Mengganti nama cukup di narasi/subtitle.
Subtitle menyorot kata secara **perkiraan** (dibagi menurut panjang kata dalam rentang waktu SRT),
bukan penyelarasan per kata.

## Struktur

```
public/narasi.mp3, narasi.srt, naskah.txt, timing.json
public/audio/*.wav            musik + SFX hasil sintesis (tanpa sampel berhak cipta)
src/Root.tsx                  komposisi + calculateMetadata (durasi & timing.json)
src/Story.tsx                 perakit dunia, kamera, suara
src/director.ts               semua keputusan per adegan
scripts/srt-to-json.mjs       SRT -> timing.json
scripts/make-audio.py         sintesis ulang musik/SFX (opsional)
```

## Status verifikasi (jujur)

- `tsc --noEmit` lolos, tetapi dijalankan di lingkungan tanpa internet, sehingga paket `remotion`/`react`
  tidak terpasang. Pengecekan memakai file tipe pengganti yang meniru API yang dipakai (tidak ikut di zip).
  Jalankan `npm run typecheck` setelah `npm install` untuk konfirmasi dengan tipe asli.
- Uji asap tanpa gambar: 391 frame dirender ke string HTML (SSR) tanpa error, tanpa `NaN`/`Infinity`,
  dan semua 12 berkas audio yang dirujuk ada.
- Belum ada render video: tampilan akhir (komposisi, posisi teks, keterbacaan) belum pernah dilihat.
  Jika ada elemen yang terlalu besar/kecil atau bertumpuk, sesuaikan angka di `Overlays.tsx` / `director.ts`.
