import { Box, Paper, Typography, Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ACCENT, CARD_SX } from "../../constants";
import SectionTitle from "../common/SectionTitle";
import MedalPills from "../common/MedalPills";

// Ranked player list (by titles, then podiums). The leader gets a crown and a
// highlighted row. Clicking a row opens the player dialog.
function HallOfFame({ players, onSelect }) {
  return (
    <>
      <SectionTitle emoji="🏆" sub="לחצו על שחקן לפירוט מלא">
        היכל התהילה
      </SectionTitle>
      <Paper elevation={0} sx={{ ...CARD_SX, overflow: "hidden" }}>
        {players.map((p, i) => (
          <Box
            key={p.id}
            onClick={() => onSelect(p)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2.5 },
              py: 1.5,
              cursor: "pointer",
              borderBottom:
                i === players.length - 1 ? "none" : "1px solid rgba(0,0,0,0.05)",
              backgroundColor: i === 0 ? `${ACCENT}10` : "transparent",
              transition: "background-color 0.15s",
              "&:hover": { backgroundColor: `${ACCENT}1c` },
              "&:hover .row-chevron": { opacity: 1, transform: "translateX(-2px)" },
            }}
          >
            <Box
              sx={{
                width: 28,
                textAlign: "center",
                fontWeight: 900,
                color: "text.secondary",
              }}
            >
              {i + 1}
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: i === 0 ? ACCENT : "rgba(0,0,0,0.12)",
                color: i === 0 ? "#fff" : "text.secondary",
                fontWeight: 800,
              }}
            >
              {p.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {i === 0 && "👑 "}
                {p.name}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
                {p.appearances} עונות · {p.podiums} פודיומים
              </Typography>
            </Box>
            <MedalPills golds={p.golds} silvers={p.silvers} bronzes={p.bronzes} />
            <ChevronLeftIcon
              className="row-chevron"
              sx={{
                color: ACCENT,
                opacity: 0.35,
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            />
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default HallOfFame;
