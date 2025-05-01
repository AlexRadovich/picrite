'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const NavBar = () => {
  const pathname = usePathname();
  const [userId, setUserId] = useState(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user && !userError) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from('profiles') // ✅ use the correct table
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setDisplayName(data.display_name);
        } else {
          console.error('Failed to fetch display name:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const linkClasses = (path) =>
    `flex items-center space-x-1 ${
      pathname === path ? 'text-black' : 'text-gray-500 hover:text-gray-800'
    }`;

  return (
    <header className="bg-white shadow w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between w-full">
          {/* Left side for navigation items */}
          <nav className="flex items-center space-x-6">
            <Link href="/" className={linkClasses('/')}>
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/upload" className={linkClasses('/upload')}>
              <Upload size={20} />
              <span className="hidden sm:inline">Upload</span>
            </Link>
            {userId && (
              <Link href={`/profile/${userId}`} className={linkClasses(`/profile/${userId}`)}>
                <User size={20} />
                <span className="hidden sm:inline">My Profile</span>
              </Link>
            )}
            {displayName && (
              <span className="text-gray-700 font-medium ml-2">
                | {displayName}
              </span>
            )}
          </nav>

          {/* Right side for "PicGate" */}
          <div className="text-[#821019] text-2xl font-bold">
            PicGate
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
