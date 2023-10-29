export const SERVER_URL = "http://localhost:3001/api";

export const FORM_TYPES = { text: 1, number: 2, boolean: 3, select: 4 };

export const TEAM_PROPERTIES = {
  seasonId: { key: "seasonId", form: false },
  location: { key: "location", type: FORM_TYPES.number, form: true },
  player: { key: "player", type: FORM_TYPES.select, form: true },
  points: { key: "points", type: FORM_TYPES.number, form: true },
};
