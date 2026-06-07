import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function ProofDialog({ open, onClose, urls, seasonLabel }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

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
            component="img"
            src={urls[idx]}
            alt={`הוכחה ${idx + 1}`}
            sx={{
              flex: 1,
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: 2,
              display: "block",
            }}
          />

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
            sx={{ textAlign: "center", color: "text.secondary", fontSize: "0.78rem", mt: 1 }}
          >
            {idx + 1} / {urls.length}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProofDialog;
