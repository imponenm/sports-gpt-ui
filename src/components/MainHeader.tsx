'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";

export function MainHeader({ user }: { user: User | null }) {
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      console.log('Logged out successfully');
      window.location.href = "/login";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">GPT for Sports</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">BETA</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="mailto:support@gptforsports.com" className="text-gray-600 hover:text-blue-600 transition-colors">
              Support
            </Link>
            {user ? (
              <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 transition-colors">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
