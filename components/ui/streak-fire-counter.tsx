"use client";

import { useEffect, useState } from "react";
import { FireLoader } from "@/components/FireLoader";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Flame color configuration based on real-world flame temperatures
 * 
 * Temperature ranges and flame colors:
 * - Red (600-800°C): Starting/Low streak (1-20 days)
 * - Orange (800-1000°C): Growing streak (21-60 days)
 * - Yellow (1000-1200°C): Strong streak (61-150 days)
 * - White (1200-1400°C): Very strong streak (151-300 days)
 * - Blue (1400-1600°C): Maximum streak (300+ days)
 */

interface FlameConfig {
  minDays: number;
  maxDays: number;
  stage: 0 | 1 | 2 | 3 | 4;
  flameColor: string;
  glowColor: string;
  emberColor: string;
  label: string;
  temperature: string;
}

const flameConfigs: FlameConfig[] = [
  {
    minDays: 0,
    maxDays: 0,
    stage: 0,
    flameColor: "#8B0000",
    glowColor: "#4a0000",
    emberColor: "#ff4500",
    label: "No Streak",
    temperature: "~500°C"
  },
  {
    minDays: 1,
    maxDays: 20,
    stage: 1,
    flameColor: "#DC143C", // Deep red
    glowColor: "#8B0000",
    emberColor: "#ff4500",
    label: "Starting Flame",
    temperature: "~700°C"
  },
  {
    minDays: 21,
    maxDays: 60,
    stage: 2,
    flameColor: "#FF6347", // Orange-red
    glowColor: "#DC143C",
    emberColor: "#ff7700",
    label: "Growing Fire",
    temperature: "~900°C"
  },
  {
    minDays: 61,
    maxDays: 150,
    stage: 3,
    flameColor: "#FFA500", // Yellow-orange
    glowColor: "#FF6347",
    emberColor: "#ffaa00",
    label: "Strong Blaze",
    temperature: "~1100°C"
  },
  {
    minDays: 151,
    maxDays: 300,
    stage: 4,
    flameColor: "#FFD700", // Yellow-white
    glowColor: "#FFA500",
    emberColor: "#ffcc00",
    label: "Intense Inferno",
    temperature: "~1300°C"
  },
  {
    minDays: 301,
    maxDays: Infinity,
    stage: 4,
    flameColor: "#87CEEB", // Blue flame
    glowColor: "#4169E1",
    emberColor: "#00BFFF",
    label: "Supreme Fire",
    temperature: "~1500°C"
  }
];

function getFlameConfig(days: number): FlameConfig {
  return flameConfigs.find(config => days >= config.minDays && days <= config.maxDays) || flameConfigs[0];
}

interface StreakFireCounterProps {
  streakDays?: number;
}

export function StreakFireCounter({ streakDays = 0 }: StreakFireCounterProps) {
  const [displayDays, setDisplayDays] = useState(0);
  const config = getFlameConfig(streakDays);

  // Animate the counter
  useEffect(() => {
    if (displayDays === streakDays) return;

    const duration = 1000; // 1 second
    const steps = 30;
    const increment = (streakDays - displayDays) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayDays(streakDays);
        clearInterval(timer);
      } else {
        setDisplayDays(prev => Math.round(prev + increment));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [streakDays, displayDays]);

  return (
    <Card className="w-full max-w-4xl mx-auto mb-4 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Activity Streak
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Keep the fire burning! 🔥
            </p>
          </div>

          {/* Fire Element and Stats - Responsive Layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full">
            {/* Fire Animation */}
            <div className="shrink-0">
              <FireLoader
                size={100}
                stage={config.stage}
                flameColor={config.flameColor}
                glowColor={config.glowColor}
                emberColor={config.emberColor}
              />
            </div>

            {/* Stats Section */}
            <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
              {/* Day Counter */}
              <div>
                <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  {displayDays}
                </div>
                <div className="text-sm md:text-base text-muted-foreground mt-1">
                  {displayDays === 1 ? "Day" : "Days"} Streak
                </div>
              </div>

              {/* Flame Level Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <div
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{
                      backgroundColor: config.flameColor,
                      boxShadow: `0 0 10px ${config.glowColor}`
                    }}
                  />
                  <span className="text-sm font-semibold">
                    {config.label}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Flame Temperature: {config.temperature}
                </div>
              </div>

              {/* Progress to Next Level */}
              {config.maxDays !== Infinity && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Next level</span>
                    <span>{config.maxDays + 1} days</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-orange-500 to-red-500 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((streakDays - config.minDays) / (config.maxDays - config.minDays + 1)) * 100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Achievement Badge for Max Level */}
              {config.maxDays === Infinity && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    🏆 Maximum Level Achieved!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Milestone Indicators */}
          <div className="w-full max-w-2xl mt-2">
            <div className="flex justify-between items-center gap-1 text-xs">
              {[0, 20, 60, 150, 300].map((milestone, idx) => {
                const isActive = streakDays >= milestone;
                const milestoneConfig = getFlameConfig(milestone);
                return (
                  <div
                    key={milestone}
                    className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                      isActive ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: isActive ? milestoneConfig.flameColor : "#888",
                        boxShadow: isActive ? `0 0 8px ${milestoneConfig.glowColor}` : "none"
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">
                      {milestone === 0 ? "Start" : `${milestone}d`}
                    </span>
                  </div>
                );
              })}
              <div
                className={`flex flex-col items-center gap-1 flex-1 transition-all ${
                  streakDays > 300 ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: streakDays > 300 ? "#87CEEB" : "#888",
                    boxShadow: streakDays > 300 ? "0 0 8px #4169E1" : "none"
                  }}
                />
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  300+
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
