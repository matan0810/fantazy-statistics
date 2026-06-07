import { Box, Paper, Typography } from "@mui/material";

// A single summary tile (champion / participants / points record) shown above
// the standings. `accent` is the active competition color.
function SeasonStatCard({ icon, label, value, sub, accent }) {
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

export default SeasonStatCard;
