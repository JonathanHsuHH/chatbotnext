import { BiAperture } from "react-icons/bi";
import Link from 'next/link';
import React from 'react';

type NavigationHeaderProps = {};

const NavigationHeader: React.FC<NavigationHeaderProps> = () => {
  return (
    <header className="bg-gray-800 fixed top-0 w-full z-10">
      <nav className="container flex items-center justify-between">    
        <div className="flex items-center">
            <button className="text-gray-300 p-1 rounded-md cursor-default">
                <BiAperture className="h-6 w-6" />
            </button>
            <Link href="/" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Conversations
            </Link>
            <Link href="/about" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Language service
            </Link>
            <Link href="/contact" className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Content digest
            </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavigationHeader;