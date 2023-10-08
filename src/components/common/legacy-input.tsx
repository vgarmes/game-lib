import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import React from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...rest }, ref) => {
    const hasError = !!error;
    return (
      <div className="w-full pb-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        <label>
          <span
            className={clsx('pb-2', {
              'text-red-700 dark:text-red-500': hasError,
            })}
          >
            {label}
          </span>
          <input
            ref={ref}
            className={clsx(
              'mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
              {
                'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500':
                  hasError,
              }
            )}
            {...rest}
          />
        </label>
        <div className="flex h-6 items-end">
          {error && <p className="text-red-600 dark:text-red-500">{error}</p>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
