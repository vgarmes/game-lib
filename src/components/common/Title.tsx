import { PropsWithChildren } from 'react';

const Title: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return <h2 className="pb-6 text-3xl font-bold">{children}</h2>;
};

export default Title;
