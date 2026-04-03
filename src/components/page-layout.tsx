import { SiteHeader } from "./site-header";

interface Props {
  breadcrumbs?: React.ReactNode;
  children?: React.ReactNode;
}
export function PageLayout({ children, breadcrumbs }: Props) {
  return (
    <>
      <SiteHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
