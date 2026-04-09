import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

// ─── Config ────────────────────────────────────────────────────────────────

interface SpinnerConfig {
  angleIncrement: number;
  lineDimensions: string; // Tailwind classes OR { width, height } strings
  delays: number[];
  duration: number;
}

const SMALL_CONFIG: SpinnerConfig = {
  angleIncrement: 45,
  lineDimensions: "h-[1.5px] w-[3px]",
  delays: [-875, -750, -625, -500, -375, -250, -125, 0],
  duration: 1000,
};

const MEDIUM_CONFIG: SpinnerConfig = {
  angleIncrement: 36,
  lineDimensions: "h-[1.5px] w-[4px]",
  delays: [-900, -800, -700, -600, -500, -400, -300, -200, -100, 0],
  duration: 1000,
};

const LARGE_CONFIG: SpinnerConfig = {
  angleIncrement: 30,
  lineDimensions: "h-[8%] w-[24%]",
  delays: [
    -1100, -1000, -900, -800, -700, -600, -500, -400, -300, -200, -100, 0,
  ],
  duration: 1200,
};

function getConfig(size: number): SpinnerConfig {
  if (size <= 12) return SMALL_CONFIG;
  if (size <= 16) return MEDIUM_CONFIG;
  return LARGE_CONFIG;
}

// ─── Inner lines ───────────────────────────────────────────────────────────

function SpinnerLines({ size = 20 }: { size?: number }) {
  const { delays, angleIncrement, lineDimensions, duration } = getConfig(size);

  return (
    <>
      {delays.map((delay, i) => (
        <div
          key={`spinner-line-${delay}`}
          className={cn(
            "animate-spinner-fade absolute top-[-3.9%] left-[-10%] bg-current",
            lineDimensions,
          )}
          style={
            {
              "--animation-delay": `${delay}ms`,
              "--animation-duration": `${duration}ms`,
              transform: `rotate(${i === 0 ? 0 : i * angleIncrement}deg) translate(146%)`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

// ─── Public API ────────────────────────────────────────────────────────────

export interface SpinnerProps {
  /** Diameter of the spinner in px. Defaults to 20. */
  size?: number | string;
  /** Overrides the spinner color. Defaults to `var(--ds-gray-700)`. */
  color?: string;
  /** Extra class names applied to the inner colored element. */
  className?: string;
  /** Extra class names applied to the outer wrapper div. */
  wrapperClassName?: string;
  /** Extra inline styles applied to the outer wrapper div. */
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Spinner({
  color,
  className,
  size = 20,
  wrapperClassName,
  style,
  ...rest
}: SpinnerProps) {
  // Resolve size to both a px string and a numeric value
  const numericValue =
    typeof size === "string" ? parseInt(size, 10) || 20 : size;
  const pixelValue = `${numericValue}px`;

  return (
    <div
      className={cn(wrapperClassName)}
      data-geist-spinner=""
      data-version="v1"
      style={{ height: pixelValue, width: pixelValue, ...style }}
      {...rest}
    >
      <div
        className={cn("relative top-1/2 left-1/2", className)}
        style={{
          height: pixelValue,
          width: pixelValue,
          color: color ?? "var(--ds-gray-700)",
        }}
      >
        <SpinnerLines size={numericValue} />
      </div>
    </div>
  );
}

// ─── Required CSS ──────────────────────────────────────────────────────────
//
// Add this to your global stylesheet (e.g. globals.css):
//
//   @keyframes spinner-fade {
//     0%   { opacity: 1;    }
//     100% { opacity: 0.15; }
//   }
//
//   [data-geist-spinner] .spinner-line {
//     animation: spinner-fade
//       var(--animation-duration, 1000ms)
//       linear
//       var(--animation-delay, 0ms)
//       infinite;
//   }
//
// And add the `spinner-line` class to each line div via your CSS module,
// or replace the Tailwind `lineDimensions` with your preferred sizing approach.
