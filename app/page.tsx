'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UploadSection } from '@/components/upload/UploadSection';
import { AnalysisResults } from '@/components/analysis/AnalysisResults';
import { AIProcessingStatus } from '@/components/ai/AIProcessingStatus';
import { useAnalysisStore, useAnalysisSelectors } from '@/store';

export default function HomePage() {
  const [showResults, setShowResults] = useState(false);
  const { currentAnalysis } = useAnalysisStore();
  const { isProcessing } = useAnalysisSelectors();

  const handleAnalysisComplete = () => {
    setShowResults(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
          <h1 className="text-4xl font-bold mb-4">
            AI Startup Analyst
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Powered by Google Cloud AI • Analyze pitch decks • Generate insights • Make informed investments
          </p>
        </div>

        {/* AI Processing Status */}
        <AIProcessingStatus />

        {/* Main Content */}
        {!showResults || !currentAnalysis ? (
          <UploadSection onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          <AnalysisResults 
            analysis={currentAnalysis} 
            onNewAnalysis={() => setShowResults(false)} 
          />
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Analyzing Startup</h3>
                <p className="text-gray-600">
                  Our AI is processing your documents and generating insights...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
