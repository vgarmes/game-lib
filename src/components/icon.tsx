import { HTMLAttributes } from 'react';

const Paths = ['check-circle', 'plus', 'pencil'] as const;
type Path = typeof Paths[number];
type Size = 'lg' | 'md' | 'sm';
const paths: { [k in Path]: JSX.Element } = {
  'check-circle': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  plus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  ),
  pencil: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  ),
};

interface Props {
  name: Path;
  size?: Size;
  className?: HTMLAttributes<HTMLSpanElement>['className'];
}

const SIZES: { [k in Size]: string } = {
  lg: 'h-6 w-6',
  md: 'h-4 w-4',
  sm: 'h-2 w-2',
};
const Icon: React.FC<Props> = ({ name, className, size = 'md' }) => {
  return (
    <span className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={SIZES[size]}
      >
        {paths[name]}
      </svg>
    </span>
  );
};

export default Icon;
