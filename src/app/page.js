'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; 
import NavBar from '@/components/NavBar';
import LikeButton from '@/components/LikeButton';


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

      // Fetch posts including captions
      const { data, error } = await supabase
        .from('posts')
        .select('id, image_url, created_at, display_name, caption')
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
      {/* Navbar that spans across the top of the screen */}
      <NavBar />
      
      {/* Main content container for posts */}
      <section className="overflow-y-auto max-h-screen w-full px-4 flex justify-center ">
        <div className="flex flex-col items-center space-y-8 py-8 w-full max-w-screen-lg">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col items-center bg-white p-4 rounded shadow-md w-full">
              {/* Image Container */}
              <div className="relative w-full h-[60vh] flex justify-center items-center mb-4">
                <img
                  src={post.image_url}
                  alt="Uploaded"
                  className="object-contain w-full h-full rounded-md" // Ensures the image scales to fit the container without cropping
                />
              </div>

              {/* Poster Info and Caption below the image */}
              <div className="mt-4 text-gray-700 text-sm">
                By <span className="font-semibold">{post.display_name || 'Unknown'}</span> on {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
              </div>
              {post.caption && (
                <div className="mt-2 pb-10 text-gray-600 italic">{post.caption}</div>
              )}
              <div className="mt-4 self-start">
                <LikeButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
