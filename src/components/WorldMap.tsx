"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Country } from "@/constants/world-countries";

interface WorldMapProps {
  countries: readonly Country[];
  viewWidth: number;
  viewHeight: number;
  visited: Set<string>;
  onToggle: (iso: string) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 12;
const ZOOM_STEP = 1.5;
const DRAG_THRESHOLD = 4;

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Hover {
  iso: string;
  name: string;
  /** position relative to the wrap element, in CSS pixels */
  x: number;
  y: number;
}

function WorldMapImpl({
  countries,
  viewWidth,
  viewHeight,
  visited,
  onToggle,
}: WorldMapProps) {
  const initialView = useMemo<View>(
    () => ({ x: 0, y: 0, w: viewWidth, h: viewHeight }),
    [viewWidth, viewHeight],
  );
  const [view, setView] = useState<View>(initialView);
  const [hover, setHover] = useState<Hover | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Reset view when the projection (viewport dimensions) changes.
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const clampView = useCallback(
    (v: View): View => {
      const w = Math.min(viewWidth, Math.max(viewWidth / MAX_SCALE, v.w));
      const h = Math.min(viewHeight, Math.max(viewHeight / MAX_SCALE, v.h));
      // X wraps horizontally so the user can pan freely around the globe.
      // We normalize into [0, viewWidth) and render three tile copies (−W, 0,
      // +W) inside the SVG so the seam is always covered.
      const x = ((v.x % viewWidth) + viewWidth) % viewWidth;
      const y = Math.min(viewHeight - h, Math.max(0, v.y));
      return { x, y, w, h };
    },
    [viewWidth, viewHeight],
  );
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panState = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startView: View;
    moved: boolean;
    captured: boolean;
  } | null>(null);
  // Set when a pan has just ended so the synthetic click that follows the
  // drag is suppressed (otherwise a drag starting inside a country would
  // toggle it on release).
  const suppressNextClick = useRef(false);

  const scale = viewWidth / view.w;

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      setView((prev) => {
        const svg = svgRef.current;
        if (!svg) return prev;
        const rect = svg.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        const cursorWorldX = prev.x + px * prev.w;
        const cursorWorldY = prev.y + py * prev.h;
        const newW = prev.w / factor;
        const newH = prev.h / factor;
        return clampView({
          w: newW,
          h: newH,
          x: cursorWorldX - px * newW,
          y: cursorWorldY - py * newH,
        });
      });
    },
    [clampView],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    },
    [zoomAt],
  );

  const handleReset = useCallback(() => setView(initialView), [initialView]);

  // Wheel handler must be non-passive to call preventDefault and stop the page
  // from scrolling while the user zooms the map. React's synthetic onWheel is
  // registered passively in React 17+, so we attach the listener directly.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      zoomAt(e.clientX, e.clientY, factor);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      // Only primary mouse / touch — ignore right-click & middle-click
      if (e.button !== 0 && e.pointerType === "mouse") return;
      panState.current = {
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startView: view,
        moved: false,
        captured: false,
      };
      // Do NOT setPointerCapture yet — capturing on the SVG redirects the
      // browser-synthesized click away from the country <path>. We capture
      // only once a real drag is detected in pointermove.
    },
    [view],
  );

  const updateHover = useCallback(
    (path: SVGPathElement, clientX: number, clientY: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const iso = path.getAttribute("data-iso");
      const name = path.getAttribute("data-name");
      if (!iso || !name) return;
      const rect = wrap.getBoundingClientRect();
      setHover({ iso, name, x: clientX - rect.left, y: clientY - rect.top });
    },
    [],
  );

  const handlePathMouseEnter = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      updateHover(e.currentTarget, e.clientX, e.clientY);
    },
    [updateHover],
  );

  const handlePathMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>) => {
      // Skip while panning — the country under the cursor will catch up on next idle move.
      if (panState.current?.moved) return;
      updateHover(e.currentTarget, e.clientX, e.clientY);
    },
    [updateHover],
  );

  const handlePathMouseLeave = useCallback(() => {
    setHover(null);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const s = panState.current;
    if (!s || s.pointerId !== e.pointerId) return;
    const dxCss = e.clientX - s.startClientX;
    const dyCss = e.clientY - s.startClientY;
    if (!s.moved) {
      if (Math.hypot(dxCss, dyCss) < DRAG_THRESHOLD) return;
      s.moved = true;
      try {
        (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
        s.captured = true;
      } catch {
        // capture can throw if the pointer is already released
      }
    }
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dxWorld = (dxCss / rect.width) * s.startView.w;
    const dyWorld = (dyCss / rect.height) * s.startView.h;
    setView(
      clampView({
        ...s.startView,
        x: s.startView.x - dxWorld,
        y: s.startView.y - dyWorld,
      }),
    );
  }, [clampView]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const s = panState.current;
    if (!s || s.pointerId !== e.pointerId) return;
    if (s.moved) suppressNextClick.current = true;
    if (s.captured) {
      try {
        (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
      } catch {
        // releasing a never-captured pointer is fine
      }
    }
    panState.current = null;
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (suppressNextClick.current) {
      suppressNextClick.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  const handleCountryClick = useCallback(
    (iso: string) => () => onToggle(iso),
    [onToggle],
  );

  return (
    <div className="cv-map-wrap" ref={wrapRef}>
      <svg
        ref={svgRef}
        className="cv-map"
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive world map. Drag to pan, scroll to zoom, click a country to mark it visited."
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        {[-1, 0, 1].map((tile) => (
          <g key={tile} transform={tile === 0 ? undefined : `translate(${tile * viewWidth} 0)`}>
            {countries.map((c) =>
              c.d ? (
                <path
                  // Keys are unique across tile copies so React reconciles each
                  // copy independently.
                  key={`${tile}:${c.iso}`}
                  d={c.d}
                  data-iso={c.iso}
                  data-name={c.name}
                  data-visited={visited.has(c.iso) ? "true" : "false"}
                  className="cv-country"
                  onClick={handleCountryClick(c.iso)}
                  onMouseEnter={handlePathMouseEnter}
                  onMouseMove={handlePathMouseMove}
                  onMouseLeave={handlePathMouseLeave}
                  // Only the central copy is focusable to avoid 3× tab stops.
                  tabIndex={tile === 0 ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggle(c.iso);
                    }
                  }}
                >
                  <title>{c.name}</title>
                </path>
              ) : null,
            )}
          </g>
        ))}
      </svg>

      {hover && (
        <div
          className="cv-map-tooltip"
          style={{ left: hover.x, top: hover.y }}
          aria-hidden="true"
        >
          {hover.name}
        </div>
      )}

      <div className="cv-map-controls" role="group" aria-label="Map zoom controls">
        <button
          type="button"
          className="cv-map-btn"
          onClick={() => zoomCenter(ZOOM_STEP)}
          aria-label="Zoom in"
          disabled={scale >= MAX_SCALE - 0.001}
        >
          +
        </button>
        <button
          type="button"
          className="cv-map-btn"
          onClick={() => zoomCenter(1 / ZOOM_STEP)}
          aria-label="Zoom out"
          disabled={scale <= MIN_SCALE + 0.001}
        >
          −
        </button>
        <button
          type="button"
          className="cv-map-btn"
          onClick={handleReset}
          aria-label="Reset view"
          disabled={scale <= MIN_SCALE + 0.001 && view.x === 0 && view.y === 0}
          title="Reset view"
        >
          ⤢
        </button>
      </div>
    </div>
  );
}

export default memo(WorldMapImpl);
