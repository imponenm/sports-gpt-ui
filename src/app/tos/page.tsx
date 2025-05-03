'use client';

import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { MainHeader } from "@/components/MainHeader";

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-3">
            Welcome to GPT for Sports, an AI chatbot service designed to answer sports-related questions. By accessing or using our service, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
          <p className="mb-3">
            GPT for Sports provides an AI-powered chatbot service that answers questions related to sports information, statistics, rules, and other sports-related topics. Our service is currently provided free of charge and without any guarantees of availability, accuracy, or completeness.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
          <p className="mb-3">
            To use certain features of our service, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Provide accurate and complete information when creating your account</li>
            <li>Update your information as needed to keep it accurate and current</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Be solely responsible for all activity that occurs under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
          <p className="mb-3">
            When using our service, you agree not to:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Use the service for any illegal purpose or in violation of any laws</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
            <li>Interfere with or disrupt the service or servers or networks connected to the service</li>
            <li>Use the service to send spam, chain letters, or other unsolicited communications</li>
            <li>Submit content that is harmful, offensive, or otherwise objectionable</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
            <li>Submit content that infringes on intellectual property rights of others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Content and Intellectual Property</h2>
          <p className="mb-3">
            All content provided through our service, including but not limited to text, graphics, logos, and software, is the property of GPT for Sports or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
          <p className="mb-3">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mb-3">
            We do not guarantee that the service will be uninterrupted, timely, secure, or error-free, or that the results obtained from the use of the service will be accurate or reliable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-3">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL GPT FOR SPORTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Modifications to the Service</h2>
          <p className="mb-3">
            We reserve the right to modify, suspend, or discontinue the service, temporarily or permanently, at any time without notice. You agree that we will not be liable to you or to any third party for any modification, suspension, or discontinuation of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
          <p className="mb-3">
            We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page. You are advised to review these Terms of Service periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p className="mb-3">
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which GPT for Sports operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@gptforsports.com" className="text-blue-600 hover:text-blue-800">support@gptforsports.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
