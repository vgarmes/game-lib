"use client";

import { cn } from "@/lib/utils";
import React, { useId, useState } from "react";

const RATINGS = ["Bad", "Meh", "Good", "Very Good", "Masterpiece"];

interface StarProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}

const Star: React.FC<StarProps> = ({ title, isActive, onClick, onHover }) => {
  const isInteractive = !!onClick;
  return (
    <div
      className={cn("h-5 w-5 shrink-0 text-neutral-300 dark:text-neutral-500", {
        "text-yellow-400 dark:text-yellow-600": isActive,
        "cursor-pointer transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-110 active:scale-95 motion-reduce:transition-none":
          isInteractive,
      })}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <svg
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    </div>
  );
};

interface StarsProps {
  activeStar?: number | null;
  onClickStar?: (index: number) => void;
  hoverStar?: number | null;
  onHoverStar?: (index: number) => void;
  onMouseLeave?: () => void;
}

export const Stars: React.FC<StarsProps> = ({
  activeStar,
  onClickStar,
  hoverStar,
  onHoverStar,
  onMouseLeave,
}) => {
  return (
    <div className="flex items-center" onMouseLeave={onMouseLeave}>
      {RATINGS.map((text, index) => {
        let isActive = false;
        if (hoverStar || hoverStar === 0) {
          isActive = hoverStar >= index;
        } else if (activeStar || activeStar === 0) {
          isActive = activeStar >= index;
        }

        return (
          <Star
            key={index}
            isActive={isActive}
            title={text}
            onClick={onClickStar && (() => onClickStar(index))}
            onHover={onHoverStar && (() => onHoverStar(index))}
          />
        );
      })}
    </div>
  );
};

interface StarsInputProps {
  value?: number | null;
  onChange?: (n: number) => void;
  /** Id of the element that names the group (the field label). */
  "aria-labelledby"?: string;
}

/**
 * Rating picker built on native radios: Tab reaches the group, arrow keys
 * move between ratings, and each option announces its label ("3 – Good").
 */
export function StarsInput({
  value,
  onChange,
  "aria-labelledby": labelledBy,
}: StarsInputProps) {
  const name = useId();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const shownStar = hoveredStar ?? (value ? value - 1 : null);
  const ratingText = shownStar !== null ? RATINGS[shownStar] : "";

  return (
    <div className="flex items-center">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        className="flex items-center"
        onMouseLeave={() => setHoveredStar(null)}
      >
        {RATINGS.map((text, index) => (
          <label
            key={text}
            className="has-focus-visible:ring-ring/50 relative cursor-pointer rounded-sm p-0.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-110 active:scale-95 has-focus-visible:ring-[3px] motion-reduce:transition-none"
            onMouseEnter={() => setHoveredStar(index)}
          >
            <input
              type="radio"
              name={name}
              value={index + 1}
              checked={value === index + 1}
              onChange={() => onChange?.(index + 1)}
              aria-label={`${index + 1} – ${text}`}
              className="sr-only"
            />
            <Star
              title={text}
              isActive={shownStar !== null && shownStar >= index}
            />
          </label>
        ))}
      </div>
      {ratingText && (
        <p
          aria-hidden="true"
          className="text-muted-foreground ml-2 text-sm font-medium"
        >
          {ratingText}
        </p>
      )}
    </div>
  );
}
