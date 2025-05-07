'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Successfully signed in!');

      const user = data.user;

      if (user) {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile && !fetchError) {
          // Insert profile
          const { error: insertError } = await supabase.from('profiles').insert([
            {
              id: user.id,
              display_name: user.user_metadata?.display_name || 'Anonymous',
            },
          ]);

          if (insertError) {
            console.error('Failed to create profile:', insertError.message);
          } else {
            console.log('Profile created successfully.');
          }
        }
      }

      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2b45] to-[#2a395e] relative">
  {/* Optional Bokeh background image */}
  <div className="absolute inset-0 bg-[url('/bokeh.jpg')] bg-cover bg-center opacity-10 blur-sm z-0" />

  <form
    onSubmit={handleSubmit}
    className="z-10 bg-[#f5f5f4] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#821019]/30 backdrop-blur"
  >
    <h2 className="text-3xl font-bold text-center text-[#821019] mb-6">
      Sign In to PicGate
    </h2>

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 border text-[#303030] border-[#1e2b45]/30 rounded mb-4 focus:ring-2 focus:ring-[#821019] outline-none"
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-3 border text-[#303030] border-[#1e2b45]/30 rounded mb-4 focus:ring-2 focus:ring-[#821019] outline-none"
      required
    />

    <button
      type="submit"
      className="w-full bg-[#821019] hover:bg-[#6c0f16] text-white font-semibold py-2 rounded transition"
    >
      Sign In
    </button>

    {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

    <p className="mt-4 text-center text-sm text-[#1e2b45]">
      Don't have an account?{' '}
      <a href="/auth/signup" className="text-[#821019] hover:underline">
        Sign up
      </a>
    </p>
  </form>
</div>

  );
}
