import { Box, Typography, Avatar } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { isLostName } from "../../utils";
import { MEDAL } from "../../constants";

// One row in the full standings table. Top-3 rows get a tinted background and a
// larger medal glyph; rows are clickable only when the player has stats.
function StandingRow({
  team,
  players,
  accent,
  isLast,
  hidePoints,
  onClick,
  clickable,
}) {
  const top3 = team.location <= 3;
  const name = players[team.player]?.label ?? "—";

  return (
    <Box
      onClick={clickable ? onClick : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        px: { xs: 1.5, sm: 2.5 },
        py: 1.5,
        cursor: clickable ? "pointer" : "default",
        borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.05)",
        backgroundColor: top3 ? `${accent}0d` : "transparent",
        transition: "background-color 0.15s",
        "&:hover": {
          backgroundColor: clickable ? `${accent}14` : "rgba(0,0,0,0.025)",
        },
        "&:hover .row-chevron": { opacity: 1, transform: "translateX(-2px)" },
      }}
    >
      <Box
        sx={{
          width: 34,
          flexShrink: 0,
          textAlign: "center",
          fontSize: top3 ? "1.3rem" : "1rem",
          fontWeight: 800,
          color: top3 ? "inherit" : "text.secondary",
        }}
      >
        {MEDAL[team.location] ?? team.location}
      </Box>

      <Avatar
        sx={{
          width: 38,
          height: 38,
          flexShrink: 0,
          bgcolor: top3 ? accent : "rgba(0,0,0,0.12)",
          color: top3 ? "#fff" : "text.secondary",
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        {name.charAt(0)}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.25 }}>
          {name}
        </Typography>
        {team.team_name &&
          (isLostName(team.team_name) ? (
            <Typography
              sx={{
                color: "text.disabled",
                fontSize: "0.8rem",
                fontStyle: "italic",
                lineHeight: 1.3,
              }}
            >
              שם הקבוצה אבד
            </Typography>
          ) : (
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.85rem",
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {team.team_name}
            </Typography>
          ))}
      </Box>

      <Box sx={{ textAlign: "center", flexShrink: 0, pl: 0.5 }}>
        {hidePoints ? (
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.2rem",
              lineHeight: 1,
              color: "text.disabled",
            }}
          >
            —
          </Typography>
        ) : (
          <>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1.2rem",
                lineHeight: 1,
                color: accent,
              }}
            >
              {team.points}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.65rem" }}>
              נק׳
            </Typography>
          </>
        )}
      </Box>

      {clickable && (
        <ChevronLeftIcon
          className="row-chevron"
          sx={{
            color: accent,
            opacity: 0.3,
            transition: "all 0.15s",
            flexShrink: 0,
            fontSize: "1.1rem",
          }}
        />
      )}
    </Box>
  );
}

export default StandingRow;
