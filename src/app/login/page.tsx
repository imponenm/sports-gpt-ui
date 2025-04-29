"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Icon } from 'lucide-react';
import { basketball } from '@lucide/lab';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      setMessage('Failed to send magic link. Please try again.');
      console.log(error);
      console.log(error.message);
    } else {
      setMessage('Magic link sent! Check your email to log in.');
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Icon iconNode={basketball} size={72} />
          <h1 className="text-2xl font-bold text-gray-800 mt-8">Login to Sports GPT</h1>
          <p className="text-gray-600 mt-2">Enter your email to sign up or login</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-black"
            required
            placeholder="your@email.com"
          />
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Send Magic Link
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-4 rounded-md ${
            message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
