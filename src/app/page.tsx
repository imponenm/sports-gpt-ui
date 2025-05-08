'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader"
import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen">
      <MainHeader user={user} />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-24">
          {/* Left Section */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              GPT for Sports
            </h1>
            <p className="text-xl text-gray-600">
            A fast, accurate AI chatbot fine-tuned for reliable sports data retrieval
            </p>
            <button 
              onClick={() => router.push('/chat')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try GPT for Sports
            </button>
          </div>

          {/* Right Section */}
          <div className="flex-1">
            <div className="aspect-square bg-gray-100 rounded-lg">
              {/* Add your image here */}
              {/* <Image src="/your-image.jpg" alt="Sports AI" width={500} height={500} /> */}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose GPT for Sports?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {/* Add your icon/image here */}
                {/* <Image src="/accuracy-icon.png" alt="Accuracy" width={24} height={24} /> */}
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {/* Add your icon/image here */}
                {/* <Image src="/intelligence-icon.png" alt="Intelligence" width={24} height={24} /> */}
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {/* Add your icon/image here */}
                {/* <Image src="/sports-icon.png" alt="Multiple Sports" width={24} height={24} /> */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Multiple Sports</h3>
                <p className="text-gray-600">
                  Ask questions about NBA and NFL data. More sports like MLB and EPL (English Premier League) are coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
