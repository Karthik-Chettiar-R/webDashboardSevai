"use client";

import { useState, useEffect } from "react";
import { LabelList, Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface DashboardData {
  chartTitle: string;
  chartPeriod: string;
  categoryTitle: string;
  streakDays?: number;
  browsers: Array<{
    id: string;
    name: string;
    visitors: number;
    color: string;
  }>;
}

export const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)", color: "hsl(var(--chart-1))" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)", color: "hsl(var(--chart-2))" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)", color: "hsl(var(--chart-3))" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)", color: "hsl(var(--chart-4))" },
];

// Sort the data by visitors in DESCENDING order (largest to smallest) for better visual hierarchy
const sortedChartData = [...chartData].sort((a, b) => b.visitors - a.visitors);

// Configure the size increase between each donut ring - largest gets biggest ring
// Mobile sizes (for screens < 640px)
const BASE_RADIUS_MOBILE = 70;
const SIZE_DECREMENT_MOBILE = 10;
const INNER_RADIUS_MOBILE = 25;

// Desktop sizes (for screens >= 640px)
const BASE_RADIUS_DESKTOP = 115;
const SIZE_DECREMENT_DESKTOP = 17;
const INNER_RADIUS_DESKTOP = 40;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface IncreaseSizePieChartProps {
  activeIndex?: number | null;
  clickedIndex?: number | null;
  onHover?: (index: number | null) => void;
  onClick?: (index: number) => void;
  dashboardData?: DashboardData | null;
  isLoading?: boolean;
}

export function IncreaseSizePieChart({ 
  activeIndex: externalActiveIndex, 
  clickedIndex: externalClickedIndex,
  onHover: externalOnHover,
  onClick: externalOnClick,
  dashboardData,
  isLoading = false
}: IncreaseSizePieChartProps = {}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resolvedColors, setResolvedColors] = useState<string[]>([]);

  // Resolve CSS variables to actual colors for SVG
  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const colors = [1, 2, 3, 4, 5].map(i => {
        const cssVar = getComputedStyle(root).getPropertyValue(`--chart-${i}`).trim();
        return cssVar || `oklch(0.5 0.2 ${i * 60})`;
      });
      setResolvedColors(colors);
    };
    
    updateColors();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => observer.disconnect();
  }, []);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use appropriate sizes based on screen size
  const BASE_RADIUS = isMobile ? BASE_RADIUS_MOBILE : BASE_RADIUS_DESKTOP;
  const SIZE_DECREMENT = isMobile ? SIZE_DECREMENT_MOBILE : SIZE_DECREMENT_DESKTOP;
  const INNER_RADIUS = isMobile ? INNER_RADIUS_MOBILE : INNER_RADIUS_DESKTOP;

  // Convert dashboard data to chart format
  const chartDataFromJson = dashboardData ? dashboardData.browsers.map((browser, index) => ({
    browser: browser.id,
    visitors: browser.visitors,
    fill: `var(--color-${browser.id})`,
    // Use resolved colors for SVG rendering
    color: resolvedColors[index] || `var(--chart-${index + 1})`
  })) : chartData;

  // Sort the data by visitors in DESCENDING order (largest to smallest) for better visual hierarchy
  const sortedChartData = [...chartDataFromJson].sort((a, b) => b.visitors - a.visitors);

  // Use external state if provided, otherwise use internal state
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const clickedIndex = externalClickedIndex !== undefined ? externalClickedIndex : null;

  const handleMouseEnter = (index: number) => {
    // Disable hover on mobile
    if (isMobile) return;
    
    if (externalOnHover) {
      externalOnHover(index);
    } else {
      setInternalActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Disable hover on mobile
    if (isMobile) return;
    
    if (externalOnHover) {
      externalOnHover(null);
    } else {
      setInternalActiveIndex(null);
    }
  };

  return (
    <div className={`flex flex-col gap-1 sm:gap-2 w-full transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="text-center">
        <h3 className={`font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base ${isLoading ? 'animate-pulse bg-muted rounded h-4 w-24 mx-auto' : ''}`}>
          {!isLoading && (dashboardData?.chartTitle || "Browser Usage")}
        </h3>
        <p className={`text-muted-foreground text-[9px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1 ${isLoading ? 'animate-pulse bg-muted rounded h-3 w-32 mx-auto mt-1' : ''}`}>
          {!isLoading && (dashboardData?.chartPeriod || "January - June 2024")}
        </p>
      </div>
      <div className={`w-full aspect-square max-w-full overflow-visible ${isLoading ? 'animate-pulse' : ''}`}>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background w-full h-full"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            {!isMobile && (
              <ChartTooltip
                content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                animationDuration={200}
                cursor={false}
              />
            )}
            {sortedChartData.map((entry, index) => {
              const isActive = activeIndex === index || clickedIndex === index;
              const isAnyActive = activeIndex !== null || clickedIndex !== null;
              
              return (
              <Pie
                key={`pie-${index}`}
                data={[entry]}
                innerRadius={INNER_RADIUS}
                outerRadius={BASE_RADIUS - index * SIZE_DECREMENT}
                dataKey="visitors"
                cornerRadius={6}
                paddingAngle={6}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
                isAnimationActive={true}
                activeIndex={-1}
                activeShape={undefined}
                startAngle={
                  // Calculate the percentage of total visitors up to current index
                  (sortedChartData
                    .slice(0, index)
                    .reduce((sum, d) => sum + d.visitors, 0) /
                    sortedChartData.reduce((sum, d) => sum + d.visitors, 0)) *
                  360
                }
                endAngle={
                  // Calculate the percentage of total visitors up to and including current index
                  (sortedChartData
                    .slice(0, index + 1)
                    .reduce((sum, d) => sum + d.visitors, 0) /
                    sortedChartData.reduce((sum, d) => sum + d.visitors, 0)) *
                  360
                }
              >
                <Cell 
                  fill={entry.color}
                  opacity={isAnyActive && !isActive ? 0.3 : 1}
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  style={{ 
                    transition: 'all 0.3s ease',
                  }}
                />
              </Pie>
            )})}

          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
