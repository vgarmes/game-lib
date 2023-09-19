import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren } from 'react';

const Title: React.FC<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className }) => {
  return (
    <h2 className={clsx('pb-12 text-3xl font-bold', className)}>{children}</h2>
  );
};

export default Title;
