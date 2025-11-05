import React, { useRef } from 'react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
  uploadedImage: UploadedImage | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, uploadedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onImageUpload({ base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors duration-300 bg-gray-900/50 flex flex-col justify-center items-center aspect-square"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {uploadedImage ? (
        <img
          src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`}
          alt="Uploaded preview"
          className="max-h-full max-w-full object-contain rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="font-semibold">Click to upload an image</p>
          <p className="text-xs">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};
