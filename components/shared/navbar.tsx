'use client';

import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/service/logout';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';


// Navigation items array for better organization
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

// User dropdown menu items (logout is handled separately since it triggers an action, not navigation)
const USER_MENU_ITEMS = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

type IUser = {
    success: boolean;
    message: string;
    data: {
        profile: {
            id: string;
            name: string;
            email: string;
            role: string;
            activeStatus: string;
            createdAt: string;
            updatedAt: string;
            profile: {
                id: string;
                profilePhoto: string;
                bio: string | null;
                userId: string;
                createdAt: string;
                updatedAt: string;
            }
        }
    }
}
type NavbarProps = {
    user: IUser | null;
}
export function Navbar({user} : NavbarProps) {

    const router = useRouter();

    const logoutAction = async(action: string) => {
        // console.log("Logout action triggered:", action);

        if (action === "logout") {
            await logout();
            toast.success("User logged out successfully!");
            router.push("/login");

        }

    };

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-white">
              NJ
            </div>
            <span>NextJS</span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Dropdown Menu / Login */}
          {user?.success ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer">
                  🧑‍💼
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.data?.profile.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.data?.profile.email || 'john@example.com'}</p>
                </div>
                <DropdownMenuSeparator />
                {USER_MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem
                  onClick={async () => {
                    await logoutAction("logout");
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Button className="cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
