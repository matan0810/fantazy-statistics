import { Box, Typography } from "@mui/material";
import { NUM_SX, EYEBROW_SX, DARK } from "../../constants";
import ExportMenu from "../common/ExportMenu";

function Total({ label, value }) {
  return (
    <Box sx={{ flex: "1 1 0", minWidth: 0, px: { xs: 1.25, sm: 2 }, py: { xs: 1.1, sm: 1.4 }, borderRadius: "14px", backgroundColor: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <Typography sx={{ ...EYEBROW_SX, color: "rgba(255,255,255,0.65)", fontSize: { xs: "0.64rem", sm: "0.72rem" } }} noWrap>
        {label}
      </Typography>
      <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: { xs: "1.6rem", sm: "2rem" }, lineHeight: 1.1 }}>{value}</Typography>
    </Box>
  );
}

function StatsHero({ totals, exportProps }) {
  return (
    <Box
      className="fade-up"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "22px", sm: "26px" },
        p: { xs: 2, sm: 3.5 },
        color: "#fff",
        background: `radial-gradient(120% 140% at 100% 0%, #8b5cf6 0%, ${DARK} 38%, #1a0f3d 100%)`,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 30px 60px -30px #7c3aed, inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      <Box aria-hidden sx={{ position: "absolute", inset: 0, opacity: 0.5, background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 22px)", maskImage: "linear-gradient(90deg, #000, transparent 65%)" }} />
      <Box aria-hidden sx={{ position: "absolute", left: { xs: -20, sm: 16 }, top: -10, fontSize: { xs: 110, sm: 170 }, opacity: 0.07, transform: "rotate(-10deg)" }}>
        📊
      </Box>
      <Box sx={{ position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ ...EYEBROW_SX, color: "rgba(255,255,255,0.75)" }}>כל הזמנים</Typography>
          <Box sx={{ flex: 1 }} />
          <ExportMenu {...exportProps} />
        </Box>
        <Typography component="h1" sx={{ fontWeight: 900, fontSize: { xs: "2.2rem", sm: "3rem" }, lineHeight: 1.05, mt: 1 }}>
          סטטיסטיקה כללית
        </Typography>
        <Typography sx={{ opacity: 0.8, mt: 0.75, mb: 2.25, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          שיאים, טבלת מדליות וארכיון אלופים — לפי התחרויות שתבחרו.
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 0.75, sm: 1.25 } }}>
          <Total label="עונות" value={totals.seasons} />
          <Total label="שחקנים" value={totals.players} />
          <Total label="תוצאות" value={totals.records} />
        </Box>
      </Box>
    </Box>
  );
}

export default StatsHero;
