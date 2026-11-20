import { useState } from "react";
import {
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import FileDownloadRounded from "@mui/icons-material/FileDownloadRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import TableChartRounded from "@mui/icons-material/TableChartRounded";
import ShareRounded from "@mui/icons-material/ShareRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import { downloadBlob, downloadCsv, downloadAllData, canShareFiles, shareFile, safeFileName } from "../../utils";

/**
 * "הורדה" menu used on season and stats screens.
 *  - image:  { name, render: async () => Blob }   → PNG share card
 *  - csv:    { name, headers, rows }              → Excel-friendly CSV
 *  - includeAll: add "full archive" CSV entry
 */
function ExportMenu({ image, csv, includeAll = true, variant = "glass", title }) {
  const [anchor, setAnchor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const share = canShareFiles();

  const close = () => setAnchor(null);
  const done = (msg) => setToast(msg);

  const withImage = async (fn) => {
    close();
    setBusy(true);
    try {
      const blob = await image.render();
      await fn(blob, `${safeFileName(image.name)}.png`);
    } catch {
      setToast("error");
    } finally {
      setBusy(false);
    }
  };

  const glass = variant === "glass";

  return (
    <>
      <Button
        onClick={(e) => setAnchor(e.currentTarget)}
        disabled={busy}
        aria-haspopup="menu"
        startIcon={
          busy ? <CircularProgress size={16} color="inherit" /> : <FileDownloadRounded />
        }
        sx={{
          borderRadius: 999,
          px: 1.8,
          py: 0.7,
          fontWeight: 800,
          fontSize: "0.85rem",
          color: "#fff",
          backgroundColor: glass ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(8px)",
          "& .MuiButton-startIcon": { marginInlineStart: 0, marginInlineEnd: 0.75 },
          "&:hover": { backgroundColor: "rgba(255,255,255,0.24)" },
        }}
      >
        הורדה
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { mt: 1, minWidth: 250 } } }}
      >
        {title && (
          <MenuItem disabled sx={{ opacity: "1 !important", fontSize: "0.75rem", fontWeight: 800, color: "text.secondary" }}>
            {title}
          </MenuItem>
        )}
        {image && (
          <MenuItem
            onClick={() =>
              withImage((blob, fname) => {
                downloadBlob(blob, fname);
                done("התמונה נשמרה");
              })
            }
          >
            <ListItemIcon><ImageRounded fontSize="small" /></ListItemIcon>
            <ListItemText primary="תמונה לשיתוף" secondary="PNG · מוכן לוואטסאפ ולאינסטגרם" />
          </MenuItem>
        )}
        {image && share && (
          <MenuItem
            onClick={() =>
              withImage(async (blob, fname) => {
                const ok = await shareFile(blob, fname, image.name);
                if (!ok) {
                  downloadBlob(blob, fname);
                  done("התמונה נשמרה");
                }
              })
            }
          >
            <ListItemIcon><ShareRounded fontSize="small" /></ListItemIcon>
            <ListItemText primary="שיתוף ישיר" secondary="שליחה מהטלפון" />
          </MenuItem>
        )}
        {csv && (
          <MenuItem
            onClick={() => {
              close();
              downloadCsv(csv.name, csv.headers, csv.rows);
              done("הקובץ ירד");
            }}
          >
            <ListItemIcon><TableChartRounded fontSize="small" /></ListItemIcon>
            <ListItemText primary="טבלה לאקסל" secondary="CSV · נפתח ב-Excel / Sheets" />
          </MenuItem>
        )}
        {includeAll && <Divider />}
        {includeAll && (
          <MenuItem
            onClick={() => {
              close();
              downloadAllData();
              done("הארכיון המלא ירד");
            }}
          >
            <ListItemIcon><Inventory2Rounded fontSize="small" /></ListItemIcon>
            <ListItemText primary="הארכיון המלא" secondary="כל העונות וכל התחרויות · CSV" />
          </MenuItem>
        )}
      </Menu>
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2600}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: "calc(96px + env(safe-area-inset-bottom)) !important", md: 24 } }}
      >
        <Alert
          severity={toast === "error" ? "error" : "success"}
          variant="filled"
          onClose={() => setToast(null)}
          sx={{ fontWeight: 700, borderRadius: 3 }}
        >
          {toast === "error" ? "משהו השתבש — נסו שוב" : toast}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ExportMenu;
