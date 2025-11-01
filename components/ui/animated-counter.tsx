"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

export function AnimatedCounter({ value, className, style, duration = 2 }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, value, { duration });
    return () => controls.stop();
  }, [value, duration, count]);

  return (
    <motion.span className={className} style={style}>
      {rounded}
    </motion.span>
  );
}
