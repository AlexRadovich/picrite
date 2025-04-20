'use client'; // This makes the component run on the client (necessary for React hooks)

import { useState } from 'react'; // React state hook
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client instance
import { useRouter } from "next/navigation";

export default function SignIn() {
  // Local state for user inputs and feedback messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // This function handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Call Supabase's signInWithPassword method
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Show error message from Supabase
      setMessage(`Error: ${error.message}`);
    } else {
      // Success — show a message or redirect the user
      setMessage('Successfully signed in!');
      router.push("/");
      // You could redirect with: router.push('/')
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Sign In
        </button>

        {/* Display any success or error messages */}
        {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

        {/* Optional: Link to the sign-up page */}
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
