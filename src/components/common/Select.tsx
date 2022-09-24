import React, { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: Array<{ value: string | number; label: string | null }>;
}

const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, options, placeholder, className, ...rest }, ref) => {
    return (
      <div className={className}>
        <label>
          <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400">
            {label}
          </span>
          <select
            ref={ref}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            {...rest}
          >
            <option key="default" value="">
              {placeholder}
            </option>
            {options?.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
