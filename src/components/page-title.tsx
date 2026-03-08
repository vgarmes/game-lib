interface Props {
  title: string;
  description?: string;
}

const PageTitle: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
};
export default PageTitle;
