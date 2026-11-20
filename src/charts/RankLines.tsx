import { useState, type CSSProperties } from 'react';
import { seasonLabel } from '../domain/competitions';
import { routeHash } from '../domain/routes';
import type { RankChart, RankLine, RankPoint } from '../domain/stats';
import { useElementWidth } from '../hooks/useElementWidth';
import { navigate } from '../hooks/useRoute';
import { useI18n } from '../i18n/context';
import { PlayerDot } from '../ui/Badges';
import { labelStep, linePaths, xOf, yOf, type Frame } from './geometry';
import styles from './RankLines.module.css';

interface Props {
  chart: RankChart;
  /** Player page: this player's line stands out, there is no legend. */
  focus?: number;
  /** A shorter chart, for a list of several. */
  compact?: boolean;
}

interface Probe {
  line: RankLine;
  point: RankPoint;
  pinned: boolean;
}

const vars = (v: Record<string, string>) => v as CSSProperties;

/**
 * The signature chart: every player is a line through the seasons of one competition,
 * placed by final rank (first at the top). Champion seasons are gold dots. Hovering or
 * choosing a player picks out their line; a dot shows the season and links to it.
 */
export function RankLines({ chart, focus, compact = false }: Props) {
  const { t, name, language } = useI18n();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [pointer, setPointer] = useState<string>('mouse');

  const active = focus ?? probe?.line.player.id ?? hovered ?? selected;
  const frame: Frame = {
    width,
    height: compact ? 150 : Math.round(Math.min(400, Math.max(250, width * 0.4))),
    padTop: 18,
    padBottom: 30,
    padStart: 30,
    padEnd: 18,
    columns: chart.seasons.length,
    maxRank: chart.maxRank,
    rtl: language === 'he',
  };
  const step = labelStep(width - frame.padStart - frame.padEnd, chart.seasons.length);
  const ranks = Array.from({ length: chart.maxRank }, (_, i) => i + 1);
  // the active line is drawn last, so it sits on top
  const ordered = [...chart.lines].sort(
    (a, b) => Number(a.player.id === active) - Number(b.player.id === active),
  );

  const onDot = (line: RankLine, point: RankPoint) => {
    if (pointer === 'mouse') navigate({ name: 'season', id: point.season.id });
    else setProbe({ line, point, pinned: true });
  };

  return (
    <div>
      <div className={styles.wrap} ref={ref} onPointerDown={(e) => setPointer(e.pointerType)}>
        {width > 0 && (
          <svg
            key={chart.competition}
            className={styles.svg}
            width={width}
            height={frame.height}
            role="img"
            aria-label={t.linesLabel(t.competition[chart.competition])}
            onPointerLeave={() => {
              setHovered(null);
              if (!probe?.pinned) setProbe(null);
            }}
          >
            {ranks.map((r) => (
              <g key={r}>
                <line
                  className={r === 1 ? `${styles.grid} ${styles.gridTop}` : styles.grid}
                  x1={frame.rtl ? frame.padEnd : frame.padStart}
                  x2={frame.rtl ? width - frame.padStart : width - frame.padEnd}
                  y1={yOf(frame, r)}
                  y2={yOf(frame, r)}
                />
                {(!compact || r === 1 || r === chart.maxRank) && (
                  <text
                    className={r === 1 ? `${styles.axis} ${styles.axisTop}` : styles.axis}
                    x={frame.rtl ? width - 8 : 8}
                    y={yOf(frame, r) + 4}
                    textAnchor={frame.rtl ? 'end' : 'start'}
                  >
                    {r}
                  </text>
                )}
              </g>
            ))}

            {chart.seasons.map((s, i) =>
              i % step === (chart.seasons.length - 1) % step ? (
                <text
                  key={s.id}
                  className={styles.axis}
                  x={xOf(frame, i)}
                  y={frame.height - 6}
                  textAnchor="middle"
                >
                  {seasonLabel(s.year, s.competition)}
                </text>
              ) : null,
            )}

            {ordered.map((line, li) => {
              const { solid, bridges } = linePaths(frame, line.points);
              const isActive = line.player.id === active;
              const delay = `${li * 70}ms`;
              return (
                <g
                  key={line.player.id}
                  className={styles.series}
                  data-dim={active != null && !isActive ? '' : undefined}
                  data-active={isActive ? '' : undefined}
                  style={vars({ '--delay': delay })}
                  onPointerEnter={() => focus == null && setHovered(line.player.id)}
                >
                  {/* Keyed by position, not shape: a resize reshapes the paths in place
                      instead of mounting new ones, which would replay the draw-in. */}
                  {bridges.map((d, i) => (
                    <path
                      key={`b${i}`}
                      d={d}
                      className={styles.bridge}
                      stroke={line.player.color}
                    />
                  ))}
                  {solid.map((d, i) => (
                    <path
                      key={`s${i}`}
                      d={d}
                      className={styles.line}
                      stroke={line.player.color}
                      pathLength={1}
                    />
                  ))}
                  {focus == null &&
                    [...solid, ...bridges].map((d, i) => (
                      <path key={`h${i}`} d={d} className={styles.hit} />
                    ))}
                  {line.points.map((p) => (
                    <circle
                      key={p.season.id}
                      className={styles.dot}
                      data-champion={p.rank === 1 ? '' : undefined}
                      cx={xOf(frame, p.index)}
                      cy={yOf(frame, p.rank)}
                      r={p.rank === 1 ? (compact ? 4.5 : 5.5) : compact ? 3 : 3.5}
                      fill={line.player.color}
                      stroke={p.rank === 1 ? line.player.color : undefined}
                      style={vars({ '--delay': `${900 + li * 70}ms` })}
                      onPointerEnter={() => setProbe({ line, point: p, pinned: false })}
                      onClick={() => onDot(line, p)}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        )}

        {probe && (
          <div
            className={styles.tip}
            data-pinned={probe.pinned ? '' : undefined}
            style={{
              left: Math.min(Math.max(xOf(frame, probe.point.index), 90), width - 90),
              top: yOf(frame, probe.point.rank),
            }}
          >
            <div className={styles.tipName}>
              <PlayerDot player={probe.line.player} />
              {name(probe.line.player)}
            </div>
            <div className={styles.tipLine}>
              {t.competition[probe.point.season.competition]}{' '}
              {seasonLabel(probe.point.season.year, probe.point.season.competition)}
            </div>
            <div className="num">
              {t.rankValue(probe.point.rank)} / {probe.point.field}
              {probe.point.points !== null && ` · ${t.pointsValue(probe.point.points)}`}
            </div>
            {probe.pinned && (
              <a
                className={styles.tipLink}
                href={routeHash({ name: 'season', id: probe.point.season.id })}
              >
                {t.nav.seasons} ›
              </a>
            )}
          </div>
        )}
      </div>

      {focus == null && (
        <div className={styles.legend} role="group" aria-label={t.player}>
          <button
            type="button"
            className={styles.chip}
            aria-pressed={selected === null}
            onClick={() => {
              setSelected(null);
              setProbe(null);
            }}
          >
            {t.showAll}
          </button>
          {chart.lines.map((line) => (
            <button
              key={line.player.id}
              type="button"
              className={styles.chip}
              style={vars({ '--color': line.player.color })}
              aria-pressed={selected === line.player.id}
              onClick={() => {
                setProbe(null);
                setSelected(selected === line.player.id ? null : line.player.id);
              }}
              onPointerEnter={() => setHovered(line.player.id)}
              onPointerLeave={() => setHovered(null)}
            >
              <PlayerDot player={line.player} />
              {name(line.player)}
              {line.titles > 0 && <span className={styles.count}>{line.titles}</span>}
            </button>
          ))}
        </div>
      )}

      {/* The same data as a table, for screen readers. Hidden in a div: a table ignores
          its own width and would widen the page. */}
      <div className="visually-hidden">
        <table>
          <caption>{t.linesLabel(t.competition[chart.competition])}</caption>
          <thead>
            <tr>
              <th>{t.player}</th>
              {chart.seasons.map((s) => (
                <th key={s.id}>{seasonLabel(s.year, s.competition)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.lines.map((line) => (
              <tr key={line.player.id}>
                <th>{name(line.player)}</th>
                {chart.seasons.map((s) => (
                  <td key={s.id}>{line.points.find((p) => p.season.id === s.id)?.rank ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
