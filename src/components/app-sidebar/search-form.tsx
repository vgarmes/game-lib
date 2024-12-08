import { Search } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '../ui/sidebar';
import { Label } from '../ui/label';
import { useRouter } from 'next/router';

const NAME = 'search';

export function SearchForm() {
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const { [NAME]: query } = Object.fromEntries(formData.entries());

        if (typeof query !== 'string') return;
        router.push({
          pathname: '/search',
          query: { q: query },
        });
      }}
    >
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search a game..."
            className="pl-8"
            name={NAME}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
