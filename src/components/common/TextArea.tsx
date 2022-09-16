import React, { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, rows = 4, placeholder, className, ...rest }, ref) => {
    return (
      <div className={className}>
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
          <textarea
            ref={ref}
            rows={rows}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder={placeholder}
            {...rest}
          ></textarea>
        </label>
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
