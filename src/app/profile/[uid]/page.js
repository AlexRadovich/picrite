'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function UserProfilePage() {
  const { uid } = useParams();
  const [displayName, setDisplayName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) {
        console.error("User ID is not available.");
        return;
      }

      // Fetch user display name
      const { data: userData, error: userError } = await supabase
        .from('profiles') // Check that you're using the correct table name for the user profiles
        .select('display_name')
        .eq('id', uid)
        .single();

      if (userError) {
        console.error('Error fetching display name:', userError);
        setDisplayName('Unknown User');
      } else if (userData) {
        setDisplayName(userData.display_name || 'No Display Name');
      }

      // Fetch posts
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('id, image_url, caption')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (postError) {
        console.error('Error fetching posts:', postError);
      } else {
        setPosts(postData);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [uid]);

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header>
        <NavBar />
      </header>

      <div className="max-w-6xl mx-auto p-6 pt-24">
        <h1 className="text-4xl font-bold text-[#821019] mb-6 text-center">{displayName}'s Profile</h1>

        {posts.length === 0 ? (
          <p className="text-center text-lg text-gray-600">This user hasn't posted anything yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white shadow rounded overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.caption}
                  className="w-full object-cover h-64 rounded-t"
                />
                <div className="p-4 text-sm text-gray-600">
                  {post.caption && <p>{post.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
