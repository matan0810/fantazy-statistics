import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <span>📸</span>
          <span>הוכחה · {seasonLabel}</span>
        </Box>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 0 }}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {multi && (
            <IconButton
              onClick={() => setIdx((i) => (i - 1 + urls.length) % urls.length)}
              size="small"
              sx={{ flexShrink: 0 }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}
            <Box
              component="img"
              src={urls[idx]}
              alt={`הוכחה ${idx + 1}`}
              onLoad={() => setLoadedIdx(idx)}
              onError={() => setLoadedIdx(idx)}
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: 2,
                display: "block",
                opacity: loading ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
          </Box>

          {multi && (
            <IconButton
              onClick={() => setIdx((i) => (i + 1) % urls.length)}
              size="small"
              sx={{ flexShrink: 0 }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        {multi && (
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: "0.78rem",
              mt: 1,
            }}
          >
            {idx + 1} / {urls.length}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProofDialog;
