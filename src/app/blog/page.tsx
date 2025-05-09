'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { User } from "@supabase/supabase-js";
import { MainHeader } from '@/components/MainHeader';

export default function BlogPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        async function fetchPosts() {
            const supabase = createClient();

            const { data, error } = await supabase
                .schema('blog')
                .from('blog_posts')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching blog posts:', error);
                return;
            }

            setPosts(data || []);
            setLoading(false);
        }

        fetchPosts();
    }, []);

    return (
        <>
            <MainHeader user={user} />
            <div className="container mx-auto px-4 py-8 mt-16">
                <h1 className="text-3xl font-bold mb-8 text-gray-100">Blog</h1>

                {loading ? (
                    <div className="flex justify-center">
                        <p className="text-gray-300">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-300">No blog posts found.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <div key={post.id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-100">{post.title}</h2>
                                    <p className="text-gray-400 mb-4 text-sm">
                                        {new Date(post.created_at).toLocaleDateString()} • {post.author_name || 'Anonymous'}
                                    </p>
                                    <p className="text-gray-300 mb-4">{post.summary}</p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-purple-400 hover:text-purple-300 font-medium"
                                    >
                                        Read more →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
