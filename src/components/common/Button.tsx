import clsx from 'clsx';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ColorScheme = 'primary' | 'secondary';
type Variant = 'solid' | 'outline';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  colorScheme?: ColorScheme;
}

export const getButtonClassnames = (
  colorScheme: ColorScheme,
  variant: Variant,
  disabled: boolean = false
) =>
  clsx(
    'shadow-sm truncate rounded-md border px-4 py-2 font-medium flex items-center justify-center text-slate-100',
    {
      'border-pink-700': colorScheme === 'primary',
      'cursor-not-allowed border-slate-500 text-slate-500': disabled,
      'bg-pink-600 hover:border-pink-800 hover:bg-pink-700':
        variant === 'solid' && colorScheme === 'primary' && !disabled,
      'hover:border-pink-800':
        variant === 'outline' && colorScheme === 'primary' && !disabled,
    }
  );

const Button: React.FC<PropsWithChildren<Props>> = ({
  variant = 'solid',
  colorScheme = 'primary',
  disabled = false,
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        getButtonClassnames(colorScheme, variant, disabled),
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
