import _ from "lodash";
import allTeams from "../data/teams.json";
import allSeasons from "../data/seasons.json";
import { players, seasonTypes } from "../constants/options";
import { formatSeasonYear, isLostName } from "./format";
import { downloadCsv } from "./export";

const seasonById = _.keyBy(allSeasons, "id");
const name = (pid) => players[pid]?.label ?? "";
const team = (t) => (isLostName(t.team_name) ? "" : t.team_name);

export const SEASON_HEADERS = ["מקום", "שחקן", "שם הקבוצה", "מאמן", "נקודות", "פער מהמקום הראשון"];

export function seasonRows(teams, dataLost) {
  const top = teams[0]?.points ?? 0;
  return teams.map((t) => [
    t.location ?? "",
    name(t.player),
    team(t),
    t.coach ?? "",
    dataLost ? "" : t.points,
    dataLost || t.location === 1 ? "" : top - t.points,
  ]);
}

// Full archive: every season, every team.
export function downloadAllData() {
  const rows = _.orderBy(
    allTeams.map((t) => ({ t, s: seasonById[t.season_id] })),
    [({ s }) => s?.type, ({ s }) => s?.year, ({ t }) => t.location],
    ["asc", "desc", "asc"],
  ).map(({ t, s }) => [
    seasonTypes[s?.type]?.label ?? "",
    formatSeasonYear(s?.year, s?.type),
    s?.name ?? "",
    t.location ?? "",
    name(t.player),
    team(t),
    t.coach ?? "",
    s?.dataLost ? "" : t.points,
    s?.dataLost ? "נתוני נקודות אבדו" : "",
  ]);
  downloadCsv(
    "היכל_התהילה_כל_הנתונים",
    ["תחרות", "עונה", "שם הליגה", "מקום", "שחקן", "שם הקבוצה", "מאמן", "נקודות", "הערה"],
    rows,
  );
}
