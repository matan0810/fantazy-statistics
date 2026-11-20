import { Box } from "@mui/material";
import { seasonTypes, T, alpha } from "../../constants";

// Four-way competition switcher. Each tab carries its tournament color.
function CompetitionTabs({ value, onChange }) {
  return (
    <Box
      role="tablist"
      aria-label="תחרות"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: { xs: 0.75, sm: 1 },
        mb: 2,
      }}
    >
      {Object.values(seasonTypes).map((c) => {
        const active = c.key === value;
        return (
          <Box
            key={c.key}
            role="tab"
            component="button"
            aria-selected={active}
            onClick={() => onChange(c.key)}
            sx={{
              all: "unset",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.25, sm: 1 },
              py: { xs: 1.1, sm: 1.4 },
              px: 1,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: active ? alpha(c.color, 0.55) : T.border,
              background: active
                ? `linear-gradient(160deg, ${alpha(c.color, 0.28)}, ${alpha(c.color, 0.06)})`
                : "rgba(255,255,255,0.025)",
              color: active ? T.text : T.textDim,
              boxShadow: active ? `0 10px 30px -14px ${c.color}` : "none",
              transition: "all .2s ease",
              "&:hover": { color: T.text, borderColor: alpha(c.color, 0.4) },
              "&:focus-visible": { outline: `2px solid ${c.color}`, outlineOffset: 2 },
              "&::after": {
                content: '""',
                position: "absolute",
                insetInline: "22%",
                bottom: 0,
                height: 3,
                borderRadius: "3px 3px 0 0",
                backgroundColor: c.color,
                opacity: active ? 1 : 0,
                transition: "opacity .2s",
              },
            }}
          >
            <Box component="span" sx={{ fontSize: { xs: 20, sm: 18 }, lineHeight: 1 }}>
              {c.emoji}
            </Box>
            <Box
              component="span"
              sx={{ fontWeight: 800, fontSize: { xs: "0.78rem", sm: "0.95rem" }, whiteSpace: "nowrap" }}
            >
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {c.short}
              </Box>
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {c.label}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default CompetitionTabs;
