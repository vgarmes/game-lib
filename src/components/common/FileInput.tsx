import React, { InputHTMLAttributes } from 'react';

const FileInput = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
        Upload file
      </span>
      <input
        ref={ref}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        {...props}
      ></input>
    </label>
  );
});

FileInput.displayName = 'FileInput';

export default FileInput;
