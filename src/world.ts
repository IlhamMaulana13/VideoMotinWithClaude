// Koordinat dunia (satu penampang: langit, permukaan, bawah tanah). Lebar dunia = 1080.
export const SURFACE = 1000; // garis tanah
export const PUMP_L = 800; // pompa Pertalite (hijau)
export const PUMP_X = 960; // pompa Pertamax (biru)
export const STOP_X = 560; // posisi motor saat mengisi
export const TANK_CAP_DX = 60; // tutup tangki relatif ke pusat motor (menghadap kanan)
export const TANK_CAP_DY = -222;
export const WHEEL_R = 62;

export const CABLE: Array<[number, number]> = [
  [700, 1000],
  [700, 1130],
  [540, 1130],
  [540, 1740],
];
export const ROOM = {x: 60, y: 1740, w: 960, h: 720};
export const PLATE_TEXT = 'B 1234 RIO';
export const FONT = "'Arial Black','Impact','Helvetica Neue',Arial,sans-serif";
export const INK = '#141414';
