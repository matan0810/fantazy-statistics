/**
 * Draws a ranked table as a PNG "share card" on a canvas: no libraries, works offline.
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
const PAD = 72;
const ROW = 104;
const GAP = 14;
const HEAD = 340;
const FOOT = 140;
const INK = '#090a0f';
const MEDAL: Record<number, string> = { 1: '#f2c14e', 2: '#c9d1dc', 3: '#d9915a' };
const DISPLAY = '"Secular One", "Heebo Variable", sans-serif';
const BODY = '"Heebo Variable", sans-serif';

async function fontsReady() {
  if (!('fonts' in document)) return;
  await Promise.allSettled([
    document.fonts.load(`400 80px ${DISPLAY}`, 'אבג 123'),
    document.fonts.load(`700 40px ${BODY}`, 'אבג abc'),
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

  // Mirror x for the reading direction: `at(n)` is n pixels from the start edge.
  const at = (n: number) => (spec.rtl ? W - n : n);
  const startAlign: CanvasTextAlign = spec.rtl ? 'right' : 'left';
  const endAlign: CanvasTextAlign = spec.rtl ? 'left' : 'right';
  const text = (
    s: string,
    x: number,
    y: number,
    font: string,
    color: string,
    align: CanvasTextAlign,
    max?: number,
  ) => {
    ctx.font = font;
    ctx.fillStyle = color;
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

  // ground, a soft glow in the accent colour, and a faint grid
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(at(160), 0, 0, at(160), 0, 760);
  glow.addColorStop(0, `${spec.accent}55`);
  glow.addColorStop(1, `${spec.accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(149,157,176,0.06)';
  for (let x = 0; x <= W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  text(spec.eyebrow, at(PAD), PAD + 28, `700 28px ${BODY}`, spec.accent, startAlign);
  text(spec.title, at(PAD), PAD + 128, `400 84px ${DISPLAY}`, '#f1f3f8', startAlign, W - PAD * 2);
  text(spec.subtitle, at(PAD), PAD + 186, `500 32px ${BODY}`, '#959db0', startAlign, W - PAD * 2);

  const top = spec.rows.reduce((m, r) => Math.max(m, r.value ?? 0), 0);
  spec.rows.forEach((row, i) => {
    const y = HEAD + i * (ROW + GAP);
    const medal = row.rank !== null ? MEDAL[row.rank] : undefined;
    round(PAD, y, W - PAD * 2, ROW, 22);
    ctx.fillStyle = medal ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)';
    ctx.fill();
    ctx.strokeStyle = medal ? `${medal}66` : 'rgba(149,157,176,0.16)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // rank disc
    const cx = at(PAD + 56);
    const cy = y + ROW / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    if (medal) {
      ctx.fillStyle = medal;
      ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(149,157,176,0.4)';
      ctx.stroke();
    }
    text(
      String(row.rank ?? '?'),
      cx,
      cy + 12,
      `400 34px ${DISPLAY}`,
      medal ? '#15120a' : '#959db0',
      'center',
    );

    // identity dot, name and sub line
    ctx.beginPath();
    ctx.arc(at(PAD + 112), y + 44, 8, 0, Math.PI * 2);
    ctx.fillStyle = row.color;
    ctx.fill();
    const nameMax = W - PAD * 2 - 140 - 250;
    text(
      row.name,
      at(PAD + 132),
      y + (row.sub ? 56 : 64),
      `800 40px ${BODY}`,
      '#f1f3f8',
      startAlign,
      nameMax,
    );
    if (row.sub)
      text(row.sub, at(PAD + 112), y + 88, `500 25px ${BODY}`, '#959db0', startAlign, nameMax + 20);

    // value at the end edge
    const vx = at(W - PAD - 32);
    text(
      row.value === null ? '—' : String(row.value),
      vx,
      y + (row.note ? 60 : 68),
      `400 54px ${DISPLAY}`,
      medal ?? '#f1f3f8',
      endAlign,
    );
    const label = row.note ? `${row.valueLabel} · ${row.note}` : row.valueLabel;
    if (label) text(label, vx, y + 90, `600 22px ${BODY}`, '#5f6779', endAlign);

    if (row.ratio !== null && top > 0) {
      const track = W - PAD * 2 - 112 - 250;
      const len = track * Math.max(0.02, Math.min(1, row.ratio));
      ctx.fillStyle = 'rgba(149,157,176,0.12)';
      round(Math.min(at(PAD + 112), at(PAD + 112 + track)), y + ROW - 9, track, 3, 2);
      ctx.fill();
      ctx.fillStyle = row.color;
      round(spec.rtl ? at(PAD + 112) - len : PAD + 112, y + ROW - 9, len, 3, 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = 'rgba(149,157,176,0.2)';
  ctx.fillRect(PAD, H - FOOT + 30, W - PAD * 2, 1);
  text(spec.footer, at(PAD), H - FOOT + 86, `400 30px ${DISPLAY}`, '#f2c14e', startAlign);
  text(
    'matan0810.github.io/fantazy-statistics',
    at(W - PAD),
    H - FOOT + 84,
    `500 22px ${BODY}`,
    '#5f6779',
    endAlign,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the image'))),
      'image/png',
    ),
  );
}
