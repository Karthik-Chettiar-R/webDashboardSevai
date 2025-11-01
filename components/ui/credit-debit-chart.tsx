"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AnimatedCounter } from "./animated-counter";

type TransactionData = {
  date: string;
  count: number;
  credit: number;
  debit: number;
};

type DashboardData = {
  currentStreak: number;
  initialBalance: number;
  maxBalanceEverReached: number;
  transactionActivity: TransactionData[];
};

// Helper function to get day of week
function getDayOfWeek(dateStr: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// Helper function to get week number in month
function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  return Math.ceil((dayOfMonth + firstDay.getDay()) / 7);
}

// Helper function to get month name
function getMonthName(dateStr: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(dateStr);
  return months[date.getMonth()];
}

// Process real data based on period
function processTransactionData(
  transactions: TransactionData[], 
  period: 'week' | 'month' | 'max',
  initialBalance: number
) {
  if (!transactions || transactions.length === 0) return [];

  // Sort transactions by date
  const sorted = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const now = new Date();
  let filtered: TransactionData[] = [];

  if (period === 'week') {
    // Last 7 days
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 6);
    filtered = sorted.filter(t => new Date(t.date) >= weekAgo);
  } else if (period === 'month') {
    // Last 30 days
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 29);
    filtered = sorted.filter(t => new Date(t.date) >= monthAgo);
  } else {
    // All time
    filtered = sorted;
  }

  if (filtered.length === 0) return [];

  let runningBalance = initialBalance;
  
  if (period === 'week') {
    // Group by day
    const dailyData: { [key: string]: { credit: number; debit: number; date: string } } = {};
    
    filtered.forEach(t => {
      const day = getDayOfWeek(t.date);
      if (!dailyData[day]) {
        dailyData[day] = { credit: 0, debit: 0, date: t.date };
      }
      dailyData[day].credit += t.credit;
      dailyData[day].debit += t.debit;
    });

    // Ensure we have all 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const data = dailyData[day] || { credit: 0, debit: 0, date: '' };
      runningBalance = runningBalance + data.credit - data.debit;
      return {
        label: day,
        balance: runningBalance,
        credit: data.credit,
        debit: data.debit
      };
    });
  } else if (period === 'month') {
    // Group by week
    const weeklyData: { [key: number]: { credit: number; debit: number } } = {};
    
    filtered.forEach(t => {
      const week = getWeekOfMonth(t.date);
      if (!weeklyData[week]) {
        weeklyData[week] = { credit: 0, debit: 0 };
      }
      weeklyData[week].credit += t.credit;
      weeklyData[week].debit += t.debit;
    });

    return Object.entries(weeklyData).map(([week, data]) => {
      runningBalance = runningBalance + data.credit - data.debit;
      return {
        label: `Week ${week}`,
        balance: runningBalance,
        credit: data.credit,
        debit: data.debit
      };
    });
  } else {
    // Group by month
    const monthlyData: { [key: string]: { credit: number; debit: number; date: string } } = {};
    
    filtered.forEach(t => {
      const month = getMonthName(t.date);
      if (!monthlyData[month]) {
        monthlyData[month] = { credit: 0, debit: 0, date: t.date };
      }
      monthlyData[month].credit += t.credit;
      monthlyData[month].debit += t.debit;
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[1].date).getTime() - new Date(b[1].date).getTime())
      .map(([month, data]) => {
        runningBalance = runningBalance + data.credit - data.debit;
        return {
          label: month,
          balance: runningBalance,
          credit: data.credit,
          debit: data.debit
        };
      });
  }
}

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
  credit: {
    label: "Credit",
    color: "hsl(var(--chart-2))",
  },
  debit: {
    label: "Debit",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface CreditDebitChartProps {
  period: 'week' | 'month' | 'max';
  onPeriodChange?: (direction: 'prev' | 'next') => void;
}

export function CreditDebitChart({ period, onPeriodChange }: CreditDebitChartProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    // Fetch dashboard data
    fetch('/dashboard-data.json')
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error('Error loading dashboard data:', err));
  }, []);

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

    if (isLeftSwipe && onPeriodChange) {
      onPeriodChange('next');
    } else if (isRightSwipe && onPeriodChange) {
      onPeriodChange('prev');
    }
  };

  const chartData = useMemo(() => {
    if (!dashboardData) return [];
    return processTransactionData(
      dashboardData.transactionActivity,
      period,
      dashboardData.initialBalance
    );
  }, [dashboardData, period]);
  
  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, item) => ({
        credit: acc.credit + item.credit,
        debit: acc.debit + item.debit,
      }),
      { credit: 0, debit: 0 }
    );
  }, [chartData]);

  const maxAmount = useMemo(() => {
    if (chartData.length === 0) return 10000;
    return Math.max(...chartData.map(d => d.balance));
  }, [chartData]);
  
  const minAmount = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map(d => d.balance));
  }, [chartData]);

  const currentBalance = useMemo(() => {
    if (chartData.length === 0) return dashboardData?.initialBalance || 0;
    return chartData[chartData.length - 1].balance;
  }, [chartData, dashboardData]);

  const periodLabel = {
    week: 'This Week',
    month: 'This Month',
    max: 'All Time'
  }[period];

  return (
    <div 
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="grid grid-cols-[1fr_auto] gap-2 sm:gap-3 md:gap-4 w-full touch-pan-y"
    >
      {/* Line Chart */}
      <Card className="overflow-hidden h-[148px] sm:h-[163px] md:h-[188px] lg:h-[212px]">
        <CardContent className="px-2 py-0 h-full flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 2,
                right: 2,
                top: 2,
                bottom: 2,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tick={{ fontSize: 9 }}
                height={20}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tick={{ fontSize: 9 }}
                width={35}
                domain={[minAmount * 0.9, maxAmount * 1.1]}
                tickFormatter={(value) => `$${value > 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  formatter={(value, name) => {
                    if (name === 'balance') return `$${value.toLocaleString()}`;
                    return `$${value.toLocaleString()}`;
                  }}
                />}
              />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--chart-1)"
                dot={{
                  fill: "var(--chart-1)",
                  r: 3,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
                strokeWidth={2}
                filter="url(#balance-glow)"
              />
              <defs>
                <filter
                  id="balance-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Total Cards - Stacked on Right */}
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-[100px] sm:w-[110px] md:w-[130px] lg:w-[150px]">
        {/* Total Income Card */}
        <motion.div
          className="h-[73px] sm:h-[80px] md:h-[92px] lg:h-[104px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border-chart-2/30 bg-chart-2/5">
            <CardContent className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 flex flex-col justify-center h-full">
              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                Income
              </div>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight" style={{ color: 'var(--chart-2)' }}>
                $<AnimatedCounter value={totals.credit} duration={1.5} />
              </div>
              <div className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground mt-0.5">
                {periodLabel}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expenditure Card */}
        <motion.div
          className="h-[73px] sm:h-[80px] md:h-[92px] lg:h-[104px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border-chart-5/30 bg-chart-5/5">
            <CardContent className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 flex flex-col justify-center h-full">
              <div className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                Expenditure
              </div>
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight" style={{ color: 'var(--chart-5)' }}>
                $<AnimatedCounter value={totals.debit} duration={1.5} />
              </div>
              <div className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground mt-0.5">
                {periodLabel}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
