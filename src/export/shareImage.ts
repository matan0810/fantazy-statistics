/**
 * Draws a ranked table as a PNG "share card" on a canvas: no libraries, works offline.
 * The site's look in miniature: warm black under soft light, a double gold frame, a
 * gold-leaf serif title over an ornament, metal rank discs and each player's jewel colour.
 * Lays itself out right to left for Hebrew and left to right for English.
 */

export interface ImageRow {
  rank: number | null;
  name: string;
  color: string;
  sub: string;
  value: number | null;
  valueLabel: string;
  /** Small line under the value, such as the gap to first. */
  note: string | null;
  /** Bar length relative to the leader, 0–1. */
  ratio: number | null;
}

export interface ImageSpec {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  rows: ImageRow[];
  footer: string;
  rtl: boolean;
}

const W = 1080;
const PAD = 84;
const ROW = 104;
const GAP = 14;
const HEAD = 372;
const FOOT = 150;
const INK = '#0b0a08';
const IVORY = '#f2ebdd';
const MUTED = '#a69d8d';
const FAINT = '#6f675b';
const GOLD = '#d4b06a';
const MEDAL: Record<number, string> = { 1: '#d4b06a', 2: '#c9ccd3', 3: '#c48a5a' };
const METAL: Record<number, [string, string, string]> = {
  1: ['#f6e4b4', '#d4b06a', '#8f6b2e'],
  2: ['#f4f5f7', '#c3c7cf', '#80858e'],
  3: ['#f0c39b', '#c48a5a', '#7d4a26'],
};
const DISPLAY = '"Frank Ruhl Libre Variable", Georgia, serif';
const BODY = '"Heebo Variable", sans-serif';

async function fontsReady() {
  if (!('fonts' in document)) return;
  await Promise.allSettled([
    document.fonts.load(`500 80px ${DISPLAY}`, 'אבג 123'),
    document.fonts.load(`700 40px ${DISPLAY}`, '123'),
    document.fonts.load(`500 26px ${BODY}`, 'אבג abc'),
  ]);
}

