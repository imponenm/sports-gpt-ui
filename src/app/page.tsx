'use client';

import { ChatForm } from "@/components/chat-form"
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
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
        console.log("User is logged in");
        console.log(user);
        setUser(user);
      } else {
        console.log("User is not logged in");
        router.push("/login")
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
      <ChatForm />
    </div>
  )
}
