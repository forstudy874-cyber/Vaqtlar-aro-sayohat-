import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { analyzeImageWithFlash, analyzeImageWithProThinking } from '../services/geminiService';
import { UploadedImage } from '../types';
import { Loader } from './Loader';

export const ImageAnalyzer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalysis = async (mode: 'flash' | 'pro') => {
    if (!uploadedImage) {
      setError('Please upload an image to analyze.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = mode === 'flash'
        ? await analyzeImageWithFlash(uploadedImage)
        : await analyzeImageWithProThinking(uploadedImage);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold text-indigo-400 mb-4">1. Upload Image to Analyze</h2>
        <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => handleAnalysis('flash')}
            disabled={isLoading || !uploadedImage}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500"
          >
            Quick Analysis (Flash)
          </button>
          <button
            onClick={() => handleAnalysis('pro')}
            disabled={isLoading || !uploadedImage}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500"
          >
            Deep Analysis (Pro + Thinking)
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>

      <div>
        <h2 className="text-xl font-bold text-indigo-400 mb-4">Analysis Result</h2>
        <div className="relative bg-gray-900/50 rounded-xl p-6 border border-gray-700 min-h-[400px] max-h-[60vh] overflow-y-auto prose prose-invert prose-sm">
          {isLoading && <Loader message="Analyzing details..." />}
          {analysis ? (
             <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-gray-500">Your image analysis will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};
