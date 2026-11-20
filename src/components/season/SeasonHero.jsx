import { Box, Typography, Avatar, Button } from "@mui/material";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import { GOLD, NUM_SX, EYEBROW_SX } from "../../constants";
import { formatSeasonYear, isLostName } from "../../utils";
import ExportMenu from "../common/ExportMenu";

function Kpi({ label, value, sub }) {
  return (
    <Box
      sx={{
        flex: "1 1 0",
        minWidth: 0,
        px: { xs: 1.25, sm: 2 },
        py: { xs: 1.1, sm: 1.4 },
        borderRadius: "14px",
        backgroundColor: "rgba(0,0,0,0.22)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <Typography sx={{ ...EYEBROW_SX, color: "rgba(255,255,255,0.65)", fontSize: { xs: "0.64rem", sm: "0.72rem" } }} noWrap>
        {label}
      </Typography>
      <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: { xs: "1.5rem", sm: "1.9rem" }, lineHeight: 1.1 }}>
        <Box component="bdi" dir="ltr">{value}</Box>
        {sub && (
          <Box component="span" sx={{ fontFamily: "Heebo", fontSize: "0.72rem", fontWeight: 600, opacity: 0.6, marginInlineStart: 0.5 }}>
            {sub}
          </Box>
        )}
      </Typography>
    </Box>
  );
}

// The broadcast-style "title card" of a season: competition + year, the
// champion spotlight, headline numbers, and the proof / download actions.
function SeasonHero({ comp, seasonInfo, teams, players, dataLost, hasProof, onProofClick, exportProps }) {
  const champ = teams[0];
  const second = teams[1];
  const champName = players[champ.player]?.label ?? "—";
  const champTeam = isLostName(champ.team_name) ? null : champ.team_name;
  const avg = Math.round(teams.reduce((a, t) => a + (t.points ?? 0), 0) / teams.length);
  const margin = second ? champ.points - second.points : null;
  const year = formatSeasonYear(seasonInfo?.year, seasonInfo?.type);

  return (
    <Box
      className="fade-up"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: "22px", sm: "26px" },
        color: "#fff",
        p: { xs: 2, sm: 3.5 },
        background: `linear-gradient(135deg, ${comp.gradient[1]} 0%, ${comp.gradient[0]} 100%)`,
        boxShadow: `0 30px 60px -30px ${comp.color}, inset 0 1px 0 rgba(255,255,255,0.18)`,
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* decoration: diagonal broadcast stripes + oversized emblem */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 22px)",
          maskImage: "linear-gradient(90deg, #000, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: { xs: -24, sm: 10 },
          top: { xs: -6, sm: -10 },
          fontSize: { xs: 120, sm: 200 },
          lineHeight: 1,
          opacity: 0.13,
          filter: "grayscale(0.2)",
          pointerEvents: "none",
          transform: "rotate(-12deg)",
        }}
      >
        {comp.emoji}
      </Box>

      <Box sx={{ position: "relative" }}>
        {/* top line */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.4,
              borderRadius: 999,
              backgroundColor: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontWeight: 800,
              fontSize: "0.78rem",
            }}
          >
            <span>{comp.emoji}</span>
            {comp.label}
          </Box>
          {dataLost && (
            <Box sx={{ px: 1.1, py: 0.35, borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.75)" }}>
              נתונים חלקיים
            </Box>
          )}
          <Box sx={{ flex: 1 }} />
          {hasProof && (
            <Button
              onClick={onProofClick}
              startIcon={<VerifiedRounded />}
              sx={{
                borderRadius: 999,
                px: 1.6,
                py: 0.7,
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.22)",
                "& .MuiButton-startIcon": { marginInlineStart: 0, marginInlineEnd: 0.75 },
                "&:hover": { backgroundColor: "rgba(255,255,255,0.24)" },
              }}
            >
              הוכחה
            </Button>
          )}
          <ExportMenu {...exportProps} />
        </Box>

        {/* title */}
        <Box sx={{ mt: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 2.5 } }}>
          <Typography
            component="h1"
            sx={{
              ...NUM_SX,
              fontWeight: 800,
              fontSize: { xs: "3.4rem", sm: "4.6rem" },
              lineHeight: 0.95,
              textShadow: "0 6px 30px rgba(0,0,0,0.35)",
            }}
          >
            {year}
          </Typography>
          {seasonInfo?.name && (
            <Typography sx={{ mt: 0.75, fontWeight: 600, opacity: 0.85, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              „{seasonInfo.name}”
            </Typography>
          )}
        </Box>

        {/* champion spotlight */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            mb: 1.25,
            borderRadius: "18px",
            background: "linear-gradient(90deg, rgba(251,191,36,0.22), rgba(0,0,0,0.25))",
            border: "1px solid rgba(251,191,36,0.35)",
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              sx={{
                width: { xs: 52, sm: 62 },
                height: { xs: 52, sm: 62 },
                fontWeight: 900,
                fontSize: { xs: "1.4rem", sm: "1.7rem" },
                color: "#1a1206",
                background: "linear-gradient(135deg, #fde68a, #f59e0b)",
                boxShadow: `0 0 0 3px rgba(0,0,0,0.25), 0 0 30px ${GOLD}88`,
              }}
            >
              {champName.charAt(0)}
            </Avatar>
            <Box aria-hidden sx={{ position: "absolute", top: -16, insetInlineStart: "50%", transform: "translateX(50%) rotate(12deg)", fontSize: 20 }}>
              👑
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ ...EYEBROW_SX, color: GOLD }}>אלוף העונה</Typography>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.45rem", sm: "1.8rem" }, lineHeight: 1.1 }} noWrap>
              {champName}
            </Typography>
            {champTeam && (
              <Typography sx={{ opacity: 0.75, fontSize: "0.85rem", fontWeight: 500 }} noWrap>
                {champTeam}
                {champ.coach && ` · מאמן: ${champ.coach}`}
              </Typography>
            )}
          </Box>
          {!dataLost && (
            <Box sx={{ textAlign: "center", flexShrink: 0 }}>
              <Typography sx={{ ...NUM_SX, fontWeight: 800, fontSize: { xs: "2.2rem", sm: "2.8rem" }, lineHeight: 1, color: GOLD }}>
                {champ.points}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", opacity: 0.7, fontWeight: 700 }}>נקודות</Typography>
            </Box>
          )}
        </Box>

        {/* KPIs */}
        <Box sx={{ display: "flex", gap: { xs: 0.75, sm: 1.25 } }}>
          <Kpi label="משתתפים" value={teams.length} />
          {!dataLost && <Kpi label="ממוצע לקבוצה" value={avg} />}
          {!dataLost && margin != null && <Kpi label="פער האליפות" value={`+${margin}`} />}
          {dataLost && <Kpi label="נקודות" value="—" sub="לא נשמרו" />}
        </Box>
      </Box>
    </Box>
  );
}

export default SeasonHero;
