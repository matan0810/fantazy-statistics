import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import InstallMobileRounded from "@mui/icons-material/InstallMobileRounded";
import IosShareRounded from "@mui/icons-material/IosShareRounded";
import AddBoxOutlined from "@mui/icons-material/AddBoxOutlined";
import MoreVertRounded from "@mui/icons-material/MoreVertRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { T } from "../../constants";
import { useInstall } from "../../utils";

function Step({ n, icon, children }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontWeight: 900,
          fontSize: "0.85rem",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: `1px solid ${T.borderHi}`,
        }}
      >
        {n}
      </Box>
      <Typography sx={{ flex: 1, fontWeight: 600, fontSize: "0.95rem" }}>{children}</Typography>
      {icon}
    </Box>
  );
}

function InstallDialog({ open, onClose, ios }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "22px" } }}>
      <DialogContent sx={{ p: 3, position: "relative" }}>
        <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 12, left: 12 }}>
          <CloseRounded fontSize="small" />
        </IconButton>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}icons/icon-192.png`}
          alt=""
          sx={{ width: 64, height: 64, borderRadius: "16px", mb: 1.5 }}
        />
        <Typography sx={{ fontWeight: 900, fontSize: "1.3rem" }}>התקנת האפליקציה</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mb: 2 }}>
          הוסיפו את היכל התהילה למסך הבית — נפתח במסך מלא ועובד גם בלי אינטרנט.
        </Typography>
        {ios ? (
          <>
            <Step n={1} icon={<IosShareRounded sx={{ color: "primary.main" }} />}>
              לחצו על כפתור השיתוף בספארי
            </Step>
            <Step n={2} icon={<AddBoxOutlined sx={{ color: "primary.main" }} />}>
              בחרו „הוספה למסך הבית”
            </Step>
            <Step n={3}>אשרו ב„הוספה” — וזהו!</Step>
          </>
        ) : (
          <>
            <Step n={1} icon={<MoreVertRounded sx={{ color: "primary.main" }} />}>
              פתחו את תפריט הדפדפן
            </Step>
            <Step n={2} icon={<InstallMobileRounded sx={{ color: "primary.main" }} />}>
              בחרו „התקנת אפליקציה” / „הוספה למסך הבית”
            </Step>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// "Download the app" — fires the native install prompt when the browser offers
// one, otherwise shows short manual instructions (iOS Safari etc.).
function InstallButton() {
  const { canPrompt, installed, ios, prompt } = useInstall();
  const [help, setHelp] = useState(false);

  if (installed) return null;

  const onClick = async () => {
    if (canPrompt) await prompt();
    else setHelp(true);
  };

  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        disableElevation
        startIcon={<InstallMobileRounded sx={{ ml: -0.5 }} />}
        sx={{
          flexShrink: 0,
          borderRadius: 999,
          px: { xs: 1.6, sm: 2.2 },
          py: 0.85,
          fontWeight: 800,
          fontSize: { xs: "0.82rem", sm: "0.9rem" },
          color: "#1a1206",
          background: "linear-gradient(135deg, #fde68a, #f59e0b)",
          boxShadow: "0 8px 22px -10px rgba(245,158,11,0.8)",
          "& .MuiButton-startIcon": { marginInlineStart: 0, marginInlineEnd: 0.75 },
          "&:hover": { background: "linear-gradient(135deg, #fef3c7, #fbbf24)" },
        }}
      >
        הורדת האפליקציה
      </Button>
      <InstallDialog open={help} onClose={() => setHelp(false)} ios={ios} />
    </>
  );
}

export default InstallButton;
