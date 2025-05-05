'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    const user = data?.user;

    if (user?.id) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            display_name: displayName,
          },
        ]);

      if (insertError) {
        setMessage(`Signup succeeded but failed to save profile: ${insertError.message}`);
        return;
      }
    }

    setMessage('Account created! Check your email to confirm your address.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2b45] to-[#2a395e] relative">
      <div className="absolute inset-0 bg-[url('/bokeh.jpg')] bg-cover bg-center opacity-10 blur-sm z-0" />

      <form
        onSubmit={handleSubmit}
        className="z-10 bg-[#f5f5f4] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#821019]/30 backdrop-blur"
      >
        <h2 className="text-3xl font-bold text-center text-[#1e2b45] mb-6">
          Sign Up for PicGate
        </h2>

        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-3 border border-[#1e2b45]/30 rounded mb-4 focus:ring-2 focus:ring-[#821019] outline-none"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-[#1e2b45]/30 rounded mb-4 focus:ring-2 focus:ring-[#821019] outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-[#1e2b45]/30 rounded mb-4 focus:ring-2 focus:ring-[#821019] outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#821019] hover:bg-[#6c0f16] text-white font-semibold py-2 rounded transition"
        >
          Sign Up
        </button>

        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        <p className="mt-4 text-center text-sm text-[#1e2b45]">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-[#821019] hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
