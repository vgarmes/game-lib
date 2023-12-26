import Link from 'next/link';
import { Button } from './ui/button';
import { Library, LucideIcon, Home, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/router';

interface SectionProps {
  title: string;
  href: string;
  Icon: LucideIcon;
}

const sections: Array<SectionProps> = [
  {
    title: 'Home',
    href: '/',
    Icon: Home,
  },
  {
    title: 'Search',
    href: '/search',
    Icon: Search,
  },
  { title: 'Library', href: '/library', Icon: Library },
  { title: 'Add game', href: '/game/new', Icon: Plus },
];

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="space-y-1 py-4">
      {sections.map(({ title, href, Icon }) => (
        <Button
          key={title}
          variant={router.asPath === href ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          asChild
        >
          <Link href={href}>
            <Icon className="mr-2 w-4 h-4" />
            <span className="truncate">{title}</span>
          </Link>
        </Button>
      ))}
    </aside>
  );
};

export default Sidebar;
