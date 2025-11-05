import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
            Fashion Through Time AI
          </span>
        </h1>
        <p className="text-sm text-gray-400 hidden md:block">Generate & Edit Images with Gemini</p>
      </div>
    </header>
  );
};
