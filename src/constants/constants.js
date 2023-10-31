export const SERVER_URL = "http://localhost:3001/api";

export const TEAM_PROPERTIES = {
  seasonId: { key: "seasonId", form: false, required: true },
  location: {
    key: "location",
    label: "מיקום",
    form: true,
    required: true,
  },
  player: { key: "player", label: "שחקן", form: true },
  points: {
    key: "points",
    label: "נקודות",
    form: true,
    required: true,
  },
  team_name: {
    key: "team_name",
    label: "שם קבוצה",
    form: true,
    required: false,
  },
};
