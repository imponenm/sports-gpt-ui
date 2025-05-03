'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";

export default function PrivacyPage() {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-3">
            Welcome to our AI chatbot service. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we treat your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
          <p className="mb-3">
            <strong>Message Storage:</strong> We store your chat messages and interactions only when you provide feedback.
            This helps us improve our service and train our AI models.
          </p>
          <p className="mb-3">
            <strong>Authentication:</strong> We offer sign-in with Google oremail with One-Time Password (OTP). By using our service,
            you consent to the basic OAuth/OpenID Connect scopes required for authentication (email, profile, and op).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use of Your Information</h2>
          <p className="mb-3">
            We use the information we collect solely to:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Provide and maintain our service</li>
            <li>Improve our chatbot's responses and functionality</li>
            <li>Identify and authenticate users</li>
            <li>Respond to your requests or inquiries</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
          <p className="mb-3">
            <strong>We do not sell your data.</strong> We do not share or disclose your personal information to third parties
            except as necessary to provide our service (such as our authentication provider).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
          <p className="mb-3">
            This is currently a free service provided "as is" without any formal service guarantees.
            We do not accept payments or offer commercial services at this time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="mb-3">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about this privacy policy, please contact us at <a href="mailto:support@gptforsports.com" className="text-blue-600 hover:text-blue-800">support@gptforsports.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
