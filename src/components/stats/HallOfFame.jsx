import { Box, Typography, Avatar } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import { CARD_SX, EYEBROW_SX, NUM_SX, T, GOLD, SILVER, BRONZE, alpha } from "../../constants";
import SectionTitle from "../common/SectionTitle";
import RankBadge from "../season/RankBadge";

const COLS = {
  xs: "30px minmax(0,1fr) 34px 34px 34px 14px",
  sm: "40px minmax(0,1fr) 64px 56px 56px 56px 18px",
};

function MedalCell({ n, color }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: "1.3rem", color: n ? color : T.textMute, opacity: n ? 1 : 0.5 }}>
        {n || "·"}
      </Typography>
    </Box>
  );
}

// Medal table, ranked by golds → silvers → bronzes → average.
function HallOfFame({ players, onSelect }) {
  return (
    <>
      <SectionTitle emoji="🏆" sub="דירוג לפי אליפויות, אחר כך מקומות שני ושלישי">
        טבלת המדליות
      </SectionTitle>
      <Box sx={{ ...CARD_SX, overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: COLS,
            columnGap: { xs: 1, sm: 1.5 },
            alignItems: "center",
            px: { xs: 1.75, sm: 2.5 },
            py: 1,
            borderBottom: `1px solid ${T.border}`,
            backgroundColor: "rgba(255,255,255,0.02)",
            "& > *": { ...EYEBROW_SX, fontSize: "0.66rem", textAlign: "center" },
          }}
        >
          <Box>#</Box>
          <Box sx={{ textAlign: "start !important" }}>שחקן</Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>עונות</Box>
          <Box sx={{ fontSize: "0.9rem !important" }}>🥇</Box>
          <Box sx={{ fontSize: "0.9rem !important" }}>🥈</Box>
          <Box sx={{ fontSize: "0.9rem !important" }}>🥉</Box>
          <Box />
        </Box>
        {players.map((p, i) => (
          <Box
            key={p.id}
            component="button"
            onClick={() => onSelect(p)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              width: "100%",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: COLS,
              columnGap: { xs: 1, sm: 1.5 },
              alignItems: "center",
              px: { xs: 1.75, sm: 2.5 },
              py: 1.35,
              borderBottom: i === players.length - 1 ? "none" : `1px solid ${T.border}`,
              backgroundColor: i === 0 ? alpha(GOLD, 0.05) : "transparent",
              transition: "background-color .15s",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.045)" },
              "&:hover .row-chevron": { opacity: 1, transform: "translateX(-3px)" },
              "&:focus-visible": { outline: `2px solid ${GOLD}`, outlineOffset: -2 },
            }}
          >
            <RankBadge rank={i + 1} size={28} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  display: { xs: "none", sm: "flex" },
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  color: i === 0 ? "#1a1206" : T.textDim,
                  background: i === 0 ? "linear-gradient(135deg,#fde68a,#f59e0b)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${T.border}`,
                }}
              >
                {p.name.charAt(0)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 800, fontSize: "1rem" }}>
                  {p.name}
                  {i === 0 && " 👑"}
                </Typography>
                <Typography noWrap sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  <Box component="span" sx={{ display: { sm: "none" } }}>{p.appearances} עונות · </Box>
                  {p.podiums} פודיומים · ממוצע {p.avgPoints}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>
              <Typography sx={{ ...NUM_SX, fontWeight: 700, fontSize: "1.15rem", color: "text.secondary" }}>{p.appearances}</Typography>
            </Box>
            <MedalCell n={p.golds} color={GOLD} />
            <MedalCell n={p.silvers} color={SILVER} />
            <MedalCell n={p.bronzes} color={BRONZE} />
            <ChevronLeftRounded className="row-chevron" sx={{ color: "text.disabled", opacity: 0.6, transition: "all .15s", fontSize: "1.1rem" }} />
          </Box>
        ))}
      </Box>
    </>
  );
}

export default HallOfFame;
