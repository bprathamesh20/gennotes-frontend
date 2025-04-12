'use client'; // Make this a Client Component to use hooks

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@stackframe/stack'; // Import the useUser hook
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
const Navbar = () => {
  const user = useUser(); // Get user data

  // Helper function to get initials from display name
  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-1 rtl:space-x-reverse">
          <Image src="/logo.png" width={48} height={48} alt="gennotes Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900 [letter-spacing:-0.06em]">gennotes</span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            // User is logged in: Show Avatar and Name
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 text-gray-500">
                <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.displayName ?? 'User'} />
                <AvatarFallback >{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                {user.displayName ?? 'User'}
              </span>
              {/* TODO: Add DropdownMenu for logout/profile later */}
            </div>
          ) : (
            // User is logged out: Show Get Started button
            <Button variant="default">Get started</Button>
          )}
          <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-cta" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        {/* Links removed as requested */}
      </div>
    </nav>
  );
};

export default Navbar;