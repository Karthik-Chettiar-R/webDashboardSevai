"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TransactionDay {
  date: string;
  count: number;
}

interface TransactionHeatmapProps {
  data: TransactionDay[];
}

export function TransactionHeatmap({ data }: TransactionHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [weeksToShow, setWeeksToShow] = useState(12); // Default to ~3 months
  const [baseColor, setBaseColor] = useState('oklch(0.7 0.2 290)');
  const [selectedDay, setSelectedDay] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [cellSize, setCellSize] = useState({ width: 10, height: 10, gap: 2 });
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get the computed chart-1 color
  useEffect(() => {
    const updateColor = () => {
      const root = document.documentElement;
      const color = getComputedStyle(root).getPropertyValue('--chart-1').trim();
      if (color) {
        setBaseColor(color);
      }
    };
    
    updateColor();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => observer.disconnect();
  }, []);

  // Calculate how many weeks can fit in the available width and dynamic cell sizing
  useEffect(() => {
    const calculateWeeks = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || 200;
      
      // Dynamic cell sizing based on container
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      // Calculate optimal cell size
      let cellWidth, cellHeight, gap;
      
      if (isMobile) {
        // Mobile: smaller cells
        cellWidth = Math.max(10, Math.floor(containerWidth / 18)); // At least 10px
        cellHeight = Math.max(10, Math.floor(containerHeight / 10)); // At least 10px for 7 days
        gap = 2;
      } else if (isTablet) {
        // Tablet: medium cells
        cellWidth = Math.max(14, Math.floor(containerWidth / 16));
        cellHeight = Math.max(14, Math.floor(containerHeight / 9));
        gap = 3;
      } else {
        // Desktop: larger cells
        cellWidth = Math.max(16, Math.floor(containerWidth / 14));
        cellHeight = Math.max(16, Math.floor(containerHeight / 8));
        gap = 3;
      }
      
      setCellSize({ width: cellWidth, height: cellHeight, gap });
      
      // Account for day labels on the left (~30px) and some padding
      const availableWidth = containerWidth - 40;
      
      // Calculate how many weeks can fit
      const weeksCount = Math.floor(availableWidth / (cellWidth + gap));
      
      // Set reasonable limits: minimum 4 weeks, maximum 20 weeks
      const clampedWeeks = Math.max(4, Math.min(20, weeksCount));
      setWeeksToShow(clampedWeeks);
    };

    calculateWeeks();
    window.addEventListener('resize', calculateWeeks);
    return () => window.removeEventListener('resize', calculateWeeks);
  }, []);

  const heatmapData = useMemo(() => {
    const today = new Date();
    
    // End at the current week (end of Sunday of current week or today if it's before Sunday)
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const endDate = new Date(today);
    
    // If today is not Sunday, set endDate to today
    // If today is Sunday, include today
    endDate.setHours(23, 59, 59, 999);
    
    // Calculate start date based on weeks to show
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (weeksToShow * 7) + 1); // +1 to include the start day
    startDate.setHours(0, 0, 0, 0);

    // Create a map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    // Generate all days in range
    const days: { date: Date; count: number; dateStr: string }[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      days.push({
        date: new Date(currentDate),
        count,
        dateStr
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group by weeks (Sunday to Saturday)
    const weeks: typeof days[] = [];
    let currentWeek: typeof days = [];
    
    days.forEach((day, index) => {
      if (index === 0) {
        // Pad the first week with empty days if it doesn't start on Sunday
        const dayOfWeek = day.date.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: new Date(0), count: -1, dateStr: '' });
        }
      }
      
      currentWeek.push(day);
      
      // End week on Saturday or if it's the last day
      if (day.date.getDay() === 6 || index === days.length - 1) {
        // Don't pad the last week - just push what we have (ends at today)
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return { weeks, maxCount: Math.max(...data.map(d => d.count), 1) };
  }, [data, weeksToShow]);

  const getIntensity = (count: number) => {
    if (count === -1) return 'hsl(var(--muted) / 0.5)'; // Empty cell - darker for better visibility
    if (count === 0) return 'hsl(var(--muted) / 0.7)'; // No transactions - slightly darker
    
    const { maxCount } = heatmapData;
    const ratio = count / maxCount;
    
    // Use base color (chart-1) with varying opacity for intensity
    if (ratio <= 0.25) return `color-mix(in oklch, ${baseColor} 30%, transparent)`;
    if (ratio <= 0.5) return `color-mix(in oklch, ${baseColor} 55%, transparent)`;
    if (ratio <= 0.75) return `color-mix(in oklch, ${baseColor} 80%, transparent)`;
    return baseColor;
  };

  const handleDayClick = (day: { date: Date; count: number; dateStr: string }, event: React.MouseEvent) => {
    if (day.count === -1) return; // Don't show tooltip for padding cells
    
    event.stopPropagation(); // Prevent click from bubbling
    
    // Clear any existing timer
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    
    // Toggle tooltip on click (for mobile)
    if (selectedDay?.date === day.dateStr) {
      setSelectedDay(null);
    } else {
      setSelectedDay({ date: day.dateStr, count: day.count });
      
      // Auto-dismiss after 1 second
      dismissTimerRef.current = setTimeout(() => {
        setSelectedDay(null);
      }, 1000);
    }
  };

  const handleDayHover = (day: { date: Date; count: number; dateStr: string }, event: React.MouseEvent) => {
    if (day.count === -1) return; // Don't show tooltip for padding cells
    
    // Clear any existing timer on hover (desktop behavior - no auto-dismiss)
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setSelectedDay({ date: day.dateStr, count: day.count });
  };

  const handleClickOutside = () => {
    // Clear timer when clicking outside
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setSelectedDay(null);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is outside heatmap cells
        if (!target.closest('[data-heatmap-cell]')) {
          setSelectedDay(null);
        }
      };
      
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [selectedDay]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get month labels
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;
    
    heatmapData.weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(d => d.count !== -1);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== currentMonth) {
          labels.push({
            month: monthNames[month],
            weekIndex
          });
          currentMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div ref={containerRef} className="w-full h-full flex items-center" onClick={handleClickOutside}>
      <div className="w-full h-full overflow-x-auto overflow-y-hidden">
        <div className="inline-flex flex-col min-w-full h-full py-2 relative justify-center">
          {/* Month labels */}
          <div className="flex gap-0.5 mb-2 ml-5 md:ml-6">
            {monthLabels.map((label, idx) => (
              <div
                key={idx}
                className="text-[9px] md:text-[10px] lg:text-xs text-muted-foreground font-medium"
                style={{
                  marginLeft: idx === 0 ? 0 : `${(label.weekIndex - (monthLabels[idx - 1]?.weekIndex || 0)) * 13}px`
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

            <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col pr-1" style={{ gap: `${cellSize.gap}px` }}>
              {dayNames.map((day, idx) => (
                <div
                  key={idx}
                  className="text-[9px] md:text-[10px] text-muted-foreground flex items-center justify-center"
                  style={{ width: '16px', height: `${cellSize.height}px` }}
                >
                  {idx % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex" style={{ gap: `${cellSize.gap}px` }}>
              {heatmapData.weeks.map((week, weekIdx) => (
                <motion.div 
                  key={weekIdx} 
                  className="flex flex-col"
                  style={{ gap: `${cellSize.gap}px` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: weekIdx * 0.02 }}
                >
                  {week.map((day, dayIdx) => {
                    const intensity = getIntensity(day.count);
                    const isActive = selectedDay?.date === day.dateStr;
                    
                    return (
                      <motion.div
                        key={dayIdx}
                        data-heatmap-cell
                        className="rounded-sm border border-border/20 cursor-pointer relative"
                        style={{
                          backgroundColor: intensity,
                          width: `${cellSize.width}px`,
                          height: `${cellSize.height}px`,
                        }}
                        whileHover={{ scale: 1.4, boxShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                        whileTap={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={(e) => handleDayClick(day, e)}
                        onMouseEnter={(e) => handleDayHover(day, e)}
                        onMouseLeave={() => day.count === -1 ? null : setSelectedDay(null)}
                        animate={isActive ? { scale: 1.3, borderColor: 'hsl(var(--primary))' } : {}}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
            <span className="text-[9px] md:text-[10px]">Less</span>
            <div className="flex" style={{ gap: `${Math.max(2, cellSize.gap - 1)}px` }}>
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
                <div
                  key={idx}
                  className="rounded-sm border border-border/20"
                  style={{
                    width: `${cellSize.width}px`,
                    height: `${cellSize.height}px`,
                    backgroundColor: idx === 0 ? 'hsl(var(--muted))' : baseColor,
                    opacity: idx === 0 ? 1 : ratio
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] md:text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed z-9999 px-3 py-2 text-sm font-medium rounded-lg shadow-2xl pointer-events-none backdrop-blur-sm"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              background: 'hsl(var(--popover) / 0.98)',
              border: '2px solid hsl(var(--primary) / 0.3)',
              color: 'hsl(var(--popover-foreground))',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-center whitespace-nowrap">
              <div className="font-bold text-sm">{selectedDay.date}</div>
              <div className="text-primary font-semibold mt-1">
                {selectedDay.count} transaction{selectedDay.count !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
