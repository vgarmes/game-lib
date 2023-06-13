import classNames from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

const Title: React.FC<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className }) => {
  return (
    <h2 className={classNames('pb-12 text-3xl font-bold', className)}>
      {children}
    </h2>
  );
};

export default Title;
