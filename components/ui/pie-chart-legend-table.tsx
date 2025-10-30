"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { browser: "chrome", visitors: 275, color: "#3b82f6" }, // blue
  { browser: "safari", visitors: 200, color: "#10b981" }, // green
  { browser: "firefox", visitors: 187, color: "#f59e0b" }, // orange
  { browser: "edge", visitors: 173, color: "#8b5cf6" }, // purple
  { browser: "other", visitors: 90, color: "#ec4899" }, // pink
];

// Sort the data to match the pie chart order
const sortedChartData = [...chartData].sort((a, b) => a.visitors - b.visitors);

interface PieChartLegendTableProps {
  activeIndex: number | null;
  clickedIndex: number | null;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
}

export function PieChartLegendTable({ activeIndex, clickedIndex, onHover, onClick }: PieChartLegendTableProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Browser Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-sm">Category</th>
                <th className="text-right py-2 px-2 font-medium text-sm">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((entry) => {
                const sortedIndex = sortedChartData.findIndex(d => d.browser === entry.browser);
                const isActive = activeIndex === sortedIndex || clickedIndex === sortedIndex;
                
                return (
                <tr 
                  key={entry.browser}
                  className={`border-b last:border-0 cursor-pointer transition-all ${
                    isActive ? 'bg-muted/30 shadow-md' : 'hover:bg-muted/10'
                  }`}
                  onMouseEnter={() => onHover(sortedIndex)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onClick(sortedIndex)}
                  style={{backgroundColor:entry.color}}                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-6 h-6 rounded flex-shrink-0 transition-transform ${
                          isActive ? 'scale-110' : ''
                        }`}
                        style={{ 
                          backgroundColor: entry.color,
                        }}
                      />
                      <span className={`text-sm capitalize font-medium transition-all ${
                        isActive ? 'font-bold' : ''
                      }`}>
                        {entry.browser}
                      </span>
                    </div>
                  </td>
                  <td className={`py-3 px-3 text-right text-sm transition-all ${
                    isActive ? 'font-bold text-lg' : 'font-medium'
                  }`}>
                    {entry.visitors}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

