import { useState } from "react";
import { Dialog, IconButton, Box, Typography, CircularProgress, Tooltip } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import { T } from "../constants";

const navBtn = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  color: "#fff",
  backgroundColor: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(6px)",
  border: `1px solid ${T.borderHi}`,
  "&:hover": { backgroundColor: "rgba(0,0,0,0.75)" },
};

function ProofDialog({ open, onClose, urls, seasonLabel }) {
  const [idx, setIdx] = useState(0);
  const [loadedIdx, setLoadedIdx] = useState(null);
  const loading = loadedIdx !== idx;

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setIdx(0);
  }

  if (!urls?.length) return null;
  const multi = urls.length > 1;
  const url = urls[idx];
  const fileName = decodeURIComponent(url.split("/").pop());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "22px", overflow: "hidden" } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5, borderBottom: `1px solid ${T.border}` }}>
        <VerifiedRounded sx={{ color: "primary.main" }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: "1rem", lineHeight: 1.2 }} noWrap>
            הוכחה רשמית
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.78rem" }} noWrap>
            {seasonLabel}
            {multi && ` · ${idx + 1}/${urls.length}`}
          </Typography>
        </Box>
        <Tooltip title="הורדת צילום המסך" arrow>
          <IconButton component="a" href={url} download={fileName} size="small">
            <FileDownloadRounded fontSize="small" />
          </IconButton>
        </Tooltip>
        <IconButton onClick={onClose} size="small" aria-label="סגירה">
          <CloseRounded fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ position: "relative", backgroundColor: "#03060d", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", p: 1.5 }}>
        {loading && <CircularProgress size={36} sx={{ position: "absolute" }} />}
        <Box
          component="img"
          src={url}
          alt={`הוכחה ${idx + 1}`}
          onLoad={() => setLoadedIdx(idx)}
          onError={() => setLoadedIdx(idx)}
          sx={{
            maxWidth: "100%",
            maxHeight: "72vh",
            objectFit: "contain",
            borderRadius: "10px",
            display: "block",
            opacity: loading ? 0 : 1,
            transition: "opacity .2s ease",
          }}
        />
        {multi && (
          <>
            <IconButton aria-label="הקודם" onClick={() => setIdx((i) => (i - 1 + urls.length) % urls.length)} sx={{ ...navBtn, right: 10 }}>
              <ChevronRightRounded />
            </IconButton>
            <IconButton aria-label="הבא" onClick={() => setIdx((i) => (i + 1) % urls.length)} sx={{ ...navBtn, left: 10 }}>
              <ChevronLeftRounded />
            </IconButton>
          </>
        )}
      </Box>

      {multi && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, py: 1.25 }}>
          {urls.map((u, i) => (
            <Box
              key={u}
              component="button"
              aria-label={`תמונה ${i + 1}`}
              onClick={() => setIdx(i)}
              sx={{ all: "unset", cursor: "pointer", width: i === idx ? 20 : 7, height: 7, borderRadius: 999, backgroundColor: i === idx ? "primary.main" : T.borderHi, transition: "all .2s" }}
            />
          ))}
        </Box>
      )}
    </Dialog>
  );
}

export default ProofDialog;
