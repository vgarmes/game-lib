import classNames, { Argument } from 'classnames';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  colorScheme?: 'primary' | 'secondary';
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  variant = 'solid',
  colorScheme = 'primary',
  disabled,
  children,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        'shadow-sm; rounded-md border px-4 py-2 font-medium',
        {
          'border-pink-700': colorScheme === 'primary',
          'cursor-not-allowed border-slate-500 text-slate-500': disabled,
          'bg-pink-600 hover:border-pink-800 hover:bg-pink-700':
            variant === 'solid' && colorScheme === 'primary' && !disabled,
          'hover:border-pink-800':
            variant === 'outline' && colorScheme === 'primary' && !disabled,
        }
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
