import { Box, Typography, Avatar } from "@mui/material";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import { isLostName } from "../../utils";
import { NUM_SX, RANK_COLORS, T, alpha } from "../../constants";
import RankBadge from "./RankBadge";
import { COLS } from "./standingsLayout";

function StandingRow({ team, index, players, accent, isLast, hidePoints, gap, ratio, onClick, clickable }) {
  const top3 = team.location <= 3;
  const name = players[team.player]?.label ?? "—";
  const lost = team.team_name && isLostName(team.team_name);
  const barColor = RANK_COLORS[team.location] ?? accent;

  return (
    <Box
      component={clickable ? "button" : "div"}
      onClick={clickable ? onClick : undefined}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        width: "100%",
        position: "relative",
        display: "grid",
        gridTemplateColumns: COLS,
        alignItems: "center",
        columnGap: { xs: 1.25, sm: 2 },
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.4, sm: 1.6 },
        cursor: clickable ? "pointer" : "default",
        borderBottom: isLast ? "none" : `1px solid ${T.border}`,
        backgroundColor: top3 ? alpha(RANK_COLORS[team.location], 0.045) : "transparent",
        transition: "background-color .15s",
        animation: "fadeUp .4s ease both",
        animationDelay: `${160 + index * 35}ms`,
        "&:hover": { backgroundColor: clickable ? "rgba(255,255,255,0.045)" : undefined },
        "&:hover .row-chevron": { opacity: 1, transform: "translateX(-3px)" },
        "&:focus-visible": { outline: `2px solid ${accent}`, outlineOffset: -2 },
      }}
    >
      <RankBadge rank={team.location} />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            display: { xs: "none", sm: "flex" },
            bgcolor: top3 ? alpha(RANK_COLORS[team.location], 0.18) : "rgba(255,255,255,0.06)",
            color: top3 ? RANK_COLORS[team.location] : T.textDim,
            border: `1px solid ${top3 ? alpha(RANK_COLORS[team.location], 0.4) : T.border}`,
            fontWeight: 800,
            fontSize: "0.95rem",
          }}
        >
          {name.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.25 }} noWrap>
            {name}
          </Typography>
          <Typography
            noWrap
            sx={{ color: lost ? "text.disabled" : "text.secondary", fontStyle: lost ? "italic" : "normal", fontSize: "0.8rem", lineHeight: 1.35 }}
          >
            {lost ? "שם הקבוצה אבד" : team.team_name}
            {team.coach && (
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" }, color: "text.disabled", fontStyle: "normal" }}>
                {team.team_name ? " · " : ""}
                {team.coach}
              </Box>
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
        <Typography noWrap sx={{ color: team.coach ? "text.secondary" : "text.disabled", fontSize: "0.85rem", fontWeight: 500 }}>
          {team.coach || "—"}
        </Typography>
      </Box>

      <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>
        <Typography sx={{ ...NUM_SX, color: "text.disabled", fontWeight: 700, fontSize: "1rem", direction: "ltr" }}>
          {gap == null ? (hidePoints ? "" : "—") : gap ? `-${gap}` : "0"}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography
          sx={{
            ...NUM_SX,
            fontWeight: 800,
            fontSize: "1.45rem",
            lineHeight: 1,
            color: hidePoints ? "text.disabled" : top3 ? RANK_COLORS[team.location] : T.text,
          }}
        >
          {hidePoints ? "—" : team.points}
        </Typography>
        {gap != null && (
          <Typography sx={{ ...NUM_SX, display: { xs: "block", sm: "none" }, color: "text.disabled", fontSize: "0.72rem", fontWeight: 700, direction: "ltr" }}>
            {gap ? `-${gap}` : "0"}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {clickable && (
          <ChevronLeftRounded className="row-chevron" sx={{ color: "text.disabled", opacity: 0.6, transition: "all .15s", fontSize: "1.2rem" }} />
        )}
      </Box>

      {/* relative score bar */}
      {ratio != null && (
        <Box aria-hidden sx={{ position: "absolute", bottom: 0, insetInlineStart: 0, height: 2, width: `${ratio * 100}%`, background: `linear-gradient(270deg, ${alpha(barColor, 0.9)}, transparent)`, opacity: 0.55 }} />
      )}
    </Box>
  );
}

export default StandingRow;
