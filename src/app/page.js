"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import NavBar from '@/components/NavBar';

const Home = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // To store images from DB
  const router = useRouter();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }

      if (data?.session) {
        setSession(data.session);
        console.log("User is signed in:", data.session.user);
      } else {
        console.log("User is not signed in");
        router.push("/auth/signin");
      }

      setLoading(false);
    };

    checkSession();
  }, [router, supabase]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('posts') // assuming your table is called 'posts'
        .select('id, image_url, created_at')
        .order('created_at', { ascending: false }); // Newest first

      if (error) {
        console.error('Error fetching images:', error);
      } else {
        setImages(data);
      }
    };

    if (session) {
      fetchImages();
    }
  }, [session, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600">Images</h1>
      </header>

      <section className="overflow-y-auto max-h-screen">
        <div className="flex flex-col space-y-4 py-8 px-4">
          {images.length > 0 ? (
            images.map((post) => (
              <div key={post.id} className="flex-none w-full h-auto">
                <img
                  src={post.image_url}
                  alt="Uploaded"
                  className="w-full h-auto object-cover rounded-lg shadow"
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No images uploaded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
