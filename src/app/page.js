'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; 
import NavBar from '@/components/NavBar';

const Home = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const checkSessionAndFetchPosts = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setLoading(false);
        return;
      }

      if (sessionData?.session) {
        setSession(sessionData.session);
      } else {
        router.push("/auth/signin");
        return;
      }

      // Fetch posts
      const { data, error } = await supabase
        .from('posts')
        .select('id, image_url, created_at, display_name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
      } else {
        console.log('Fetched posts:', data);
        setPosts(data);
      }

      setLoading(false);
    };

    checkSessionAndFetchPosts();
  }, [router, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600">Images</h1>
      </header>

      <section className="overflow-y-auto max-h-screen px-4">
        <div className="flex flex-col space-y-8 py-8">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col items-center bg-white p-4 rounded shadow-md">
              <img
                src={post.image_url}
                alt="Uploaded"
                className="w-full max-w-2xl rounded-md object-cover"
              />
              <div className="mt-4 text-gray-700 text-sm">
                Posted by <span className="font-semibold">{post.display_name || 'Unknown'}</span> on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
