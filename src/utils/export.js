// Download helpers: Excel-friendly CSV and a broadcast-style PNG "share card"
// drawn directly on a canvas (no external libs, works offline).
import { T, GOLD, SILVER, BRONZE, NUM_FONT } from "../constants/ui";

const RANK_FILL = { 1: GOLD, 2: SILVER, 3: BRONZE };
const SITE_URL = "matan0810.github.io/fantazy-statistics";

export function safeFileName(name) {
  return String(name)
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const csvCell = (v) => {
  if (v == null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// UTF-8 BOM so Excel opens Hebrew correctly.
export function toCsvBlob(headers, rows) {
  const lines = [headers, ...rows].map((r) => r.map(csvCell).join(","));
  return new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
}

export function downloadCsv(filename, headers, rows) {
  downloadBlob(toCsvBlob(headers, rows), `${safeFileName(filename)}.csv`);
}

export function canShareFiles() {
  try {
    const f = new File([""], "x.png", { type: "image/png" });
    return Boolean(navigator.canShare?.({ files: [f] }));
  } catch {
    return false;
  }
}

export async function shareFile(blob, filename, title) {
  const file = new File([blob], filename, { type: blob.type });
  try {
    await navigator.share({ files: [file], title });
    return true;
  } catch (e) {
    if (e?.name === "AbortError") return true;
    return false;
  }
}

// ---------------------------------------------------------------- canvas ---

const W = 1080;
const PAD = 72;

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function fit(ctx, text, maxW) {
  let s = String(text ?? "");
  if (ctx.measureText(s).width <= maxW) return s;
  while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
  return s + "…";
}

function txt(ctx, s, x, y, { font, color, align = "right", dir = "rtl", maxW } = {}) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.direction = dir;
  ctx.fillText(maxW ? fit(ctx, s, maxW) : s, x, y);
}

async function ensureFonts() {
  if (!document.fonts?.load) return;
  await Promise.allSettled([
    document.fonts.load('900 80px "Heebo"', "אבג"),
    document.fonts.load('800 40px "Heebo"', "אבג"),
    document.fonts.load('500 28px "Heebo"', "אבג"),
    document.fonts.load('800 60px "Barlow Condensed"', "0123"),
  ]);
}

/**
 * Render a ranked table as a PNG blob.
 * rows: [{ rank, name, sub, value, valueLabel, note, ratio }]
 */
export async function renderRankingImage({
  eyebrow,
  title,
  subtitle,
  gradient,
  accent,
  rows,
  footnote,
}) {
  await ensureFonts();
  const ROW_H = 104;
  const GAP = 14;
  const HEAD = 360;
  const FOOT = 150;
  const H = HEAD + rows.length * (ROW_H + GAP) + FOOT;
  const scale = 1;

  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // backdrop
  ctx.fillStyle = T.bg;
  ctx.fillRect(0, 0, W, H);
  const band = ctx.createLinearGradient(0, 0, W, HEAD + 80);
  band.addColorStop(0, gradient[1]);
  band.addColorStop(1, gradient[0]);
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, HEAD + 40);
  ctx.restore();
  const glow = ctx.createRadialGradient(W * 0.85, 40, 0, W * 0.85, 40, 520);
  glow.addColorStop(0, "rgba(255,255,255,0.22)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, HEAD + 40);
  const fade = ctx.createLinearGradient(0, HEAD - 200, 0, HEAD + 40);
  fade.addColorStop(0, "rgba(6,10,20,0)");
  fade.addColorStop(1, T.bg);
  ctx.fillStyle = fade;
  ctx.fillRect(0, HEAD - 200, W, 242);

  // fine grid
  ctx.strokeStyle = "rgba(148,163,184,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // header
  const R = W - PAD;
  txt(ctx, eyebrow, R, PAD + 30, {
    font: '800 28px "Heebo"',
    color: "rgba(255,255,255,0.78)",
  });
  txt(ctx, title, R, PAD + 130, {
    font: '900 88px "Heebo"',
    color: "#fff",
    maxW: W - PAD * 2,
  });
  if (subtitle)
    txt(ctx, subtitle, R, PAD + 190, {
      font: '500 34px "Heebo"',
      color: "rgba(255,255,255,0.75)",
      maxW: W - PAD * 2,
    });
  // accent rule
  ctx.fillStyle = accent;
  rr(ctx, R - 120, PAD + 222, 120, 8, 4);
  ctx.fill();

  // rows
  let y = HEAD;
  rows.forEach((r) => {
    const top3 = r.rank != null && r.rank <= 3;
    const fill = RANK_FILL[r.rank];

    ctx.fillStyle = top3 ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.035)";
    rr(ctx, PAD, y, W - PAD * 2, ROW_H, 22);
    ctx.fill();
    ctx.strokeStyle = top3 ? `${fill}55` : "rgba(148,163,184,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // rank badge (right)
    const cx = R - 56;
    const cy = y + ROW_H / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    txt(ctx, r.rank ?? "?", cx, cy + 13, {
      font: `800 38px ${NUM_FONT}`,
      color: fill ? "#111827" : T.textDim,
      align: "center",
      dir: "ltr",
    });

    // name + sub
    const nameX = R - 112;
    const textMaxW = W - PAD * 2 - 112 - 260;
    txt(ctx, r.name, nameX, r.sub ? y + 50 : y + 66, {
      font: '800 40px "Heebo"',
      color: "#fff",
      maxW: textMaxW,
    });
    if (r.sub)
      txt(ctx, r.sub, nameX, y + 86, {
        font: '500 26px "Heebo"',
        color: T.textDim,
        maxW: textMaxW,
      });

    // value (left)
    const vx = PAD + 36;
    txt(ctx, r.value ?? "—", vx, y + (r.note ? 62 : 70), {
      font: `800 58px ${NUM_FONT}`,
      color: r.value == null ? T.textMute : top3 ? fill : accent,
      align: "left",
      dir: "ltr",
    });
    if (r.valueLabel || r.note) {
      ctx.font = `800 58px ${NUM_FONT}`;
      const vw = ctx.measureText(String(r.value ?? "—")).width;
      txt(ctx, r.valueLabel ?? "", vx + vw + 12, y + 62, {
        font: '600 24px "Heebo"',
        color: T.textDim,
        align: "left",
      });
      if (r.note)
        txt(ctx, r.note, vx, y + 90, {
          font: `700 24px ${NUM_FONT}`,
          color: T.textMute,
          align: "left",
          dir: "ltr",
        });
    }

    // relative bar along the bottom edge, under the name column only
    if (r.ratio != null) {
      const trackW = nameX - (PAD + 250);
      const bw = trackW * Math.max(0.02, Math.min(1, r.ratio));
      ctx.fillStyle = "rgba(148,163,184,0.10)";
      rr(ctx, PAD + 250, y + ROW_H - 10, trackW, 4, 2);
      ctx.fill();
      ctx.fillStyle = top3 ? fill : accent;
      rr(ctx, nameX - bw, y + ROW_H - 10, bw, 4, 2);
      ctx.fill();
    }
    y += ROW_H + GAP;
  });

  // footer
  ctx.fillStyle = "rgba(148,163,184,0.18)";
  ctx.fillRect(PAD, H - FOOT + 30, W - PAD * 2, 1);
  txt(ctx, "🏆 היכל התהילה · פנטזי ליג", R, H - FOOT + 88, {
    font: '800 28px "Heebo"',
    color: T.text,
  });
  txt(ctx, footnote ?? SITE_URL, PAD, H - FOOT + 88, {
    font: '600 24px "Heebo"',
    color: T.textMute,
    align: "left",
    dir: "ltr",
  });

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
