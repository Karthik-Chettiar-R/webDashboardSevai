"use client";

import React from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { HeatmapRect } from '@visx/heatmap';

type BinDatum = {
  week: string;
  count: number;
  month: number;
  weekNumber: number;
};

type MonthDatum = {
  month: string;
  bins: BinDatum[];
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

// Color scheme
const COLORS = {
  cool1: '#122549',
  cool2: '#b4fbde',
  background: '#28272c'
} as const;

// Days per month (non-leap year)
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Generate daily data per month (demo random values). Shape: [{ month, days: [{day, count}] }]
function generateDailyMonthlyData(): { month: string; index: number; days: { day: number; count: number }[] }[] {
  return MONTHS.map((month, monthIndex) => {
    const daysCount = DAYS_IN_MONTH[monthIndex] ?? 0;
    return {
      month,
      index: monthIndex,
      days: Array.from({ length: daysCount }, (_, i) => ({
        day: (i ?? 0) + 1,
        count: Math.floor(100),
      })),
    };
  });
}

const monthlyData = generateDailyMonthlyData();

// Find max value for color scaling across all days
const colorMax = Math.max(
  ...monthlyData.flatMap((m) => m.days.map((d) => d.count))
);

export type MonthlyHeatmapProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  visibleMonths?: number;
};

const defaultMargin = { top: 20, left: 30, right: 20, bottom: 30 };

export function MonthlyHeatmap({
  width,
  height,
  events = false,
  margin = defaultMargin,
  visibleMonths = 5,
}: MonthlyHeatmapProps) {
  // Bounds
  const visibleWidth = width; // viewport width showing visibleMonths columns
  const perMonthSlot = visibleWidth / visibleMonths; // slot per month including spacing
  const monthSpacing = 12; // pixels between month slots
  const usableMonthWidth = Math.max(16, perMonthSlot - monthSpacing);
  const svgInnerWidth = perMonthSlot * MONTHS.length; // inner width for all months
  const svgWidth = svgInnerWidth + margin.left + margin.right;
  const xMax = svgInnerWidth - margin.left - margin.right;
  // compute heights based on incoming height but remove top margin blank space
  const labelOffset = 16; // space under grid for month labels
  const availableHeight = Math.max(32, height - margin.bottom - labelOffset); // no top margin
  const yMax = availableHeight;

  // Scales
  const xScale = scaleLinear<number>({
    domain: [0, MONTHS.length],
    range: [0, xMax],
  });

  const colorScale = scaleLinear<string>({
    range: [COLORS.cool1, COLORS.cool2],
    domain: [0, colorMax],
  });

  const binWidth = usableMonthWidth; // width available for days inside each month slot
  // We'll render per-day squares grouped into columns of 7 days (weeks)
  const gap = 2;
  const maxRows = 7; // 7 days per column
  const maxCols = 5; // maximum possible columns (31 days -> 5 cols)
  // Compute a reasonable square size that fits vertically (7 rows) and horizontally (maxCols per month)
  const cellSizeByHeight = Math.floor(yMax / maxRows);
  const cellSizeByWidth = Math.floor((binWidth - gap * (maxCols - 1)) / maxCols);
  const cellSize = Math.max(4, Math.min(cellSizeByHeight, cellSizeByWidth));
  const gridHeight = maxRows * (cellSize + gap) - gap;
  const svgContentHeight = gridHeight + labelOffset;
  const svgHeight = svgContentHeight + margin.bottom; // final svg height (no extra top padding)

  return (
    <div style={{ width: visibleWidth, overflowX: 'auto', overflowY: 'hidden', height: svgHeight }}>
      <svg width={svgWidth} height={svgHeight}>
        <Group left={margin.left} top={0}>
        {/* Month labels (X-axis) */}
        {MONTHS.map((month, i) => {
          const slotX = i * perMonthSlot;
          const labelX = slotX + perMonthSlot / 2;
          return (
            <text
              key={`month-${i}`}
              x={margin.left + labelX}
              y={gridHeight + 12}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
            >
              {month}
            </text>
          )
        })}
        {/* Heatmap cells — group days into columns of 7 (weeks) per month */}
        {monthlyData.map((m) => (
          <g key={`col-${m.index}`}>
            {m.days.map((d, dayIdx) => {
              const col = Math.floor(dayIdx / maxRows); // which 7-day column
              const row = dayIdx % maxRows; // row within column (0..6)
              const numCols = Math.ceil(m.days.length / maxRows);
              const totalColsWidth = numCols * cellSize + Math.max(0, numCols - 1) * gap;
              const offsetX = (binWidth - totalColsWidth) / 2;
              const slotX = m.index * perMonthSlot;
              const x = margin.left + slotX + offsetX + col * (cellSize + gap);
              // position from top: row 0 -> top
              const y = row * (cellSize + gap);

              return (
                <rect
                  key={`m${m.index}-d${d.day}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={colorScale(d.count)}
                  rx={2}
                  className="cursor-pointer transition-colors duration-150"
                >
                  <title>{`${m.month} ${d.day}: ${d.count}`}</title>
                </rect>
              )
            })}
          </g>
        ))}
      </Group>
      </svg>
    </div>
  );
}