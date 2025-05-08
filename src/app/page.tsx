'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Brain, Trophy } from 'lucide-react';

export default function Page() {

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

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
    <div className="min-h-screen">
      <MainHeader user={user} />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-24">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Chatbot for Sports Data
            </h1>
            <p className="text-xl text-gray-600">
            Get accurate answers to sports questions from an AI that has access to real data.
            </p>
            <button 
              onClick={handleTryGPT}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try GPT for Sports
            </button>
          </div>

          {/* Right Section */}
          <div className="flex-1">
            <div className="relative w-full">
              <Image 
                src="/sample1.png" 
                alt="Sports AI" 
                width={500}
                height={375}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GPT for Sports?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center px-2">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Accurate</h3>
                <p className="text-gray-600">
                  GPT for Sports retrieves data from an actual database, so the data is guaranteed not to be hallucinated
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center px-2">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Intelligent</h3>
                <p className="text-gray-600">
                  We use the best AI models, and finetune them for retrieving sports data
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center px-2">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multiple Sports</h3>
                <p className="text-gray-600">
                  Ask questions about NBA and NFL data. More sports like MLB and EPL are coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-3xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Pricing</h2>
          <p className="text-xl text-gray-600 mb-12">
            Currently in beta: Unlimited free usage for all users.<br />
            After beta: Free tier with limited usage and paid tier with unlimited access.
          </p>
          <button 
            onClick={handleTryGPT}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Try GPT for Sports Now
          </button>
        </div>
      </main>
    </div>
  )
}
