/**
 * Draws a ranked table as a PNG "share card" on a canvas: no libraries, works offline.
 * The site's look in miniature: warm black, a single gold hairline frame, a light serif
 * title over a short gold rule, rows divided by hairlines, metal rank rings and each
 * player's colour as a dot. Right to left for Hebrew, left to right for English.
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
const PAD = 96;
const ROW = 108;
const HEAD = 380;
const FOOT = 150;
const INK = '#0a0a09';
const IVORY = '#eee8dd';
const MUTED = '#9b958a';
const FAINT = '#645f57';
const GOLD = '#c8a96a';
const LINE = '#24221e';
const METAL: Record<number, string> = { 1: '#c8a96a', 2: '#bfc3c9', 3: '#b98a62' };
const SERIF = '"Noto Serif Hebrew Variable", Georgia, serif';
const SANS = '"Assistant Variable", sans-serif';

async function fontsReady() {
  if (!('fonts' in document)) return;
  await Promise.allSettled([
    document.fonts.load(`300 80px ${SERIF}`, 'אבג 123 abc'),
    document.fonts.load(`600 24px ${SANS}`, 'אבג abc'),
    document.fonts.load(`400 24px ${SANS}`, 'אבג abc'),
  ]);
}

export async function renderImage(spec: ImageSpec): Promise<Blob> {
  await fontsReady();
  const H = HEAD + spec.rows.length * ROW + FOOT;
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
    fill: string,
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
  const hairline = (y: number, color = LINE) => {
    ctx.fillStyle = color;
    ctx.fillRect(PAD, y, W - PAD * 2, 1);
  };

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(200,169,106,0.45)';
  ctx.lineWidth = 1;
  ctx.strokeRect(36.5, 36.5, W - 73, H - 73);

  // header
  ctx.letterSpacing = spec.rtl ? '2px' : '6px';
  text(spec.eyebrow, W / 2, PAD + 40, `600 22px ${SANS}`, GOLD, 'center', W - PAD * 2);
  ctx.letterSpacing = '-1px';
  text(spec.title, W / 2, PAD + 150, `300 96px ${SERIF}`, IVORY, 'center', W - PAD * 2);
  ctx.letterSpacing = '0px';
  ctx.fillStyle = GOLD;
  ctx.fillRect(W / 2 - 32, PAD + 190, 64, 1.5);
  text(spec.subtitle, W / 2, PAD + 242, `400 28px ${SANS}`, MUTED, 'center', W - PAD * 2);

  hairline(HEAD - 1, '#35322c');
  const top = spec.rows.reduce((m, r) => Math.max(m, r.value ?? 0), 0);
  spec.rows.forEach((row, i) => {
    const y = HEAD + i * ROW;
    const metal = row.rank !== null ? METAL[row.rank] : undefined;

    // rank: a numeral in a ring, metal for the podium
    const cx = at(PAD + 26);
    const cy = y + ROW / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.strokeStyle = metal ?? '#35322c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    text(String(row.rank ?? '?'), cx, cy + 10, `400 28px ${SERIF}`, metal ?? FAINT, 'center');

    // player colour, name and sub line
    ctx.beginPath();
    ctx.arc(at(PAD + 84), y + 46, 5, 0, Math.PI * 2);
    ctx.fillStyle = row.color;
    ctx.fill();
    const nameMax = W - PAD * 2 - 100 - 230;
    text(
      row.name,
      at(PAD + 100),
      y + (row.sub ? 58 : 66),
      `300 40px ${SERIF}`,
      IVORY,
      startAlign,
      nameMax,
    );
    if (row.sub)
      text(row.sub, at(PAD + 84), y + 90, `400 22px ${SANS}`, MUTED, startAlign, nameMax + 16);

    // value at the end edge
    const vx = at(W - PAD);
    const value = row.value === null ? '—' : String(row.value);
    text(value, vx, y + (row.note ? 60 : 68), `300 50px ${SERIF}`, metal ?? IVORY, endAlign);
    // the note is a signed number: isolate it so a minus sign stays in front in Hebrew
    const label = row.note ? `${row.valueLabel} · ⁦${row.note}⁩` : row.valueLabel;
    if (label) text(label, vx, y + 90, `400 21px ${SANS}`, FAINT, endAlign);

    if (row.ratio !== null && top > 0) {
      const track = W - PAD * 2 - 84 - 230;
      const len = track * Math.max(0.02, Math.min(1, row.ratio));
      ctx.fillStyle = row.color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(spec.rtl ? at(PAD + 84) - len : PAD + 84, y + ROW - 2, len, 1);
      ctx.globalAlpha = 1;
    }
    hairline(y + ROW - 1);
  });

  ctx.letterSpacing = spec.rtl ? '0px' : '4px';
  text(spec.footer, at(PAD), H - FOOT + 84, `300 30px ${SERIF}`, GOLD, startAlign);
  ctx.letterSpacing = '0px';
  text(
    'matan0810.github.io/fantazy-statistics',
    at(W - PAD),
    H - FOOT + 82,
    `400 20px ${SANS}`,
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
