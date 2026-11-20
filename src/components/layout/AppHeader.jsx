import { Box, Typography } from "@mui/material";
import _ from "lodash";
import { T, alpha } from "../../constants";
import allSeasons from "../../data/seasons.json";
import InstallButton from "./InstallButton";
import { NAV_ITEMS } from "./navItems";

// year is the END year of two-year seasons (2016 = 15/16)
const first = _.minBy(allSeasons.filter((s) => s.type === 1 || s.type === 4), "year");
const SINCE = first ? first.year - 1 : 2015;
const LOGO = `${import.meta.env.BASE_URL}favicon.svg`;

function DesktopNav({ view, onViewChange }) {
  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", md: "flex" },
        p: 0.5,
        gap: 0.5,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${T.border}`,
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
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 2,
              py: 0.9,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: "0.92rem",
              color: active ? T.bg : T.textDim,
              backgroundColor: active ? T.text : "transparent",
              transition: "all .2s ease",
              "&:hover": { color: active ? T.bg : T.text },
              "&:focus-visible": { outline: `2px solid ${alpha(T.text, 0.6)}`, outlineOffset: 2 },
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
            {label}
          </Box>
        );
      })}
    </Box>
  );
}

function AppHeader({ view, onViewChange }) {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backdropFilter: "saturate(160%) blur(16px)",
        WebkitBackdropFilter: "saturate(160%) blur(16px)",
        backgroundColor: "rgba(6,10,20,0.72)",
        borderBottom: `1px solid ${T.border}`,
        pt: "env(safe-area-inset-top)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          height: { xs: 60, sm: 68 },
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          component="a"
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onViewChange("seasons");
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            textDecoration: "none",
            color: "inherit",
            minWidth: 0,
          }}
        >
          <Box
            component="img"
            src={LOGO}
            alt=""
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: "11px",
              boxShadow: `0 0 0 1px ${T.borderHi}, 0 8px 24px -8px rgba(251,191,36,0.45)`,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 900, fontSize: { xs: "1.08rem", sm: "1.2rem" }, lineHeight: 1.1 }}
            >
              היכל התהילה
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "text.secondary",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              פנטזי ליג · מאז {SINCE}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />
        <DesktopNav view={view} onViewChange={onViewChange} />
        <InstallButton />
      </Box>
    </Box>
  );
}

export default AppHeader;
