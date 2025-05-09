'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { MainHeader } from '@/components/MainHeader';

interface PageParams {
  slug: string;
}

export default function BlogPostPage({ params }: { params: Promise<PageParams> }) {
  const unwrappedParams = React.use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { slug } = unwrappedParams;
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

  useEffect(() => {
    async function fetchPost() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .schema('blog')
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        if (error.code === 'PGRST116') {
          // Post not found
          router.push('/blog');
        }
        return;
      }
      
      setPost(data);
      setLoading(false);
    }
    
    fetchPost();
  }, [slug, router]);

  if (loading) {
    return (
      <>
        <MainHeader user={user} />
        <div className="container mx-auto px-4 py-12 flex justify-center mt-16">
          <p className="text-gray-300">Loading post...</p>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <MainHeader user={user} />
        <div className="container mx-auto px-4 py-12 text-center mt-16">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Post not found</h1>
          <Link href="/blog" className="text-purple-400 hover:text-purple-300">
            ← Back to blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader user={user} />
      <div className="container mx-auto px-4 py-12 max-w-3xl mt-16">
        <Link href="/blog" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to blog
        </Link>
        
        <article className="prose lg:prose-xl mx-auto prose-invert">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">{post.title}</h1>
          
          <div className="text-gray-400 mb-8">
            <p>
              {new Date(post.created_at).toLocaleDateString()} • 
              {post.author_name ? ` By ${post.author_name}` : ''}
            </p>
          </div>
          
          {post.summary && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-8">
              <p className="italic text-gray-300">{post.summary}</p>
            </div>
          )}
          
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="mb-12 text-gray-300 blog-content"
          />
          
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try GPT for Sports
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
