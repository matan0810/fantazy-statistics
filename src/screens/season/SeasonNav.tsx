import { useEffect, useRef, type CSSProperties } from 'react';
import { COMPETITIONS, competition, seasonLabel } from '../../domain/competitions';
import { league } from '../../domain/league';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { navigate } from '../../hooks/useRoute';
import { latestSeason, seasonsOf } from '../../domain/stats';
import type { Season } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { Button } from '../../ui/Button';
import { ChevronIcon } from '../../ui/icons';
import { Segmented } from '../../ui/Segmented';
import styles from './SeasonNav.module.css';

/**
 * Competition switch, then every season of it in time order with earlier / later
 * buttons. The arrow keys step through seasons in the reading direction.
 */
export function SeasonNav({ season }: { season: Season }) {
  const { t, language } = useI18n();
  const rail = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery('(max-width: 640px)');
  const seasons = seasonsOf(league, season.competition).reverse();
  const at = seasons.findIndex((s) => s.id === season.id);
  const earlier = seasons[at - 1];
  const later = seasons[at + 1];

  useEffect(() => {
    const box = rail.current;
    const current = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!box || !current) return;
    const a = box.getBoundingClientRect();
    const b = current.getBoundingClientRect();
    box.scrollBy({ left: b.left + b.width / 2 - (a.left + a.width / 2), behavior: 'smooth' });
  }, [season.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (e.target as HTMLElement).closest('input, textarea, dialog')
      )
        return;
      const forward = language === 'he' ? 'ArrowLeft' : 'ArrowRight';
      const back = language === 'he' ? 'ArrowRight' : 'ArrowLeft';
      const next = e.key === forward ? later : e.key === back ? earlier : undefined;
      if (next) {
        e.preventDefault();
        navigate({ name: 'season', id: next.id });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [earlier, later, language]);

  return (
    <div className={styles.nav}>
      <Segmented
        label={t.pickCompetition}
        value={season.competition}
        onChange={(id) => {
          const latest = latestSeason(league, id);
          if (latest) navigate({ name: 'season', id: latest.id });
        }}
        options={COMPETITIONS.map((c) => ({
          value: c.id,
          label: narrow ? t.competitionShort[c.id] : t.competition[c.id],
          swatch: c.color,
        }))}
      />
      <div
        className={styles.rail}
        style={{ '--accent': competition(season.competition).color } as CSSProperties}
      >
        <Button
          icon
          aria-label={t.earlier}
          title={t.earlier}
          disabled={!earlier}
          onClick={() => earlier && navigate({ name: 'season', id: earlier.id })}
        >
          <ChevronIcon back />
        </Button>
        <div className={styles.years} ref={rail} role="group" aria-label={t.pickSeason}>
          {seasons.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.year} num`}
              aria-current={s.id === season.id}
              data-lost={s.pointsLost ? '' : undefined}
              title={s.pointsLost ? t.pointsLost : undefined}
              onClick={() => navigate({ name: 'season', id: s.id })}
            >
              {seasonLabel(s.year, s.competition)}
            </button>
          ))}
        </div>
        <Button
          icon
          aria-label={t.later}
          title={t.later}
          disabled={!later}
          onClick={() => later && navigate({ name: 'season', id: later.id })}
        >
          <ChevronIcon />
        </Button>
      </div>
    </div>
  );
}
