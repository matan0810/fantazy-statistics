import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { formatSeasonYear } from "../../utils";

// Season title line: competition + year, plus optional league-name chip, a
// "data lost" chip, and a proof-screenshot button when proofs exist.
function SeasonHeader({ comp, seasonInfo, seasonType, dataLost, hasProof, onProofClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1.5,
      }}
    >
      <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.6rem", sm: "2rem" } }}>
        {comp.emoji} {comp.label} {formatSeasonYear(seasonInfo?.year, seasonType)}
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
      {hasProof && (
        <Tooltip title="הצג הוכחה" arrow>
          <IconButton
            size="small"
            onClick={onProofClick}
            sx={{
              color: comp.accent,
              backgroundColor: `${comp.accent}15`,
              "&:hover": { backgroundColor: `${comp.accent}28` },
              transition: "all 0.18s",
            }}
          >
            <VerifiedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default SeasonHeader;
