import { ChatForm } from "@/components/chat-form"
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function Page() {

  const [user, setUser] = useState<User | null>(null);

  /* Get user from supabase */
  useEffect(() => {
    const supabase = createClient();

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
      <ChatForm />
    </div>
  )
}
