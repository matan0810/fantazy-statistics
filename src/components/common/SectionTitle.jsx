import { Box, Typography } from "@mui/material";

// Section heading with a leading emoji and an optional muted sub-line.
function SectionTitle({ emoji, children, sub }) {
  return (
    <Box sx={{ mt: 2, mb: 1.5 }}>
      <Typography sx={{ fontWeight: 900, fontSize: "1.3rem" }}>
        <span style={{ marginInlineEnd: 8 }}>{emoji}</span>
        {children}
      </Typography>
      {sub && (
        <Typography
          sx={{ color: "text.secondary", fontSize: "0.82rem", mt: 0.25 }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export default SectionTitle;
