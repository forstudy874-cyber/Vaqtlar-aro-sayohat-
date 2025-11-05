import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Generating your masterpiece..." }) => {
  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-xl">
      <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-200">{message}</p>
      <p className="text-sm text-gray-400">This may take a moment.</p>
    </div>
  );
};
