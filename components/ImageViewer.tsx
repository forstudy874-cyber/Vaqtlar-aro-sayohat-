import React from 'react';
import { Loader } from './Loader';

interface ImageViewerProps {
  image: string | null;
  isLoading: boolean;
  loadingMessage?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, isLoading, loadingMessage }) => {
  return (
    <div className="relative aspect-square bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-700">
      {isLoading && <Loader message={loadingMessage} />}
      {image ? (
        <img src={image} alt="Generated result" className="max-h-full max-w-full object-contain rounded-lg" />
      ) : (
        <div className="text-center text-gray-500 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="font-semibold text-lg">Your generated image will appear here.</h3>
          <p className="text-sm">Upload an image and select your options to begin.</p>
        </div>
      )}
    </div>
  );
};
