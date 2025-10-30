"use client";

import { useState } from "react";
import { IncreaseSizePieChart } from "./increase-size-pie-chart";
import { PieChartLegendTable } from "./pie-chart-legend-table";

export function PieChartWithLegend() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => {
    setActiveIndex(index);
  };

  const handleClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };

  return (
    <div className="flex gap-6 items-start">
      <IncreaseSizePieChart 
        activeIndex={activeIndex}
        clickedIndex={clickedIndex}
        onHover={handleHover}
        onClick={handleClick}
      />
      <PieChartLegendTable 
        activeIndex={activeIndex}
        clickedIndex={clickedIndex}
        onHover={handleHover}
        onClick={handleClick}
      />
    </div>
  );
}
