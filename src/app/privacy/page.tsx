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
            Welcome to GPT for Sports (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our AI chatbot service.
          </p>
          <p className="mb-3">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
          <p className="mb-3">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Create an account</li>
            <li>Sign in with third-party authentication providers</li>
            <li>Contact us directly</li>
            <li>Provide feedback</li>
          </ul>
          <p className="mb-3">
            This may include:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Email address</li>
            <li>Name</li>
            <li>Profile information provided by authentication services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4">Chat Data</h3>
          <p className="mb-3">
            <strong>Message Storage:</strong> We store your chat messages and interactions primarily when you provide feedback.
            This helps us improve our service and train our AI models. We may also maintain limited conversation history to provide 
            continuity in your interactions with our chatbot.
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">Authentication Data</h3>
          <p className="mb-3">
            <strong>Authentication:</strong> We offer sign-in with Google or email with One-Time Password (OTP). By using our service,
            you consent to the basic OAuth/OpenID Connect scopes required for authentication (email, profile, and openid).
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">Usage Data</h3>
          <p className="mb-3">
            We may automatically collect certain information about how you interact with our service, including:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>IP address</li>
            <li>Device type and operating system</li>
            <li>Browser type</li>
            <li>Pages visited and features used</li>
            <li>Time and date of your visit</li>
            <li>Time spent on certain pages</li>
            <li>Referring website address</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-3">
            We use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Provide, operate, and maintain our service</li>
            <li>Improve our chatbot&apos;s responses and functionality</li>
            <li>Develop new features, products, and services</li>
            <li>Understand and analyze how you use our service</li>
            <li>Personalize your experience</li>
            <li>Identify and authenticate users</li>
            <li>Respond to your requests or inquiries</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">AI Training</h3>
          <p className="mb-3">
            With your permission (such as when you provide feedback), we may use your chat interactions to train and improve our AI models.
            This helps us enhance the quality, accuracy, and relevance of our chatbot responses. If you do not want your data used for 
            training purposes, please contact us using the information provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
          <p className="mb-3">
            <strong>We do not sell your personal data.</strong> We may share your information in the following situations:
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Third-Party Service Providers</h3>
          <p className="mb-3">
            We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us 
            or on our behalf and require access to such information to do that work. These may include:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>Authentication providers (such as Google)</li>
            <li>Database and hosting providers (such as Supabase)</li>
            <li>Analytics providers</li>
            <li>Sports data providers</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">Legal Requirements</h3>
          <p className="mb-3">
            We may disclose your information if required to do so by law or in response to valid requests by public authorities 
            (e.g., a court or government agency).
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">Business Transfers</h3>
          <p className="mb-3">
            We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, 
            financing, or acquisition of all or a portion of our business to another company.
          </p>
          
          <h3 className="text-xl font-semibold mb-2 mt-4">With Your Consent</h3>
          <p className="mb-3">
            We may disclose your personal information for any other purpose with your consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-3">
            We implement appropriate technical and organizational measures to protect the security of your personal information. 
            However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. 
            While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p className="mb-3">
            We will retain your personal information only for as long as is necessary for the purposes set out in this privacy policy. 
            We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, 
            and enforce our legal agreements and policies.
          </p>
          <p className="mb-3">
            Usage data is generally retained for a shorter period, except when this data is used to strengthen security or to improve the 
            functionality of our service, or when we are legally obligated to retain this data for longer periods.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <p className="mb-3">
            We use cookies and similar tracking technologies to track activity on our service and store certain information. 
            Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p className="mb-3">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>To maintain your authenticated session</li>
            <li>To understand usage patterns</li>
            <li>To remember your preferences</li>
          </ul>
          <p className="mb-3">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
            you may not be able to use some portions of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
          <p className="mb-3">
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul className="list-disc ml-6 mb-3">
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction of inaccurate or incomplete information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to or restrict processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent where we rely on consent to process your information</li>
          </ul>
          <p className="mb-3">
            To exercise these rights, please contact us using the information provided at the end of this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
          <p className="mb-3">
            Our service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information 
            from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, 
            please contact us. If we become aware that we have collected personal information from children without verification of parental consent, 
            we take steps to remove that information from our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Status</h2>
          <p className="mb-3">
            This is currently a free service provided &quot;as is&quot; without any formal service guarantees.
            We do not accept payments or offer commercial services at this time, though we may introduce premium features in the future.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p className="mb-3">
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page and updating the &quot;Last Updated&quot; date. For material changes, we may provide additional notice, 
            such as a prominent website notice or an email notification.
          </p>
          <p className="mb-3">
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about this privacy policy, or if you would like to exercise any of your rights regarding your personal information, 
            please contact us at:
          </p>
          <p className="mb-3">
            <a href="mailto:support@gptforsports.com" className="text-blue-600 hover:text-blue-800">support@gptforsports.com</a>
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