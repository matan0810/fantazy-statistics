import { useState, useEffect, useMemo } from "react";
import _ from "lodash";
import { Box, Paper, Typography, Avatar, Divider, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { seasonTypes } from "../constants/options";
import { isLostName, formatSeasonYear } from "../utils/format";
import { computeStats } from "../utils/stats";
import Podium from "./Podium";
import PlayerDetailDialog from "./PlayerDetailDialog";
import allTeams from "../data/teams.json";

const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 10px 30px -18px rgba(17,24,39,0.35)",
        textAlign: "center",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 16px 36px -16px rgba(17,24,39,0.4)",
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: "50%",
          mb: 0.5,
          color: accent,
          backgroundColor: `${accent}1a`,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{ color: "text.secondary", fontSize: "0.75rem", fontWeight: 700 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: "1.05rem", sm: "1.35rem" },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
          {sub}
        </Typography>
      )}
    </Paper>
  );
}

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
        <Typography
          sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.25 }}
        >
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

function PlayerTable({ season, seasonInfo, players, seasonType }) {
  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState(null);
  const statsById = useMemo(
    () => _.keyBy(computeStats().playerStats, "id"),
    [],
  );
  const comp = seasonTypes[seasonType] ?? seasonTypes[1];
  const dataLost = Boolean(seasonInfo?.dataLost);

  useEffect(() => {
    const newTeams = _.orderBy(
      allTeams.filter((s) => s.season_id === season),
      ["location"],
      ["asc"],
    );
    setTeams(newTeams);
  }, [season, seasonType]);

  if (!teams.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: "1px dashed rgba(0,0,0,0.15)",
          color: "text.secondary",
        }}
      >
        <Typography sx={{ fontSize: 40 }}>🗒️</Typography>
        <Typography sx={{ fontWeight: 700, mt: 1 }}>
          אין נתונים לעונה זו
        </Typography>
      </Paper>
    );
  }

  const champion = teams[0];
  const championName = players[champion.player]?.label ?? "—";
  const topPoints = _.maxBy(teams, "points")?.points ?? 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 5 }}>
      {/* season title (by year) + league name shown separately */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          sx={{ fontWeight: 900, fontSize: { xs: "1.6rem", sm: "2rem" } }}
        >
          {comp.emoji} {comp.label}{" "}
          {formatSeasonYear(seasonInfo?.year, seasonType)}
        </Typography>
        {seasonInfo?.name && (
          <Chip
            label={seasonInfo.name}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: `${comp.accent}1f`,
              color: comp.color,
              border: `1px solid ${comp.accent}55`,
            }}
          />
        )}
        {dataLost && (
          <Chip
            label="נתונים אבדו"
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: `${comp.accent}14`,
              color: "text.secondary",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
        )}
      </Box>

      {/* summary stats */}
      <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
        <StatCard
          icon={<EmojiEventsIcon />}
          label="האלוף"
          value={championName}
          sub={isLostName(champion.team_name) ? undefined : champion.team_name}
          accent={comp.accent}
        />
        <StatCard
          icon={<GroupsIcon />}
          label="מספר משתתפים"
          value={teams.length}
          sub="קבוצות"
          accent={comp.accent}
        />
        {!dataLost && (
          <StatCard
            icon={<LocalFireDepartmentIcon />}
            label="שיא נקודות"
            value={topPoints}
            sub="בעונה"
            accent={comp.accent}
          />
        )}
      </Box>

      {/* podium */}
      <Podium
        teams={teams}
        players={players}
        accent={comp.accent}
        hidePoints={dataLost}
      />

      {/* full standings */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 10px 30px -18px rgba(17,24,39,0.35)",
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, sm: 2.5 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(0,0,0,0.02)",
          }}
        >
          <Typography sx={{ fontWeight: 800 }}>טבלת דירוג מלאה</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            👆 לחצו על שחקן לפרטים
          </Typography>
        </Box>
        <Divider />
        {teams.map((team, i) => (
          <StandingRow
            key={team.player}
            team={team}
            players={players}
            accent={comp.accent}
            isLast={i === teams.length - 1}
            hidePoints={dataLost}
            clickable={Boolean(statsById[team.player])}
            onClick={() => setSelected(statsById[team.player])}
          />
        ))}
      </Paper>

      {dataLost && (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "text.secondary",
            fontSize: "0.82rem",
            textAlign: "center",
            px: 2,
          }}
        >
          <span>🗄️</span>
          <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
            הנתונים לעונה זו אבדו — מוצג סדר הסיום בלבד, והעונה אינה נכללת
            בסטטיסטיקת הנקודות.
          </Typography>
        </Box>
      )}

      <PlayerDetailDialog player={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}

export default PlayerTable;
