'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export default function NumberInput({
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  value,
  onChange,
  step = 1,
  disabled = false,
  className,
}: Props) {
  const inputValue = value === null ? '' : value.toString();

  const handleChange = (newValue: number | null) => {
    onChange(newValue);
  };

  const increment = () => {
    const currentValue = value || 0;
    const newValue = currentValue + step;
    const clampedValue = Math.min(Math.max(newValue, min), max);
    handleChange(clampedValue);
  };

  const decrement = () => {
    const currentValue = value || 0;
    const newValue = currentValue - step;
    const clampedValue = Math.min(Math.max(newValue, min), max);
    handleChange(clampedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      handleChange(null);
    } else {
      const newValue = Number(rawValue);
      if (!isNaN(newValue)) {
        // Don't clamp during typing, just update with the raw value
        handleChange(newValue);
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === '') {
      // Keep it empty
      return;
    }

    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      // Only clamp on blur
      const clampedValue = Math.min(Math.max(numValue, min), max);
      handleChange(clampedValue);
    }
  };

  return (
    <div
      className={cn(
        'border-input doutline-none focus-within:ring-ring focus-within:has-aria-invalid:ring-destructive/20 dark:focus-within:has-aria-invalid:ring-destructive/40 focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] disabled:opacity-50 focus-within:ring-2 focus-within:ring-offset-3',
        className
      )}
    >
      <Input
        data-testid="number-input__input"
        type="number"
        className="bg-background focus-visible:ring-offset-0 focus-visible:ring-0 text-foreground flex-1 px-3 py-2 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <div className="flex h-[calc(100%+2px)] flex-col">
        <button
          data-testid="number-input__increment"
          type="button"
          onClick={increment}
          slot="increment"
          className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || (value !== null && value >= max)}
        >
          <ChevronUpIcon size={12} aria-hidden="true" />
        </button>
        <button
          data-testid="number-input__decrement"
          type="button"
          onClick={decrement}
          slot="decrement"
          className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled || (value !== null && value <= min)}
        >
          <ChevronDownIcon size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
