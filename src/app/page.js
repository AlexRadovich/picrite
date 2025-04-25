"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js"; // Import createClient
import NavBar from '@/components/NavBar';

const Home = () => {
  const [session, setSession] = useState(null);  // To store the user session
  const [loading, setLoading] = useState(true);  // To handle the loading state
  const router = useRouter();
  
  // Initialize the Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Your Supabase URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Your Supabase anon key
  const supabase = createClient(supabaseUrl, supabaseAnonKey); // Use createClient to initialize the Supabase client

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
        console.log("Access token:", data.session.access_token);
      } else {
        console.log("User is not signed in");
        router.push("/auth/signin"); // Redirect to the sign-in page if no session
      }

      setLoading(false); // Once the session is checked, stop loading
    };

    checkSession();
  }, [router, supabase]);

  if (loading) {
    return <div>Loading...</div>; // Optional: display loading state while checking session
  }

  const sampleImages = [
    "https://via.placeholder.com/1200x800/0000FF/808080?Text=Image+1",
    "https://via.placeholder.com/1200x800/FF6347/FFFFFF?Text=Image+2",
    "https://via.placeholder.com/1200x800/32CD32/FFFFFF?Text=Image+3",
    "https://via.placeholder.com/1200x800/FFD700/FFFFFF?Text=Image+4",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <header className="text-center py-8">
        
        <h1 className="text-4xl font-bold text-blue-600">Images</h1>
      </header>

      <section className="overflow-y-auto max-h-screen">
        <div className="flex flex-col space-y-4 py-8">
          {sampleImages.map((image, index) => (
            <div key={index} className="flex-none w-full h-auto">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
