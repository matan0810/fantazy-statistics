import { Box } from "@mui/material";
import { T } from "../../constants";
import { NAV_ITEMS } from "./navItems";

// App-style bottom tab bar for phones (hidden from md up).
function BottomNav({ view, onViewChange }) {
  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        insetInline: 12,
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        zIndex: 1100,
        p: 0.75,
        gap: 0.75,
        borderRadius: "22px",
        backgroundColor: "rgba(15,22,38,0.82)",
        backdropFilter: "saturate(160%) blur(18px)",
        WebkitBackdropFilter: "saturate(160%) blur(18px)",
        border: `1px solid ${T.borderHi}`,
        boxShadow: "0 18px 40px -12px rgba(0,0,0,0.85)",
      }}
    >
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const active = view === key;
        return (
          <Box
            key={key}
            component="button"
            onClick={() => onViewChange(key)}
            aria-current={active ? "page" : undefined}
            sx={{
              all: "unset",
              flex: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 1.2,
              borderRadius: "16px",
              fontWeight: 800,
              fontSize: "0.92rem",
              color: active ? T.bg : T.textDim,
              backgroundColor: active ? T.text : "transparent",
              transition: "all .2s ease",
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
            {label}
          </Box>
        );
      })}
    </Box>
  );
}

export default BottomNav;
