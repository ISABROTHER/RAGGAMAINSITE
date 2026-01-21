// src/pages/home/StatsStrip.tsx
import React, { useEffect, useState } from "react";

type StatItem = {
  label: string;
  target: number;
  format?: (value: number) => string;
  extraLabel?: string;
};

const stats: StatItem[] = [
  {
    label: "Votes Secured (2024)",
    target: 23521,
    format: (v) => v.toLocaleString()
  },
  {
    label: "Streetlights",
    target: 1000,
    format: (v) => `${v.toLocaleString()}+`
  },
  {
    label: "Asphalt Roads",
    target: 10,
    format: (v) => `${v}km+`
  },
  {
    label: "Bulbs Donated",
    target: 2000,
    format: (v) => `${v}+`
  },
  {
    label: "Desks Provided",
    target: 2000,
    format: (v) => `${v}+`
  },
  {
    label: "Development Plan",
    target: 8,
    format: (v) => `${v}-Year`
  }
];

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      setValue(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return value;
}

export function StatsStrip() {
  return (
    <section
      className="text-white py-4 md:py-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #004528, #006B3F, #004528)" // NDC green hue band
      }}
    >
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-y-4 md:gap-y-8 gap-x-4 md:gap-12 text-center md:divide-x md:divide-white/10">
          {stats.map((item, idx) => {
            const value = useCountUp(item.target, 1200 + idx * 150);
            const display =
              item.format && value >= 0
                ? item.format(value)
                : value.toString();

            return (
              <div key={item.label} className="p-1">
                <div className="text-xl sm:text-2xl md:text-4xl font-extrabold text-amber-400 mb-1">
                  {display}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-amber-50 uppercase tracking-wider font-medium">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}