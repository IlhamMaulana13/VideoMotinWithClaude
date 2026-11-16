# Sintesis musik latar + SFX (numpy). Opsional: file .wav hasilnya sudah ada di public/audio/.
# Jalankan:  python3 scripts/make-audio.py
import numpy as np, wave, os
SR = 32000
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
os.makedirs(OUT, exist_ok=True)
rs = np.random.RandomState(7)

def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())

def T(d): return np.arange(int(d * SR)) / SR
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode='same')
def env_ad(t, a, d): return np.minimum(1, t / a) * np.exp(-t / d)

# ---------- SFX ----------
t = T(0.14); save('pop.wav', np.sin(2*np.pi*np.cumsum(420 + 700*t/0.14)/SR) * np.exp(-t*30))
t = T(0.5); n = rs.randn(len(t)); save('whoosh.wav', (lp(n,6) - lp(n,160)) * np.sin(np.pi*t/0.5)**2)
t = T(0.6); f = 38 + 50*np.exp(-t*18); save('thud.wav', np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*8) + lp(rs.randn(len(t)),30)*np.exp(-t*70))
t = T(0.7); save('ding.wav', (np.sin(2*np.pi*880*t) + 0.5*np.sin(2*np.pi*1320*t) + 0.2*np.sin(2*np.pi*2640*t)) * np.exp(-t*7))
t = T(0.3); save('coin.wav', np.where(t < 0.08, np.sin(2*np.pi*1250*t), np.sin(2*np.pi*1850*t)) * np.exp(-t*10))
t = T(0.07); save('blip.wav', np.sign(np.sin(2*np.pi*1500*t)) * 0.4 * np.exp(-t*45) + np.sin(2*np.pi*1500*t)*0.3*np.exp(-t*45))
t = T(0.45); save('buzz.wav', (np.sign(np.sin(2*np.pi*95*t))*0.5 + np.sin(2*np.pi*190*t)*0.3 + rs.randn(len(t))*0.08) * np.exp(-t*5))
t = T(0.7); f = 34 + 56*np.exp(-t*22); x = np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7); x[:int(0.02*SR)] += rs.randn(int(0.02*SR))*0.8; save('stamp.wav', x)
t = T(0.6); x = np.zeros(len(t))
for i, fr in enumerate([1568, 1976, 2349, 2794]):
    s = int(i*0.07*SR); tt = t[:len(t)-s]; x[s:] += np.sin(2*np.pi*fr*tt) * np.exp(-tt*9)
save('sparkle.wav', x)
# mesin motor: loop 1 detik (frekuensi bilangan bulat -> mulus saat diulang)
t = T(1.0); sig = np.zeros(len(t))
for k in range(1, 7): sig += np.sin(2*np.pi*(48*k)*t) / k
sig *= 0.6 + 0.4*np.sin(2*np.pi*12*t); sig += lp(rs.randn(len(t)), 12) * 0.25
save('engine.wav', sig, 0.6)

# ---------- Musik latar lembut (C - Am - F - G, 96 bpm) ----------
bpm = 96; beat = 60.0 / bpm; dur = 52.0
t = T(dur); music = np.zeros(len(t))
chords = [[261.63, 329.63, 392.00], [220.00, 261.63, 329.63], [174.61, 220.00, 261.63], [196.00, 246.94, 293.66]]
bar = 4 * beat; nbar = int(dur / bar) + 1
def add(start, sig):
    s = int(start * SR); e = min(len(music), s + len(sig))
    if s < len(music): music[s:e] += sig[:e - s]
for b in range(nbar):
    ch = chords[b % 4]; st = b * bar
    tt = T(bar + 0.6)
    pad = sum(np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2*f*tt) for f in ch) * (np.minimum(1, tt/0.5) * np.minimum(1, (bar + 0.6 - tt)/0.6)) * 0.10
    add(st, pad)
    for k in (0, 2):                                  # bass di ketukan 1 & 3
        tb = T(beat * 1.8); add(st + k*beat, np.sin(2*np.pi*(ch[0]/2)*tb) * env_ad(tb, 0.01, 0.35) * 0.30)
    scale = [ch[0]*2, ch[1]*2, ch[2]*2, ch[1]*4, ch[0]*4]      # pluck marimba lembut
    for k in range(8):
        if rs.rand() < 0.62:
            f = scale[rs.randint(len(scale))]; tp = T(0.6)
            add(st + k*beat/2, (np.sin(2*np.pi*f*tp) + 0.3*np.sin(2*np.pi*3*f*tp)) * env_ad(tp, 0.004, 0.16) * 0.11)
    for k in range(4):                                # shaker sangat tipis
        ts = T(0.05); add(st + k*beat + beat/2, lp(rs.randn(len(ts)), 3) * np.exp(-ts*70) * 0.03)
fade = np.minimum(1, t/1.5) * np.minimum(1, (dur - t)/2.5)
save('music.wav', music * fade, 0.8)
print('audio selesai ->', sorted(os.listdir(OUT)))
