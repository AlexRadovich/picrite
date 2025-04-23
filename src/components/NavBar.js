'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload } from 'lucide-react';

const NavBar = () => {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `flex items-center space-x-1 ${
      pathname === path ? 'text-black' : 'text-gray-500 hover:text-gray-800'
    }`;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <nav className="flex space-x-6">
            <Link href="/" className={linkClasses('/')}>
              <Home size={20} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/upload" className={linkClasses('/upload')}>
              <Upload size={20} />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
