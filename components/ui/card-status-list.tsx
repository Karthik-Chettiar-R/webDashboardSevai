"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, RefreshCw, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardStatus = "completed" | "updates-found" | "syncing" | "pending";

export type Card = {
  id: string;
  title: string;
  status: CardStatus;
  value?: number;
  color?: string;
  isActive?: boolean;
};

interface AnimatedCardStatusListProps {
  title: string;
  cards: Card[];
  onSynchronize?: (cardId: string) => void;
  onAddCard?: () => void;
  onBack?: () => void;
  className?: string;
  onHover?: (cardId: string | null) => void;
}

const statusConfig: Record<CardStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
  completed: {
    icon: <Check className="w-4 h-4" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  "updates-found": {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  syncing: {
    icon: <Check className="w-4 h-4" />,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  pending: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
};

export function AnimatedCardStatusList({
  title,
  cards,
  onSynchronize,
  onAddCard,
  onBack,
  className,
  onHover,
}: AnimatedCardStatusListProps) {
  return (
    <Card className={cn("w-full flex flex-col", className)}>
      <CardHeader className="border-b shrink-0">
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <CardTitle className="flex-1">{title}</CardTitle>
          {onAddCard && (
            <Button variant="outline" size="sm" onClick={onAddCard}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="divide-y h-full flex flex-col justify-center">
          {cards.map((card, index) => {
            const config = statusConfig[card.status];
            const isActive = card.isActive;
            const isAnyActive = cards.some(c => c.isActive);
            
            return (
              <div
                key={card.id}
                className={cn(
                  "group p-4 transition-all duration-300 cursor-pointer hover:bg-accent/50",
                  isActive && "bg-accent ring-2 ring-primary"
                )}
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                  opacity: isAnyActive && !isActive ? 0.3 : 1,
                }}
                onClick={() => onSynchronize?.(card.id)}
                onMouseEnter={() => onHover?.(card.id)}
                onMouseLeave={() => onHover?.(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {card.color && (
                      <div
                        className="w-3 h-3 rounded-full shrink-0 transition-all duration-300"
                        style={{ backgroundColor: card.color }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium transition-all duration-300">
                        {card.title}
                      </p>
                      {card.value !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {card.value.toLocaleString()} visitors
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
