import { HTMLAttributes, InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import React from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...rest }, ref) => {
    const hasError = !!error;
    return (
      <div className={className}>
        <label>
          <span
            className={classNames(
              'mb-2 text-sm font-medium text-gray-900 dark:text-gray-300',
              { 'text-red-700 dark:text-red-500': hasError }
            )}
          >
            {label}
          </span>
          <input
            ref={ref}
            className={classNames(
              'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
              {
                'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500':
                  hasError,
              }
            )}
            {...rest}
          />
        </label>
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
