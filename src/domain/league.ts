import players from '../data/players.json';
import proofs from '../data/proofs.json';
import results from '../data/results.json';
import seasons from '../data/seasons.json';
import { parseLeague } from './parse';

/** The league as built into the site. Validated once at load. */
export const league = parseLeague({ players, seasons, results, proofs });
