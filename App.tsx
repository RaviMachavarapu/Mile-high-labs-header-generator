
import React, { useState, useCallback } from 'react';
import { generateHeaderImage } from './services/geminiService';
import { HEADER_PROMPT } from './constants';

// --- Helper Components (Defined outside App to prevent re-creation on re-renders) ---

const IconRocket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center text-[#0a2463]">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-[#1e3a8a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-lg">Generating your masterpiece...</p>
    <p className="text-sm">This can take up to 30 seconds.</p>
  </div>
);

const ImagePlaceholder = () => (
  <div className="flex flex-col items-center justify-center text-[#1e3a8a]/80 border-2 border-dashed border-[#1e3a8a]/40 rounded-lg h-full w-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-lg font-semibold">Your Generated Header Will Appear Here</p>
    <p className="text-sm">Click the button below to start the magic!</p>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-red-500 bg-red-50 border-2 border-dashed border-red-200 rounded-lg h-full w-full p-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-bold">Oops! Something went wrong.</p>
        <p className="text-sm text-center mt-2">{message}</p>
    </div>
);

// --- Main Application Component ---

const App: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateHeaderImage(HEADER_PROMPT);
      setImageUrl(url);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1e3a8a] tracking-tight">
            Mile High AI Labs Header Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Generate a whimsical, hand-drawn header for the "Mile High AI Labs" blog using the power of Gemini.
          </p>
        </header>

        <main className="flex flex-col items-center">
          <div className="w-full aspect-video bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Generated AI header for Mile High AI Labs" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-4 bg-[#1e3a8a] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#0a2463] focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/50 transform transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              <IconRocket />
              {isLoading ? 'Generating...' : 'Generate Header'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
