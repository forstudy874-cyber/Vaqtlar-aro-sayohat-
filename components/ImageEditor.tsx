import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ImageViewer } from './ImageViewer';
import { generateImageWithFlash } from '../services/geminiService';
import { UploadedImage } from '../types';

export const ImageEditor: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setEditedImage(`data:${image.mimeType};base64,${image.base64}`);
    setError(null);
  };

  const handleEdit = async () => {
    if (!uploadedImage || !prompt) {
      setError('Please upload an image and enter an edit prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const result = await generateImageWithFlash(uploadedImage, prompt);
      setEditedImage(result);
      setUploadedImage({
        base64: result.split(',')[1],
        mimeType: result.substring(result.indexOf(':') + 1, result.indexOf(';')),
      });
    } catch (err) {
      console.error(err);
      setError('Failed to edit image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Add a retro, vintage filter",
    "Make the background blurry",
    "Change the background to a futuristic city",
    "Turn it into a black and white photo",
    "Add a dramatic, cinematic lighting effect",
    "Remove the person in the background"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold text-indigo-400 mb-4">1. Upload Image to Edit</h2>
        <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-indigo-400 mb-4">2. Describe Your Edit</h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a magical glow around the person"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 h-24 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div>
            <p className="text-sm text-gray-400 mb-2">Or try a quick prompt:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(p => (
                <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-200 px-3 py-1 rounded-full transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleEdit}
            disabled={isLoading || !uploadedImage || !prompt}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Editing...' : 'Apply Edit'}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        <h2 className="text-xl font-bold text-indigo-400 mt-6 mb-4">Result</h2>
        <ImageViewer image={editedImage} isLoading={isLoading} loadingMessage="Applying your creative edit..." />
      </div>
    </div>
  );
};
