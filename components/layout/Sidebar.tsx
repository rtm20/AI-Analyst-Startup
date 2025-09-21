'use client';

import { useState } from 'react';
import { useAnalysisStore, useAnalysisSelectors } from '@/store';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Upload Documents', href: '#upload', icon: DocumentTextIcon, current: false },
  { name: 'Analysis Results', href: '#analysis', icon: ChartBarIcon, current: false },
  { name: 'Risk Assessment', href: '#risks', icon: ExclamationTriangleIcon, current: false },
  { name: 'Recent Analyses', href: '#recent', icon: ClockIcon, current: false },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { analyses } = useAnalysisStore();
  const { recentAnalyses, highRiskAnalyses, completedAnalyses } = useAnalysisSelectors();

  return (
    <div className="flex flex-col w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.name);
              }}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <Icon 
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                `} 
              />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Stats
        </h3>
        
        <div className="space-y-3">
          {/* Total Analyses */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FolderIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{analyses.length}</span>
          </div>

          {/* Completed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <span className="text-sm font-semibold text-green-600">{completedAnalyses.length}</span>
          </div>

          {/* High Risk */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-gray-600">High Risk</span>
            </div>
            <span className="text-sm font-semibold text-red-600">{highRiskAnalyses.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Recent Analyses
        </h3>
        
        <div className="space-y-2">
          {recentAnalyses.slice(0, 3).map((analysis) => (
            <div 
              key={analysis.id}
              className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {analysis.companyName || 'Unknown Company'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {analysis.industry || 'Unknown Industry'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${analysis.recommendation.decision === 'strong-buy' || analysis.recommendation.decision === 'buy'
                      ? 'bg-green-100 text-green-800'
                      : analysis.recommendation.decision === 'hold'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {analysis.recommendation.score}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {recentAnalyses.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              No analyses yet
            </p>
          )}
        </div>
      </div>

      {/* Google Cloud Status */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Google Cloud AI Active</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <div>Vision API: Ready</div>
          <div>Gemini Pro: Ready</div>
          <div>Cloud Storage: Ready</div>
        </div>
      </div>
    </div>
  );
}
