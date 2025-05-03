"use client";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
// import Image from 'next/image';
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

  async function handleGoogleSignIn() {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      }
    });

    if (error) {
      setMessage('Failed to sign in with Google. Please try again.');
      console.log(error);
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

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-2 mb-6 py-2.5 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
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