export async function renderImage(spec: ImageSpec): Promise<Blob> {
  await fontsReady();
  const H = HEAD + spec.rows.length * (ROW + GAP) + FOOT;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  // `at(n)` is n pixels from the start edge of the reading direction.
  const at = (n: number) => (spec.rtl ? W - n : n);
  const startAlign: CanvasTextAlign = spec.rtl ? 'right' : 'left';
  const endAlign: CanvasTextAlign = spec.rtl ? 'left' : 'right';
  const text = (
    s: string,
    x: number,
    y: number,
    font: string,
    fill: string | CanvasGradient,
    align: CanvasTextAlign,
    max?: number,
  ) => {
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = align;
    ctx.direction = spec.rtl ? 'rtl' : 'ltr';
    let out = s;
    if (max)
      while (out.length > 1 && ctx.measureText(out).width > max) out = `${out.slice(0, -2)}…`;
    ctx.fillText(out, x, y);
  };
  const round = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };
  const metal = (rank: number, x0: number, y0: number, x1: number, y1: number) => {
    const stops = METAL[rank];
    if (!stops) return undefined;
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, stops[0]);
    g.addColorStop(0.5, stops[1]);
    g.addColorStop(1, stops[2]);
    return g;
  };

  // ground: warm black, light from above, a breath of the competition's colour
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const light = ctx.createRadialGradient(W / 2, -80, 0, W / 2, -80, 820);
  light.addColorStop(0, 'rgba(243,223,170,0.16)');
  light.addColorStop(1, 'rgba(243,223,170,0)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);
  const accent = ctx.createRadialGradient(W / 2, HEAD, 0, W / 2, HEAD, 700);
  accent.addColorStop(0, `${spec.accent}1c`);
  accent.addColorStop(1, `${spec.accent}00`);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, W, H);

  // double gold frame
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(212,176,106,0.38)';
  round(28, 28, W - 56, H - 56, 18);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(212,176,106,0.15)';
  round(42, 42, W - 84, H - 84, 12);
  ctx.stroke();

  // centred header: eyebrow, gold-leaf title, ornament, subtitle
  ctx.letterSpacing = '5px';
  text(spec.eyebrow, W / 2, PAD + 40, `600 23px ${BODY}`, GOLD, 'center', W - PAD * 2);
  ctx.letterSpacing = '0px';
  const leaf = ctx.createLinearGradient(W / 2 - 380, 0, W / 2 + 380, 0);
  leaf.addColorStop(0, '#f6e4b4');
  leaf.addColorStop(0.4, '#d4b06a');
  leaf.addColorStop(0.68, '#a07a37');
  leaf.addColorStop(1, '#e9cf8f');
  text(spec.title, W / 2, PAD + 150, `500 94px ${DISPLAY}`, leaf, 'center', W - PAD * 2);
  const rule = (from: number, to: number) => {
    const g = ctx.createLinearGradient(from, 0, to, 0);
    g.addColorStop(0, 'rgba(212,176,106,0.65)');
    g.addColorStop(1, 'rgba(212,176,106,0)');
    ctx.fillStyle = g;
    ctx.fillRect(Math.min(from, to), PAD + 191, Math.abs(to - from), 1.5);
  };
  rule(W / 2 - 18, W / 2 - 160);
  rule(W / 2 + 18, W / 2 + 160);
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(W / 2, PAD + 183);
  ctx.lineTo(W / 2 + 8, PAD + 191.5);
  ctx.lineTo(W / 2, PAD + 200);
  ctx.lineTo(W / 2 - 8, PAD + 191.5);
  ctx.closePath();
  ctx.fill();
  text(spec.subtitle, W / 2, PAD + 244, `400 29px ${BODY}`, MUTED, 'center', W - PAD * 2);

  const top = spec.rows.reduce((m, r) => Math.max(m, r.value ?? 0), 0);
  spec.rows.forEach((row, i) => {
    const y = HEAD + i * (ROW + GAP);
    const medal = row.rank !== null ? MEDAL[row.rank] : undefined;
    round(PAD, y, W - PAD * 2, ROW, 14);
    ctx.fillStyle = medal ? 'rgba(255,244,220,0.05)' : 'rgba(255,244,220,0.025)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = medal ? `${medal}55` : 'rgba(212,176,106,0.12)';
    ctx.stroke();

    // metal rank disc
    const cx = at(PAD + 56);
    const cy = y + ROW / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    const disc =
      row.rank !== null ? metal(row.rank, cx - 28, cy - 28, cx + 28, cy + 28) : undefined;
    if (disc) {
      ctx.fillStyle = disc;
      ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(212,176,106,0.35)';
      ctx.stroke();
    }
    text(
      String(row.rank ?? '?'),
      cx,
      cy + 12,
      `700 34px ${DISPLAY}`,
      disc ? '#1a140a' : MUTED,
      'center',
    );

    // jewel dot, name and sub line
    ctx.beginPath();
    ctx.arc(at(PAD + 112), y + 42, 7, 0, Math.PI * 2);
    ctx.fillStyle = row.color;
    ctx.fill();
    const nameMax = W - PAD * 2 - 140 - 250;
    text(
      row.name,
      at(PAD + 132),
      y + (row.sub ? 56 : 64),
      `500 42px ${DISPLAY}`,
      IVORY,
      startAlign,
      nameMax,
    );
    if (row.sub)
      text(row.sub, at(PAD + 112), y + 88, `400 24px ${BODY}`, MUTED, startAlign, nameMax + 20);

    // value at the end edge
    const vx = at(W - PAD - 32);
    const value = row.value === null ? '—' : String(row.value);
    text(value, vx, y + (row.note ? 60 : 68), `500 54px ${DISPLAY}`, medal ?? IVORY, endAlign);
    // the note is a signed number: isolate it so a minus sign stays in front in Hebrew
    const label = row.note ? `${row.valueLabel} · \u2066${row.note}\u2069` : row.valueLabel;
    if (label) text(label, vx, y + 90, `500 22px ${BODY}`, FAINT, endAlign);

    if (row.ratio !== null && top > 0) {
      const track = W - PAD * 2 - 112 - 250;
      const len = track * Math.max(0.02, Math.min(1, row.ratio));
      ctx.fillStyle = 'rgba(212,176,106,0.1)';
      round(Math.min(at(PAD + 112), at(PAD + 112 + track)), y + ROW - 9, track, 3, 2);
      ctx.fill();
      ctx.fillStyle = row.color;
      round(spec.rtl ? at(PAD + 112) - len : PAD + 112, y + ROW - 9, len, 3, 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = 'rgba(212,176,106,0.25)';
  ctx.fillRect(PAD, H - FOOT + 30, W - PAD * 2, 1);
  text(spec.footer, at(PAD), H - FOOT + 86, `500 32px ${DISPLAY}`, GOLD, startAlign);
  text(
    'matan0810.github.io/fantazy-statistics',
    at(W - PAD),
    H - FOOT + 84,
    `400 22px ${BODY}`,
    FAINT,
    endAlign,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the image'))),
      'image/png',
    ),
  );
}
