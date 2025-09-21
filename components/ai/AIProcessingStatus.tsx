'use client';

import { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  WrenchScrewdriverIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { smartDocumentProcessor } from '@/lib/smart-document-processor';

export function AIProcessingStatus() {
  const [mode, setMode] = useState<{
    mode: 'real' | 'mock';
    description: string;
    services: string[];
  } | null>(null);

  const [healthStatus, setHealthStatus] = useState<any>(null);

  useEffect(() => {
    // Get processing mode
    const processingMode = smartDocumentProcessor.getProcessingMode();
    setMode(processingMode);

    // Check health status if in real mode
    if (processingMode.mode === 'real') {
      checkHealthStatus();
    }
  }, []);

  const checkHealthStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const health = await response.json();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ status: 'unhealthy', error: 'Health check failed' });
    }
  };

  if (!mode) return null;

  const isRealMode = mode.mode === 'real';
  const isHealthy = healthStatus?.status === 'healthy';

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isRealMode ? (
            <CloudIcon className="h-6 w-6 text-blue-600" />
          ) : (
            <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              AI Processing Mode: {isRealMode ? 'Google Cloud AI' : 'Demo Mode'}
            </h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isRealMode && healthStatus && (
            <>
              {isHealthy ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                isHealthy ? 'text-green-700' : 'text-red-700'
              }`}>
                {healthStatus.status}
              </span>
            </>
          )}
          
          {!isRealMode && (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
              Demo
            </span>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="mt-3">
        <div className="text-xs text-gray-500">Active Services:</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {mode.services.map((service, index) => (
            <span
              key={index}
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                isRealMode 
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                  : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
              }`}
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Health Details for Real Mode */}
      {isRealMode && healthStatus && healthStatus.services && (
        <div className="mt-3 border-t pt-3">
          <div className="text-xs text-gray-500 mb-2">Service Health:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`flex items-center space-x-1 ${
              healthStatus.services.cloudStorage?.status === 'operational' ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                healthStatus.services.cloudStorage?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span>Storage</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              healthStatus.services.visionAPI?.status === 'operational' ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                healthStatus.services.visionAPI?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span>Vision API</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              healthStatus.services.vertexAI?.status === 'operational' ? 'text-green-600' : 'text-red-600'
            }`}>
              <div className={`h-2 w-2 rounded-full ${
                healthStatus.services.vertexAI?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span>Gemini AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Setup Guide Link for Real Mode */}
      {isRealMode && (!healthStatus || !isHealthy) && (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs text-gray-600">
            Need to set up Google Cloud services? 
            <a 
              href="/GOOGLE_CLOUD_SETUP.md" 
              target="_blank"
              className="ml-1 text-blue-600 hover:text-blue-800 underline"
            >
              View setup guide
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
