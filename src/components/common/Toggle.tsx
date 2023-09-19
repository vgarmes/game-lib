import clsx from 'clsx';
import React from 'react';
import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelPosition?: 'left' | 'right';
}
const Toggle = React.forwardRef<HTMLInputElement, Props>(
  ({ label, labelPosition = 'right', ...rest }, ref) => {
    const labelElement = (
      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </span>
    );
    return (
      <div className="w-full">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            ref={ref}
            type="checkbox"
            value=""
            id="checked-toggle"
            className="peer sr-only"
            {...rest}
          />
          {labelPosition === 'left' && labelElement}
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          {labelPosition === 'right' && labelElement}
        </label>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
