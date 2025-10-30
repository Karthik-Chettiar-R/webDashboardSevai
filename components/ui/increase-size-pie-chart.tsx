"use client";

import { useState } from "react";
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
import { Badge } from "./badge";
import { TrendingDown } from "lucide-react";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)", color: "hsl(var(--chart-1))" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)", color: "hsl(var(--chart-2))" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)", color: "hsl(var(--chart-3))" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)", color: "hsl(var(--chart-4))" },
  { browser: "other", visitors: 90, fill: "var(--color-other)", color: "hsl(var(--chart-5))" },
];

// Sort the data by visitors in ascending order (smallest to largest) it will make graph look better
const sortedChartData = [...chartData].sort((a, b) => a.visitors - b.visitors);

// Configure the size increase between each pie ring
const BASE_RADIUS = 150; // Starting radius for the smallest pie
const SIZE_INCREMENT =0 ; // How much to increase radius for each subsequent pie

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
}

export function IncreaseSizePieChart({ 
  activeIndex: externalActiveIndex, 
  clickedIndex: externalClickedIndex,
  onHover: externalOnHover,
  onClick: externalOnClick
}: IncreaseSizePieChartProps = {}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number | null>(null);
  const [internalClickedIndex, setInternalClickedIndex] = useState<number | null>(null);

  // Use external state if provided, otherwise use internal state
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const clickedIndex = externalClickedIndex !== undefined ? externalClickedIndex : internalClickedIndex;

  const handleMouseEnter = (index: number) => {
    if (externalOnHover) {
      externalOnHover(index);
    } else {
      setInternalActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (externalOnHover) {
      externalOnHover(null);
    } else {
      setInternalActiveIndex(null);
    }
  };

  const handleClick = (index: number) => {
    if (externalOnClick) {
      externalOnClick(index);
    } else {
      setInternalClickedIndex(internalClickedIndex === index ? null : index);
    }
  };

  return (
    <div className="w-[400px] h-[400px] flex items-center justify-center">
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
        <CardTitle>
          
          <Badge
            variant="outline"
            className="text-red-500 bg-red-500/10 border-none ml-2"
          >
           
            
          </Badge>
        </CardTitle>
        
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
         style={{ width: '400px', height: '400px', margin: 0 }}
          className="[&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            {sortedChartData.map((entry, index) => {
              const isActive = activeIndex === index || clickedIndex === index;
              const radiusBoost = isActive ? 15 : 0;
              
              return (
              <Pie
                key={`pie-${index}`}
                data={[entry]}
                innerRadius={0}
                outerRadius={BASE_RADIUS + index * SIZE_INCREMENT + radiusBoost}
                dataKey="visitors"
                cornerRadius={0}
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
                  fill={entry.fill} 
                  opacity={isActive ? 1 : 0.8}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
                <LabelList
                  dataKey="visitors"
                  stroke="none"
                  fontSize={12}
                  fontWeight={500}
                  fill="currentColor"
                  formatter={(value: number) => value.toString()}
                />
              </Pie>
            )})}

          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </div>
  );
}
