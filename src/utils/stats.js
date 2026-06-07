import _ from "lodash";
import allTeams from "../data/teams.json";
import allSeasons from "../data/seasons.json";
import { players, seasonTypes } from "../constants/options";

// Computes all-time, cross-season analytics from the raw team records.
// `location` is the final rank (1 = champion). Because each competition has a
// different number of game-weeks, points are only compared *within* a
// competition; across competitions we lean on averages and rankings instead.
// selectedTypes: optional Set of competition type keys to include (null = all)
export function computeStats(selectedTypes = null) {
  const seasonById = _.keyBy(allSeasons, "id");
  const typeOf = (r) => seasonById[r.season_id]?.type ?? r.type;

  const lostSeasonIds = new Set(
    allSeasons.filter((s) => s.dataLost).map((s) => s.id),
  );
  const allValidSeasons = allSeasons.filter((s) => !s.dataLost);
  const allValidTeams = allTeams.filter((t) => !lostSeasonIds.has(t.season_id));

  const validSeasons = selectedTypes
    ? allValidSeasons.filter((s) => selectedTypes.has(s.type))
    : allValidSeasons;
  const filteredIds = new Set(validSeasons.map((s) => s.id));
  const validTeams = selectedTypes
    ? allValidTeams.filter((t) => filteredIds.has(t.season_id))
    : allValidTeams;

  // --- per player aggregation ---
  const byPlayer = _.groupBy(validTeams, "player");

  const playerStats = Object.keys(players)
    .map((key) => {
      const id = parseInt(key);
      const records = byPlayer[id] ?? [];
      const golds = records.filter((r) => r.location === 1).length;
      const silvers = records.filter((r) => r.location === 2).length;
      const bronzes = records.filter((r) => r.location === 3).length;
      const totalPoints = _.sumBy(records, "points");
      const appearances = records.length;

      // titles split per competition type
      const titlesByType = {};
      records
        .filter((r) => r.location === 1)
        .forEach((r) => {
          titlesByType[typeOf(r)] = (titlesByType[typeOf(r)] ?? 0) + 1;
        });

      // per-competition breakdown — averages are comparable here since the
      // game count within a single competition is consistent.
      const byCompetition = _(records)
        .groupBy(typeOf)
        .map((recs, type) => {
          const comp = seasonTypes[type] ?? seasonTypes[1];
          return {
            comp,
            appearances: recs.length,
            avgPoints: Math.round(_.sumBy(recs, "points") / recs.length),
            bestPoints: _.maxBy(recs, "points").points,
            golds: recs.filter((r) => r.location === 1).length,
            podiums: recs.filter((r) => r.location <= 3).length,
            bestFinish: _.minBy(recs, "location").location,
          };
        })
        .orderBy(["golds", "appearances"], ["desc", "desc"])
        .value();

      // season-by-season history, newest first (for the detail dialog)
      const history = _.orderBy(
        records.map((r) => {
          const comp = seasonTypes[typeOf(r)] ?? seasonTypes[1];
          return {
            year: seasonById[r.season_id]?.year ?? r.year,
            location: r.location,
            points: r.points,
            team_name: r.team_name,
            comp,
          };
        }),
        ["year"],
        ["desc"],
      );

      return {
        id,
        name: players[id].label,
        appearances,
        golds,
        silvers,
        bronzes,
        podiums: golds + silvers + bronzes,
        totalPoints,
        avgPoints: appearances ? Math.round(totalPoints / appearances) : 0,
        bestFinish: appearances ? _.minBy(records, "location").location : null,
        titlesByType,
        byCompetition,
        history,
      };
    })
    .filter((p) => p.appearances > 0);

  // Hall of fame: most titles, tie-break by silvers then bronzes then average.
  const hallOfFame = _.orderBy(
    playerStats,
    ["golds", "silvers", "bronzes", "avgPoints"],
    ["desc", "desc", "desc", "desc"],
  );

  // --- single records ---
  const mostTitles = hallOfFame[0];
  const mostPodiums = _.maxBy(playerStats, "podiums");

  // Best *per-competition* season average. Averages are only ever compared
  // within a single competition (consistent game count) — never blended.
  let bestCompAverage = null;
  playerStats.forEach((p) =>
    p.byCompetition.forEach((c) => {
      if (
        c.appearances >= 2 &&
        (!bestCompAverage || c.avgPoints > bestCompAverage.avgPoints)
      ) {
        bestCompAverage = {
          name: p.name,
          avgPoints: c.avgPoints,
          comp: c.comp,
          appearances: c.appearances,
        };
      }
    }),
  );

  // --- per competition: champions ranking + season points record ---
  const titlesByCompetition = Object.values(seasonTypes)
    .filter((comp) => !selectedTypes || selectedTypes.has(comp.key))
    .map((comp) => {
    const compSeasonIds = new Set(
      validSeasons.filter((s) => s.type === comp.key).map((s) => s.id),
    );
    const compTeams = validTeams.filter((t) => compSeasonIds.has(t.season_id));

    const counts = _.countBy(
      compTeams.filter((t) => t.location === 1),
      "player",
    );
    const ranked = _.orderBy(
      Object.entries(counts).map(([pid, count]) => ({
        name: players[pid]?.label ?? "—",
        count,
      })),
      ["count"],
      ["desc"],
    );

    const recordTeam = compTeams.length ? _.maxBy(compTeams, "points") : null;
    const recordSeason = recordTeam && {
      name: players[recordTeam.player]?.label ?? "—",
      points: recordTeam.points,
      year: seasonById[recordTeam.season_id]?.year,
    };

    return {
      comp,
      seasons: compSeasonIds.size,
      topChampion: ranked[0] ?? null,
      ranked,
      recordSeason,
    };
  });

  return {
    playerStats,
    hallOfFame,
    records: { mostTitles, mostPodiums, bestCompAverage },
    titlesByCompetition,
    totals: {
      seasons: validSeasons.length,
      players: playerStats.length,
      records: validTeams.length,
    },
  };
}
