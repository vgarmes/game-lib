import { SearchForm } from './app-sidebar/search-form';
import ThemeSwitcher from './theme-switcher';
import { SidebarTrigger } from './ui/sidebar';

export const Header: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 backdrop-blur z-10">
      <SidebarTrigger className="-ml-1" />

      {/*  
       <Separator orientation="vertical" className="mr-2 h-4" />
       <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
      <div className="flex items-center flex-grow gap-2 justify-end">
        <SearchForm />
        <ThemeSwitcher />
      </div>
    </header>
  );
};
