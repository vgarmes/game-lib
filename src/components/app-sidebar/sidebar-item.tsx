import clsx from 'clsx';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  href: string;
  Icon: LucideIcon;
  isActive: boolean;
}

const SidebarListItem: React.FC<Props> = ({ title, href, Icon, isActive }) => {
  return (
    <li key={title}>
      <Link
        href={href}
        className={clsx(
          'flex items-center px-4 py-2 gap-2 transition-colors rounded-lg',
          {
            'bg-primary text-primary-foreground': isActive,
            'text-muted-foreground hover:text-foreground hover:bg-muted':
              !isActive,
          }
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="truncate font-medium text-sm">{title}</span>
      </Link>
    </li>
  );
};

export default SidebarListItem;
