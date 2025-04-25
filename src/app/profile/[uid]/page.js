// app/profile/[uid]/page.js

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const { uid } = useParams();
  const [displayName, setDisplayName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase
        .from('users') // If you have a 'users' table that mirrors auth
        .select('display_name')
        .eq('id', uid)
        .single();

      if (userError) {
        console.error(userError);
        setDisplayName('Unknown User');
      } else {
        setDisplayName(userData.display_name);
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('id, image_url, caption')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (postError) {
        console.error(postError);
      } else {
        setPosts(postData);
      }

      setLoading(false);
    };

    if (uid) fetchProfile();
  }, [uid]);

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{displayName}'s Profile</h1>

      {posts.length === 0 ? (
        <p>This user hasn't posted anything yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow rounded overflow-hidden">
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full object-cover max-h-60"
              />
              <div className="p-2 text-sm">{post.caption}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
