import React, { useState } from 'react';
import { CVForm } from './components/CVForm';
import { CVPreview } from './components/CVPreview';
import { CVData, INITIAL_CV_DATA } from './types';
import { polishCVWithGemini } from './services/gemini';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePolish = async () => {
    // Basic validation
    if (!cvData.fullName && !cvData.experience.length) {
      setError("Please enter at least a name or some experience before generating.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const polishedData = await polishCVWithGemini(cvData);
      setCvData(polishedData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate CV. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-indigo-700 text-white p-4 flex items-center gap-2 shadow-md z-10">
        <FileText size={24} />
        <h1 className="font-bold text-lg tracking-tight">CV Forge AI</h1>
      </header>

      {/* Left Panel: Editor */}
      <div className="w-full md:w-1/2 lg:w-5/12 h-screen flex flex-col border-r border-gray-200 bg-white z-0">
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
             <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CV Forge AI</h1>
            <p className="text-xs text-gray-500">Professional Resume Builder</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-fade-in">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <CVForm 
            data={cvData} 
            onChange={setCvData} 
            onGenerate={handlePolish} 
            isGenerating={isGenerating} 
          />
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full md:w-1/2 lg:w-7/12 h-screen overflow-y-auto bg-gray-100/50 p-4 md:p-8 lg:p-12 relative flex justify-center">
        <div className="w-full max-w-[210mm]">
           {/* We pass setCvData as onChange to allow direct editing */}
           <CVPreview data={cvData} onChange={setCvData} />
           
           {/* Floating Info for Large Screens */}
           <div className="hidden xl:flex fixed bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-xs animate-slide-up">
              <div className="flex gap-3">
                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white h-fit">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 text-sm">Powered by Gemini</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      You can edit text directly on the resume preview!
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default App;