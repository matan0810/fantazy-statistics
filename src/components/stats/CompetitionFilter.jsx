import { Box, Typography } from "@mui/material";
import { seasonTypes } from "../../constants";

// Multi-select competition filter chips. The parent guarantees at least one
// competition stays active.
function CompetitionFilter({ selected, onToggle }) {
  const options = Object.values(seasonTypes);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        mb: 1.5,
        p: 1.25,
        borderRadius: 3,
        backgroundColor: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        סנן:
      </Typography>
      {options.map((o) => {
        const active = selected.has(o.key);
        return (
          <Box
            key={o.key}
            onClick={() => onToggle(o.key)}
            sx={{
              cursor: "pointer",
              userSelect: "none",
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "1.5px solid",
              borderColor: active ? o.color : "rgba(0,0,0,0.15)",
              backgroundColor: active ? o.color : "rgba(0,0,0,0.04)",
              color: active ? "#fff" : "#777",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": {
                borderColor: o.color,
                backgroundColor: active ? o.color : `${o.color}22`,
                color: active ? "#fff" : o.color,
              },
            }}
          >
            <span>{o.emoji}</span>
            {o.label}
            {active && (
              <span
                style={{ fontSize: "0.7rem", opacity: 0.85, marginInlineStart: 2 }}
              >
                ✓
              </span>
            )}
          </Box>
        );
      })}
      <Typography sx={{ fontSize: "0.72rem", color: "text.disabled", mr: "auto" }}>
        לחצו לבחירה מרובה
      </Typography>
    </Box>
  );
}

export default CompetitionFilter;
