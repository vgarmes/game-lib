import { signOut, useSession } from 'next-auth/react';
import { buttonVariants } from './ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

const getInitials = (name: string) => {
  let initials = '';
  const splitName = name.split(' ');
  const LENGTH = 2;
  for (let i = 0; i < LENGTH; i++) {
    if (typeof splitName[i] !== 'undefined') {
      initials += splitName[i][0];
    }
  }
  return initials;
};

const UserMenu = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className={buttonVariants({ variant: 'default' })}
      >
        Sign in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
            <AvatarFallback>
              {getInitials(session.user.username ?? '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="w-full">
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
