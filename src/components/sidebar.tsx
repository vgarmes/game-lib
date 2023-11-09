import Link from 'next/link';
import { Button } from './ui/button';
import { Gamepad2, Library, LucideIcon, BookmarkCheck } from 'lucide-react';
import { useRouter } from 'next/router';

interface SectionProps {
  title: string;
  links: Array<{ title: string; href: string; Icon: LucideIcon }>;
}

const sections: Array<SectionProps> = [
  {
    title: 'Home',
    links: [{ title: 'Completed', href: '/', Icon: BookmarkCheck }],
  },
  {
    title: 'Library',
    links: [
      { title: 'Games', href: '/games', Icon: Library },
      { title: 'Platforms', href: '/platforms', Icon: Gamepad2 },
    ],
  },
];

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="space-y-4 py-4">
      {sections.map((section) => (
        <div key={section.title} className="py-2 pr-4">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.links.map(({ title, href, Icon }) => (
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
          </div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
