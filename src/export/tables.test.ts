import { describe, expect, it } from 'vitest';
import { league } from '../domain/league';
import { medalTable, seasonById, standings } from '../domain/stats';
import { STRINGS } from '../i18n/strings';
import { archiveCsv, medalCsv, standingsCsv } from './tables';

const t = STRINGS.he;
const name = (p: { name: { he: string } }) => p.name.he;

describe('CSV tables', () => {
  it('writes a season with its gaps', () => {
    const season = seasonById(league, 4);
    if (!season) throw new Error('missing season');
    const lines = standingsCsv(standings(league, season), t, name).split('\r\n');
    expect(lines[0]).toBe('﻿מקום,שחקן,קבוצה,מאמן,נקודות,פער מהראשון');
    expect(lines[1]).toBe('1,מתן,FC agvaniya,לביא,582,');
    expect(lines).toHaveLength(5);
  });

  it('writes the medal table in order', () => {
    const lines = medalCsv(medalTable(league), t, name).split('\r\n');
    expect(lines[1]).toBe('1,מתן,23,11,8,2,21');
  });

  it('writes one row per result in the archive', () => {
    expect(archiveCsv(league, t, name).split('\r\n')).toHaveLength(league.results.length + 1);
  });
});
