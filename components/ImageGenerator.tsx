import React, { useState, useMemo } from 'react';
import { ImageUploader } from './ImageUploader';
import { ImageViewer } from './ImageViewer';
import { TIME_PERIOD_DATA } from '../constants';
import { generateImageWithFlash, fileToBase64 } from '../services/geminiService';
import { UploadedImage, OptionDetail } from '../types';

export const ImageGenerator: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(TIME_PERIOD_DATA[0].period);
  const [selectedOptionKey, setSelectedOptionKey] = useState<string>('random');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentOptions = useMemo(() => {
    return TIME_PERIOD_DATA.find(p => p.period === selectedPeriod)?.options || [];
  }, [selectedPeriod]);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setGeneratedImage(null);
    setError(null);
  };
  
  const generatePrompt = () => {
    let chosenOption: OptionDetail;
    if (selectedOptionKey === 'random') {
      chosenOption = currentOptions[Math.floor(Math.random() * currentOptions.length)];
    } else {
      chosenOption = currentOptions.find(o => o.option === selectedOptionKey) || currentOptions[0];
    }

    if (chosenOption.prompt) {
      return chosenOption.prompt;
    }

    const template = `Transform the uploaded photo of a {gender} into a photorealistic fashion image set in the {period}. The model is styled according to {period}-era garments, textures, and accessories: {garment_details}. The environment should match {period} aesthetics: {environment_details}. Pose the model in a {pose_description} to convey the mood and focus on the garment's key features. Use cinematic lighting: {lighting_description}, and frame the shot with {camera_details}. Make it ultra-realistic, hyper-detailed, fashion photography style, 8K quality.`;
    
    return template
      .replace(/{gender}/g, gender)
      .replace(/{period}/g, selectedPeriod)
      .replace(/{garment_details}/g, chosenOption.garment_details || "")
      .replace(/{environment_details}/g, chosenOption.environment_details || "")
      .replace(/{pose_description}/g, chosenOption.pose_description || "")
      .replace(/{lighting_description}/g, chosenOption.lighting_description || "")
      .replace(/{camera_details}/g, chosenOption.camera_details || "");
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const prompt = generatePrompt();
      console.log("Generated Prompt:", prompt);
      const result = await generateImageWithFlash(uploadedImage, prompt);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h2 className="text-xl font-bold text-indigo-400">1. Upload Your Photo</h2>
        <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
        
        <h2 className="text-xl font-bold text-indigo-400 pt-4">2. Customize Your Scene</h2>
        
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Time Period</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
            {TIME_PERIOD_DATA.map(p => <option key={p.period} value={p.period}>{p.period}</option>)}
          </select>
        </div>
        
        {/* Option */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Style Option</label>
          <select value={selectedOptionKey} onChange={(e) => setSelectedOptionKey(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="random">Random</option>
            {currentOptions.map(o => <option key={o.option} value={o.option}>{o.option}</option>)}
          </select>
        </div>
        
        <h2 className="text-xl font-bold text-indigo-400 pt-4">3. Generate</h2>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !uploadedImage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Transform Image'
          )}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="md:col-span-2">
        <h2 className="text-xl font-bold text-indigo-400 mb-4">Result</h2>
        <ImageViewer image={generatedImage} isLoading={isLoading} loadingMessage="Conjuring your fashion masterpiece..." />
      </div>
    </div>
  );
};
