import { Separator } from './ui/separator';

interface Props {
  title: string;
  description?: string;
}

const PageTitle: React.FC<Props> = ({ title, description }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Separator className="my-4" />
    </>
  );
};
export default PageTitle;
