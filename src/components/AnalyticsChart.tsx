"use client";

import { useState } from "react";

type DataPoint = {
  day: string;
  views: number;
};

export function AnalyticsChart({ data }: { data: DataPoint[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.views), 0);
  const chartMax = maxVal === 0 ? 5 : Math.ceil(maxVal * 1.15); // Add padding, default to 5 if zero

  // SVG Dimension mappings
  const svgWidth = 500;
  const svgHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates for the 7 points
  const points = data.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (data.length - 1);
    const y = svgHeight - paddingBottom - (d.views / chartMax) * chartHeight;
    return { x, y, val: d.views, label: d.day };
  });

  // Construct SVG Spline path using simple cubic bezier calculation for smooth curves
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + chartWidth / (data.length - 1) / 2;
      const cpY1 = p0.y;
      const cpX2 = p1.x - chartWidth / (data.length - 1) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Construct closed area path for the gradient fill under the line
  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${
        points[0].x
      } ${svgHeight - paddingBottom} Z`
    : "";

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-5 card-shadow dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Views Timeline</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">Listing interest over the past 7 days</p>
        </div>
        <div className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
          Total: {data.reduce((sum, d) => sum + d.views, 0).toLocaleString()} views
        </div>
      </div>

      <div className="relative mt-6 w-full aspect-[2.6/1]">
        {/* Responsive SVG wrapper */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-full w-full overflow-visible"
        >
          <defs>
            {/* Area gradient under line */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f76f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2f76f6" stopOpacity="0.00" />
            </linearGradient>
            {/* Spline stroke gradient */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2f76f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            {/* Filter glow effect for spline path */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const yVal = paddingTop + (idx * chartHeight) / 3;
            const labelVal = Math.round(chartMax - (idx * chartMax) / 3);
            return (
              <g key={idx}>
                {/* Horizontal grid line */}
                <line
                  x1={paddingLeft}
                  y1={yVal}
                  x2={svgWidth - paddingRight}
                  y2={yVal}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/80"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Axis label values */}
                <text
                  x={paddingLeft - 8}
                  y={yVal + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-slate-400 dark:fill-slate-600 font-semibold"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Glowing Area under curve */}
          {areaD && (
            <path d={areaD} fill="url(#areaGradient)" />
          )}

          {/* Curved glowing spline path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {/* Bottom Day Axis Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={svgHeight - 10}
              textAnchor="middle"
              fontSize="10"
              className="fill-slate-400 dark:fill-slate-500 font-bold"
            >
              {p.label}
            </text>
          ))}

          {/* Interactive hover circle nodes */}
          {points.map((p, i) => {
            const isHovered = activeIdx === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className="cursor-pointer"
              >
                {/* Invisible large hover catcher */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="14"
                  fill="transparent"
                />
                {/* Outer pulsing ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "8" : "5"}
                  fill="#2f76f6"
                  fillOpacity={isHovered ? "0.2" : "0"}
                  className="transition-all duration-200"
                />
                {/* Inner solid node dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "5.5" : "3.5"}
                  fill={isHovered ? "#10b981" : "#2f76f6"}
                  stroke="#fff"
                  strokeWidth={isHovered ? "2.5" : "1.8"}
                  className="transition-all duration-200 dark:stroke-slate-900"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic absolute tooltip box inside relative chart panel */}
        {activeIdx !== null && (
          <div
            style={{
              left: `${points[activeIdx].x}%`,
              transform: `translateX(-50%)`,
              top: `${points[activeIdx].y - 45}px`,
            }}
            className="pointer-events-none absolute z-10 rounded-lg bg-slate-950 px-2.5 py-1.5 text-center text-[10px] font-bold text-white shadow-md transition-all duration-150 animate-in fade-in zoom-in-95 dark:bg-white dark:text-slate-950"
          >
            <p className="leading-none">{points[activeIdx].label}</p>
            <p className="mt-1 leading-none text-brand-400 dark:text-brand-600">
              {points[activeIdx].val} {points[activeIdx].val === 1 ? "view" : "views"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
