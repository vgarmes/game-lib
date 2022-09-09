import { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <div>
      <label>
        {label}
        <input
          {...rest}
          className={classNames({ 'border-red-700': !!error })}
        />
      </label>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
};

export default Input;
