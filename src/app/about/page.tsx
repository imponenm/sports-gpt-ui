'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";
import Link from 'next/link';

export default function AboutPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  /* Get user from supabase */
  useEffect(() => {
    // Get initial user
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    }

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="">
      <MainHeader user={user} />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">About Sports GPT</h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-lg">
            Welcome to <span className="font-semibold">Sports GPT</span>, the specialized chatbot designed specifically for sports fans and analysts.
          </p>
          
          <h2 className="text-xl font-semibold mt-6">What makes Sports GPT different?</h2>
          <p>
            Unlike general AI chatbots, Sports GPT is fine-tuned to retrieve accurate information about sports. 
            We connect our language model directly to trusted sports data providers, ensuring that every 
            piece of information you receive is verified and not hallucinated.
          </p>
          
          <h2 className="text-xl font-semibold mt-6">Our Coverage</h2>
          <p>
            We're currently focused on NBA regular season data, with plans to rapidly expand our coverage to include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>NBA post-season statistics</li>
            <li>NFL data</li>
            <li>MLB statistics</li>
            <li>And many more sports leagues</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6">Data You Can Trust</h2>
          <p>
            When Sports GPT successfully answers your query, you can be confident that the information is 
            backed by real data from authoritative sources, not AI hallucinations or outdated information.
          </p>
          
          <h2 className="text-xl font-semibold mt-6">(Coming Soon) Fantasy Sports & Betting</h2>
          <p>
            Sports GPT is an invaluable tool for fantasy sports players and sports bettors who need reliable data to make informed decisions. We have specific features planned for this in the future:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Team matchups and comparisons</li>
            <li>Player-to-player comparisons</li>
            <li>Betting profitability estimator</li>
          </ul>
          <p className="mt-2">
            Whether you're managing fantasy teams or looking for an edge in sports betting, our data-backed insights 
            help you make decisions with confidence rather than guesswork.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Ready to try it out?</h3>
          <p className="mb-4">Ask about player stats, team performances, game results, and more!</p>
          <Link 
            href="/"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Start chatting with Sports GPT
          </Link>
        </div>
      </div>
    </div>
  );
}
