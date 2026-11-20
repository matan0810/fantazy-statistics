import { Box, Typography } from "@mui/material";

// Section heading: optional icon chip, title, muted sub-line, and an optional
// action slot on the far side.
function SectionTitle({ emoji, children, sub, action }) {
  return (
    <Box sx={{ mt: 3.5, mb: 1.5, display: "flex", alignItems: "flex-end", gap: 1.5 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography component="h2" sx={{ fontWeight: 900, fontSize: { xs: "1.25rem", sm: "1.4rem" }, display: "flex", alignItems: "center", gap: 1 }}>
          {emoji && <span style={{ fontSize: "1.1em" }}>{emoji}</span>}
          {children}
        </Typography>
        {sub && (
          <Typography sx={{ color: "text.secondary", fontSize: "0.82rem", mt: 0.25 }}>{sub}</Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}

export default SectionTitle;
