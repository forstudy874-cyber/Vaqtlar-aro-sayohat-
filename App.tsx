import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageEditor } from './components/ImageEditor';
import { ImageAnalyzer } from './components/ImageAnalyzer';

type Tab = 'generator' | 'editor' | 'analyzer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generator');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return <ImageGenerator />;
      case 'editor':
        return <ImageEditor />;
      case 'analyzer':
        return <ImageAnalyzer />;
      default:
        return <ImageGenerator />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tabName
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-gray-800 p-2 rounded-lg shadow-md">
            <TabButton tabName="generator" label="Fashion Through Time" />
            <TabButton tabName="editor" label="Quick Edit" />
            <TabButton tabName="analyzer" label="Image Analyzer" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
          {renderTabContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Created for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;
