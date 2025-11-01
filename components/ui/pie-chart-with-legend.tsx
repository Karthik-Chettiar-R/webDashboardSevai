"use client";

import { useState, useEffect, useRef } from "react";
import { IncreaseSizePieChart, chartData, type DashboardData } from "./increase-size-pie-chart";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DataPeriod = "weekly" | "monthly" | "max";

type CardType = {
  id: string;
  title: string;
  value: number;
  color: string;
};

const periodOrder: DataPeriod[] = ["weekly", "monthly", "max"];
const periodLabels = {
  weekly: "Weekly",
  monthly: "Monthly",
  max: "All Time"
};

export function PieChartWithLegend() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataPeriod, setDataPeriod] = useState<DataPeriod>("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Load dashboard data from JSON file
  useEffect(() => {
    setIsLoading(true);
    fetch('/dashboard-data.json')
      .then(response => response.json())
      .then(data => {
        setDashboardData(data[dataPeriod]);
        setTimeout(() => setIsLoading(false), 300);
      })
      .catch(error => {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      });
  }, [dataPeriod]);

  // Auto-clear clicked state after 500ms (0.5 seconds)
  useEffect(() => {
    if (clickedIndex !== null) {
      const timer = setTimeout(() => {
        setClickedIndex(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [clickedIndex]);

  const handlePeriodChange = (direction: 'prev' | 'next') => {
    const currentIndex = periodOrder.indexOf(dataPeriod);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : periodOrder.length - 1;
    } else {
      newIndex = currentIndex < periodOrder.length - 1 ? currentIndex + 1 : 0;
    }
    
    setDataPeriod(periodOrder[newIndex]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handlePeriodChange('next');
    } else if (isRightSwipe) {
      handlePeriodChange('prev');
    }
  };

  const handleHover = (index: number | null) => {
    setActiveIndex(index);
  };

  const handleClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
    
    // Auto-clear after 500ms (0.5 seconds) - consistent for both mobile and desktop
    if (clickedIndex !== index) {
      setTimeout(() => {
        setClickedIndex(null);
      }, 500);
    }
  };

  const handleSynchronize = (cardId: string) => {
    const dataSource = dashboardData ? dashboardData.browsers : chartData;
    const index = dataSource.findIndex(d => (dashboardData ? d.id : d.browser) === cardId);
    if (index !== -1) {
      setClickedIndex(clickedIndex === index ? null : index);
      
      // Auto-clear after 500ms (0.5 seconds) - consistent for both mobile and desktop
      if (clickedIndex !== index) {
        setTimeout(() => {
          setClickedIndex(null);
        }, 500);
      }
    }
  };

  const handleCardHover = (cardId: string | null) => {
    if (cardId === null) {
      handleHover(null);
    } else {
      const dataSource = dashboardData ? dashboardData.browsers : chartData;
      const index = dataSource.findIndex(d => (dashboardData ? d.id : d.browser) === cardId);
      if (index !== -1) {
        handleHover(index);
      }
    }
  };

  // Use data from JSON if available, otherwise use default chartData
  const sortedData = dashboardData 
    ? [...dashboardData.browsers].sort((a, b) => b.visitors - a.visitors)
    : [...chartData].sort((a, b) => b.visitors - a.visitors);
  
  const categoryCards: CardType[] = sortedData.map((item) => {
    const dataSource = dashboardData ? dashboardData.browsers : chartData;
    const itemId = dashboardData ? (item as any).id : (item as any).browser;
    const chartIndex = dataSource.findIndex(d => (dashboardData ? (d as any).id : (d as any).browser) === itemId);
    return {
      id: itemId,
      title: dashboardData ? (item as any).name : (item as any).browser.charAt(0).toUpperCase() + (item as any).browser.slice(1),
      status: "completed" as const,
      value: item.visitors,
      color: dashboardData ? (item as any).color : (item as any).color,
      isActive: activeIndex === chartIndex || clickedIndex === chartIndex,
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Period Indicator with Swipe Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePeriodChange('prev')}
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Previous period"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="relative flex items-center gap-2">
          <div className="text-center min-w-[120px]">
            <p className="text-sm font-semibold transition-all duration-300">
              {periodLabels[dataPeriod]}
            </p>
          </div>
          
          {/* Period Dots Indicator */}
          <div className="flex gap-1.5">
            {periodOrder.map((period) => (
              <button
                key={period}
                onClick={() => setDataPeriod(period)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  period === dataPeriod 
                    ? 'bg-primary w-6' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Switch to ${periodLabels[period]}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => handlePeriodChange('next')}
          className="p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Next period"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Card with Swipe Support */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="touch-pan-y"
      >
        <Card className="w-full overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
            <div className={`flex flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-8 items-center transition-all duration-500 ease-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {/* Pie Chart Section - Main Attraction */}
            <div className="shrink-0 w-[52%] sm:w-[60%] md:w-[420px] lg:w-[480px]">
              <IncreaseSizePieChart 
                activeIndex={activeIndex}
                clickedIndex={clickedIndex}
                onHover={handleHover}
                onClick={handleClick}
                dashboardData={dashboardData}
                isLoading={isLoading}
              />
            </div>

            {/* Category List Section - Compact */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                  {dashboardData?.categoryTitle || "Browser Categories"}
                </h3>
                <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
                  {categoryCards.map((card, index) => {
                    const isActive = card.isActive;
                    const isAnyActive = categoryCards.some(c => c.isActive);
                    
                    return (
                      <div
                        key={card.id}
                        className={`group px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 border border-border rounded-md sm:rounded-lg transition-all duration-300 cursor-pointer hover:bg-accent/50 active:scale-95 ${
                          isLoading ? 'animate-pulse bg-muted' : ''
                        }`}
                        style={{
                          opacity: isLoading ? 0.5 : (isAnyActive && !isActive ? 0.3 : 1),
                          animationDelay: `${index * 100}ms`,
                        }}
                        onClick={(e) => {
                          if (!isLoading) {
                            handleSynchronize(card.id);
                            // Remove focus after click
                            if (e.currentTarget instanceof HTMLElement) {
                              e.currentTarget.blur();
                            }
                          }
                        }}
                        onTouchEnd={(e) => {
                          if (!isLoading) {
                            e.preventDefault();
                            handleSynchronize(card.id);
                            // Remove focus after touch
                            if (e.currentTarget instanceof HTMLElement) {
                              e.currentTarget.blur();
                            }
                          }
                        }}
                        onMouseEnter={() => !isLoading && handleCardHover(card.id)}
                        onMouseLeave={() => !isLoading && handleCardHover(null)}
                        tabIndex={-1}
                      >
                        {!isLoading && (
                          <>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: card.color }}
                              />
                              <span className="font-medium text-[10px] sm:text-xs md:text-sm lg:text-base flex-1 truncate">
                                {card.title}
                              </span>
                            </div>
                            {card.value !== undefined && (
                              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1 ml-3 sm:ml-4 md:ml-5">
                                {card.value.toLocaleString()} visitors
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
