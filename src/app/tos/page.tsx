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
            Welcome to GPT for Sports, an AI chatbot service designed to answer sports-related questions. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our service.
          </p>
          <p className="mb-3">
            These Terms constitute a legally binding agreement between you and GPT for Sports regarding your use of the service. If you do not agree to these Terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
          <p className="mb-3">
            GPT for Sports provides an AI-powered chatbot service that answers questions related to sports information, statistics, rules, and other sports-related topics. Our service is currently provided free of charge, though we may introduce premium features in the future.
          </p>
          <p className="mb-3">
            The information provided by our service is for informational and entertainment purposes only. While we strive for accuracy, we cannot guarantee that all information provided is complete, accurate, or up-to-date.
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
          <p className="mb-3">
            We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.
          </p>
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
            <li>Use automated methods or bots to access or interact with the service</li>
            <li>Scrape, data-mine, or extract data from our service for commercial purposes</li>
            <li>Use the service to send spam, chain letters, or other unsolicited communications</li>
            <li>Submit content that is harmful, offensive, or otherwise objectionable</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
            <li>Submit content that infringes on intellectual property rights of others</li>
            <li>Reverse engineer, decompile, or attempt to discover the source code of our service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Usage Restrictions</h2>
          <p className="mb-3">
            The sports data provided through our service is licensed from third-party data providers. You acknowledge and agree that:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>You may use the data solely for your personal, non-commercial use</li>
            <li>You may not redistribute, sell, sublicense, or otherwise make the data available to any third party</li>
            <li>You may not use the data to create or enhance a competing product or service</li>
            <li>You may not store or cache substantial portions of the data except as necessary for your personal use of our service</li>
            <li>You have no ownership rights to the data provided through our service</li>
          </ul>
          <p className="mb-3">
            Violation of these data usage restrictions may result in immediate termination of your access to our service and may subject you to legal action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Content and Intellectual Property</h2>
          <p className="mb-3">
            All content provided through our service, including but not limited to text, graphics, logos, and software, is the property of GPT for Sports or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express permission.
          </p>
          <p className="mb-3">
            By submitting any content to our service (such as feedback or questions), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any existing or future media.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Premium Services</h2>
          <p className="mb-3">
            While our service is currently free, we may introduce premium features or subscription services in the future. If we do, additional terms may apply to these premium services, which will be presented to you at the time of subscription.
          </p>
          <p className="mb-3">
            Any future billing practices, refund policies, and subscription management details will be clearly communicated before you are charged for any service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
          <p className="mb-3">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mb-3">
            We do not guarantee that the service will be uninterrupted, timely, secure, or error-free, or that the results obtained from the use of the service will be accurate or reliable. The information provided by our AI chatbot is generated based on patterns and data it has been trained on and may not always be accurate or up-to-date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-3">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL GPT FOR SPORTS, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p className="mb-3">
            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE SERVICE, REGARDLESS OF THE FORM OF ACTION, WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US TO USE THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM OR (B) $100.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
          <p className="mb-3">
            You agree to defend, indemnify, and hold harmless GPT for Sports and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the service.
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
            We may update these Terms of Service from time to time. We will notify you of any significant changes by posting the new Terms of Service on this page and/or by sending you an email. You are advised to review these Terms of Service periodically for any changes.
          </p>
          <p className="mb-3">
            Your continued use of the service after any changes to the Terms constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p className="mb-3">
            These Terms of Service shall be governed by and construed in accordance with the laws of the State of [YOUR STATE], without regard to its conflict of law provisions. Any dispute arising from or relating to these Terms or your use of the service shall be subject to the exclusive jurisdiction of the state and federal courts located in [YOUR JURISDICTION].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Severability</h2>
          <p className="mb-3">
            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect and enforceable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Entire Agreement</h2>
          <p className="mb-3">
            These Terms constitute the entire agreement between you and GPT for Sports regarding your use of the service and supersede all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning the subject matter of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@gptforsports.com" className="text-blue-600 hover:text-blue-800">support@gptforsports.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <p className="text-sm text-gray-600">
            Last updated: May 8, 2025
          </p>
        </section>
      </div>
    </div>
  );
}