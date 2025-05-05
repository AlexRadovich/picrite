'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserAndLikes = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) return;

      const uid = session.user.id;
      setUserId(uid);

      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', uid)
        .single();

      setLiked(!!existingLike);

      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      setLikeCount(count ?? 0);
    };

    fetchUserAndLikes();
  }, [postId]);

  const toggleLike = async () => {
    if (!userId || loading) return;

    setLoading(true);

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from('likes').insert({
        post_id: postId,
        user_id: userId,
      });

      setLiked(true);
      setLikeCount((c) => c + 1);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`transition-colors duration-200 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 border ${
        liked
          ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
      } ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <span className="text-lg">{liked ? '❤️' : '🤍'}</span>
      {likeCount}
    </button>
  );
}
