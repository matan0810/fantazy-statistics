import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { seasonLabel } from '../domain/competitions';
import { routeHash } from '../domain/routes';
import type { RankChart, RankLine, RankPoint } from '../domain/stats';
import { useElementWidth } from '../hooks/useElementWidth';
import { useReveal } from '../hooks/useReveal';
import { navigate } from '../hooks/useRoute';
import { useI18n } from '../i18n/context';
import { PlayerDot } from '../ui/Badges';
import { indexAt, labelStep, linePaths, xOf, yOf, type Frame } from './geometry';
import styles from './RankLines.module.css';
import { fullView, isZoomed, panView, zoomView, type View } from './zoom';

interface Props {
  chart: RankChart;
  /** Player page: this player's line stands out, there is no legend. */
  focus?: number;
  /** A shorter chart. */
  compact?: boolean;
}

interface Probe {
  line: RankLine;
  point: RankPoint;
  pinned: boolean;
}

const vars = (v: Record<string, string>) => v as CSSProperties;
const STEP = 0.6; // zoom factor of one button press

/**
 * The signature chart: every player is a line through the seasons of one competition,
 * placed by final rank (first at the top). Champion seasons are gold dots. Time runs left
 * to right, as on any chart. The time axis zooms (buttons, pinch, Ctrl+wheel, double
 * click) and pans (drag). Hovering or choosing a player picks out their line; a dot
 * shows the season and links to it.
 */
