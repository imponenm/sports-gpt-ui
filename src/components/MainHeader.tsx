'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState } from 'react';

export function MainHeader({ user }: { user: User | null }) {
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-400">GPT for Sports</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-900 text-purple-200 rounded-full">BETA</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-400 hover:text-purple-300 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-purple-300 transition-colors">
              About
            </Link>
            <Link href="mailto:support@gptforsports.com" className="text-gray-400 hover:text-purple-300 transition-colors">
              Support
            </Link>
            {user ? (
              <button onClick={handleLogout} className="text-gray-400 hover:text-purple-300 transition-colors">
                Logout
              </button>
            ) : (
              <Link href="/login" className="text-gray-400 hover:text-purple-300 transition-colors">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="w-6 h-6 text-gray-400" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 bg-gray-900">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-400 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="mailto:support@gptforsports.com" 
                className="text-gray-400 hover:text-purple-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              {user ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="text-gray-400 hover:text-purple-300 transition-colors text-left"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="text-gray-400 hover:text-purple-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
