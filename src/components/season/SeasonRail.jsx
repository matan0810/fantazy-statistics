import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { T, NUM_SX, alpha } from "../../constants";
import { formatSeasonYear } from "../../utils";

// Horizontally scrolling season picker (newest first) with edge fades.
function SeasonRail({ seasons, current, onChange, comp }) {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    const el = rail?.querySelector('[aria-selected="true"]');
    if (!rail || !el) return;
    // rect delta works for both LTR and RTL scroll coordinates
    const r = rail.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    const delta = e.left + e.width / 2 - (r.left + r.width / 2);
    rail.scrollBy({ left: delta, behavior: "smooth" });
  }, [current]);

  if (!seasons.length) return null;

  return (
    <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1, px: 0.25 }}>
        <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "text.secondary" }}>
          עונה
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "text.disabled", fontWeight: 600 }}>
          {seasons.length} עונות בארכיון
        </Typography>
      </Box>
      <Box
        ref={railRef}
        role="tablist"
        aria-label="בחירת עונה"
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          py: 0.5,
          px: 0.25,
          maskImage:
            "linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)",
        }}
      >
        {seasons.map((s) => {
          const selected = s.id === current;
          return (
            <Box
              key={s.id}
              component="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(s.id)}
              sx={{
                all: "unset",
                cursor: "pointer",
                flexShrink: 0,
                ...NUM_SX,
                fontWeight: 700,
                fontSize: "1.08rem",
                px: 2,
                py: 0.7,
                borderRadius: 999,
                border: "1px solid",
                borderColor: selected ? comp.color : T.border,
                backgroundColor: selected ? comp.color : "rgba(255,255,255,0.03)",
                color: selected ? "#0a0f1c" : T.textDim,
                boxShadow: selected ? `0 8px 22px -10px ${comp.color}` : "none",
                transition: "all .18s ease",
                position: "relative",
                "&:hover": {
                  color: selected ? "#0a0f1c" : T.text,
                  borderColor: selected ? comp.color : alpha(comp.color, 0.5),
                },
                "&:focus-visible": { outline: `2px solid ${comp.color}`, outlineOffset: 2 },
              }}
            >
              {formatSeasonYear(s.year, s.type)}
              {s.dataLost && (
                <Box
                  component="span"
                  title="נתונים חלקיים"
                  sx={{
                    position: "absolute",
                    top: 4,
                    insetInlineEnd: 6,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: selected ? "#0a0f1c" : T.textMute,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default SeasonRail;