export function RankLines({ chart, focus, compact = false }: Props) {
  const { t, name } = useI18n();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  // the lines draw themselves when the chart comes into view, not when the page loads
  const [revealRef, shown] = useReveal<HTMLDivElement>();
  const clipId = `clip-${useId().replace(/:/g, '')}`;
  const columns = chart.seasons.length;
  // Several players can be picked to compare their lines; none picked shows everyone alike.
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [view, setView] = useState<View>(() => fullView(columns));
  // a new competition starts on its whole history
  const [viewOf, setViewOf] = useState(chart.competition);
  if (viewOf !== chart.competition) {
    setViewOf(chart.competition);
    setView(fullView(columns));
    setProbe(null);
  }

  const frame: Frame = {
    width,
    height: compact ? 170 : Math.round(Math.min(400, Math.max(250, width * 0.4))),
    padTop: 18,
    padBottom: 30,
    padStart: 30,
    padEnd: 20,
    maxRank: chart.maxRank,
    view,
  };
  const plotWidth = width - frame.padStart - frame.padEnd;
  const zoomed = isZoomed(view, columns);
  const canZoom = columns > 3;

  // Gestures: pointers by id, the drag or pinch in progress, and whether it moved
  // (a drag must not also count as a click on a dot).
  const gesture = useRef<{
    pointers: Map<number, number>;
    startView: View;
    startX: number;
    startDistance: number;
    moved: boolean;
    type: string;
  }>({
    pointers: new Map(),
    startView: view,
    startX: 0,
    startDistance: 0,
    moved: false,
    type: 'mouse',
  });

  const localX = (clientX: number) => clientX - (svgRef.current?.getBoundingClientRect().left ?? 0);

  // Ctrl+wheel and trackpad pinch (which browsers send as a wheel with ctrlKey).
  // A native listener: React's wheel handler is passive and could not stop the page zoom.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !canZoom) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const f = { ...frame, view };
      setView(zoomView(view, Math.exp(e.deltaY * 0.01), indexAt(f, localX(e.clientX)), columns));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  });

  const onPointerDown = (e: React.PointerEvent) => {
    const g = gesture.current;
    g.type = e.pointerType;
    g.pointers.set(e.pointerId, localX(e.clientX));
    g.startView = view;
    g.moved = false;
    const xs = [...g.pointers.values()];
    g.startX = xs[0] ?? 0;
    g.startDistance = xs.length === 2 ? Math.abs((xs[0] ?? 0) - (xs[1] ?? 0)) : 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g.pointers.has(e.pointerId) || !canZoom) return;
    g.pointers.set(e.pointerId, localX(e.clientX));
    const xs = [...g.pointers.values()];
    const span = g.startView.to - g.startView.from;
    if (xs.length === 2 && g.startDistance > 10) {
      const distance = Math.abs((xs[0] ?? 0) - (xs[1] ?? 0));
      const mid = ((xs[0] ?? 0) + (xs[1] ?? 0)) / 2;
      g.moved = true;
      setView(
        zoomView(
          g.startView,
          g.startDistance / Math.max(distance, 1),
          indexAt({ ...frame, view: g.startView }, mid),
          columns,
        ),
      );
    } else if (xs.length === 1 && zoomed) {
      const dx = (xs[0] ?? 0) - g.startX;
      if (Math.abs(dx) > 4) g.moved = true;
      if (g.moved) setView(panView(g.startView, (-dx / (plotWidth || 1)) * span, columns));
    }
  };

  const onPointerEnd = (e: React.PointerEvent) => {
    gesture.current.pointers.delete(e.pointerId);
  };

  const onDot = (line: RankLine, point: RankPoint) => {
    if (gesture.current.moved) return;
    if (gesture.current.type === 'mouse') navigate({ name: 'season', id: point.season.id });
    else setProbe({ line, point, pinned: true });
  };

  const zoomBy = (factor: number) =>
    setView(zoomView(view, factor, (view.from + view.to) / 2, columns));

  const single = focus ?? probe?.line.player.id ?? hovered;
  const active: readonly number[] = single != null ? [single] : selected;
  const isOn = (id: number) => active.includes(id);
  const visibleSpan = view.to - view.from;
  const step = labelStep(plotWidth, Math.max(1, visibleSpan));
  const ranks = Array.from({ length: chart.maxRank }, (_, i) => i + 1);
  const ordered = [...chart.lines].sort(
    (a, b) => Number(isOn(a.player.id)) - Number(isOn(b.player.id)),
  );
  const inView = (index: number) => index >= view.from - 0.01 && index <= view.to + 0.01;

  return (
    <div ref={revealRef} data-shown={shown ? '' : undefined} className={styles.chart}>
      {canZoom && (
        <div className={styles.toolbar}>
          <span className={styles.hint}>{t.zoomHint}</span>
          <div className={styles.zoom} role="group" aria-label={t.zoomIn}>
            <button
              type="button"
              aria-label={t.zoomOut}
              title={t.zoomOut}
              disabled={!zoomed}
              onClick={() => zoomBy(1 / STEP)}
            >
              −
            </button>
            <button
              type="button"
              aria-label={t.zoomIn}
              title={t.zoomIn}
              disabled={visibleSpan <= 2.01}
              onClick={() => zoomBy(STEP)}
            >
              +
            </button>
            <button
              type="button"
              className={styles.reset}
              disabled={!zoomed}
              onClick={() => setView(fullView(columns))}
            >
              {t.zoomReset}
            </button>
          </div>
        </div>
      )}

      <div className={styles.wrap} ref={ref} dir="ltr" data-zoomed={zoomed ? '' : undefined}>
        {width > 0 && (
          <svg
            ref={svgRef}
            key={chart.competition}
            className={styles.svg}
            width={width}
            height={frame.height}
            role="img"
            aria-label={t.linesLabel(t.competition[chart.competition])}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onDoubleClick={(e) =>
              canZoom && setView(zoomView(view, 0.5, indexAt(frame, localX(e.clientX)), columns))
            }
            onPointerLeave={(e) => {
              onPointerEnd(e);
              setHovered(null);
              if (!probe?.pinned) setProbe(null);
            }}
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={frame.padStart - 8} y={0} width={plotWidth + 16} height={frame.height} />
              </clipPath>
            </defs>

            {ranks.map((r) => (
              <g key={r}>
                <line
                  className={r === 1 ? `${styles.grid} ${styles.gridTop}` : styles.grid}
                  x1={frame.padStart}
                  x2={width - frame.padEnd}
                  y1={yOf(frame, r)}
                  y2={yOf(frame, r)}
                />
                {(!compact || r === 1 || r === chart.maxRank) && (
                  <text
                    className={r === 1 ? `${styles.axis} ${styles.axisTop}` : styles.axis}
                    x={8}
                    y={yOf(frame, r) + 4}
                  >
                    {r}
                  </text>
                )}
              </g>
            ))}

            {chart.seasons.map((s, i) =>
              inView(i) && (i - Math.round(view.to)) % step === 0 ? (
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

            <g clipPath={`url(#${clipId})`}>
              {ordered.map((line, li) => {
                const { solid, bridges } = linePaths(frame, line.points);
                const isActive = isOn(line.player.id);
                return (
                  <g
                    key={line.player.id}
                    className={styles.series}
                    data-dim={active.length > 0 && !isActive ? '' : undefined}
                    data-active={isActive ? '' : undefined}
                    style={vars({ '--delay': `${li * 70}ms` })}
                    onPointerEnter={() => focus == null && setHovered(line.player.id)}
                  >
                    {/* Keyed by position, not shape: a resize or a zoom reshapes the paths in
                        place instead of mounting new ones, which would replay the draw-in. */}
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
            </g>
          </svg>
        )}

        {probe && inView(probe.point.index) && (
          <div
            className={styles.tip}
            dir="auto"
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
            aria-pressed={selected.length === 0}
            onClick={() => {
              setSelected([]);
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
              aria-pressed={selected.includes(line.player.id)}
              onClick={() => {
                setProbe(null);
                setSelected((ids) =>
                  ids.includes(line.player.id)
                    ? ids.filter((id) => id !== line.player.id)
                    : [...ids, line.player.id],
                );
                setHovered(null);
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
