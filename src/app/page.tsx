'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader"
import { useRouter } from "next/navigation";
import { CheckCircle2, Brain, Trophy } from 'lucide-react';
import { Slideshow } from '@/components/Slideshow';

export default function Page() {

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const slideImages = [
    "https://iansmuwyllcwraxherfk.supabase.co/storage/v1/object/public/homepage/previews/preview1.png",
    "https://iansmuwyllcwraxherfk.supabase.co/storage/v1/object/public/homepage/previews/preview2.png",
    "https://iansmuwyllcwraxherfk.supabase.co/storage/v1/object/public/homepage/previews/preview3.png",
    "https://iansmuwyllcwraxherfk.supabase.co/storage/v1/object/public/homepage/previews/preview4.png"
  ];

  /* Get user from supabase */
  useEffect(() => {
    
    // Get initial user
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        router.push('/chat');
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

  const handleTryGPT = () => {
    if (user) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <MainHeader user={user} />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-24">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-300">
              Chatbot for Sports Data
            </h1>
            <p className="text-xl text-gray-400">
            Get accurate answers to sports questions from an AI that has access to real data.
            </p>
            <button 
              onClick={handleTryGPT}
              className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
            >
              Try GPT for Sports
            </button>
          </div>

          {/* Right Section - Slideshow */}
          <div className="flex-1 w-full max-w-full md:max-w-[600px] mx-auto">
            <Slideshow 
              images={slideImages} 
              className="border border-purple-500 shadow-lg shadow-purple-900/30"
              height="300px" 
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-300">Why Choose GPT for Sports?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-700 bg-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center px-2">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Accurate</h3>
                <p className="text-gray-400">
                  GPT for Sports retrieves data from an actual database, so the data is guaranteed not to be hallucinated
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-700 bg-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center px-2">
                <Brain className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Intelligent</h3>
                <p className="text-gray-400">
                  We use the best AI models, and finetune them for retrieving sports data
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-700 bg-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 transition-all">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center px-2">
                <Trophy className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-200">Multiple Sports</h3>
                <p className="text-gray-400">
                  Ask questions about NBA and NFL data. More sports like MLB and EPL are coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-3xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">Pricing</h2>
          <p className="text-xl text-gray-400 mb-12">
            Currently in beta: Unlimited free usage for all users.<br />
            After beta: Free tier with limited usage and paid tier with unlimited access.
          </p>
          <button 
            onClick={handleTryGPT}
            className="px-8 py-4 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors text-lg font-semibold cursor-pointer"
          >
            Try GPT for Sports Now
          </button>
        </div>
      </main>
    </div>
  )
}
