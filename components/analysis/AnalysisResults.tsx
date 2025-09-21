'use client';

import { useState } from 'react';
import { StartupAnalysis } from '@/types';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface AnalysisResultsProps {
  analysis: StartupAnalysis;
  onNewAnalysis: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AnalysisResults({ analysis, onNewAnalysis }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'financials', name: 'Financials', icon: CurrencyDollarIcon },
    { id: 'team', name: 'Team', icon: UserGroupIcon },
    { id: 'market', name: 'Market', icon: BuildingOfficeIcon },
    { id: 'risks', name: 'Risks', icon: ExclamationTriangleIcon },
    { id: 'recommendation', name: 'Recommendation', icon: TrophyIcon },
  ];

  const getRecommendationColor = (decision: string) => {
    switch (decision) {
      case 'strong-buy': return 'bg-green-500';
      case 'buy': return 'bg-green-400';
      case 'hold': return 'bg-yellow-500';
      case 'pass': return 'bg-red-400';
      case 'strong-pass': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const metricsData = [
    { name: 'Revenue Growth', value: analysis.extractedData.financials.revenueGrowthRate || 0, benchmark: 150 },
    { name: 'Gross Margin', value: analysis.extractedData.financials.grossMargin || 0, benchmark: 75 },
    { name: 'LTV/CAC Ratio', value: analysis.metrics.ltvratio || 0, benchmark: 3 },
    { name: 'Runway (Months)', value: analysis.extractedData.financials.runway || 0, benchmark: 18 },
  ];

  const marketShareData = [
    { name: 'TAM', value: analysis.extractedData.market.tam || 0, fill: COLORS[0] },
    { name: 'SAM', value: analysis.extractedData.market.sam || 0, fill: COLORS[1] },
    { name: 'SOM', value: analysis.extractedData.market.som || 0, fill: COLORS[2] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {analysis.companyName}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {analysis.extractedData.companyInfo.tagline}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {analysis.industry}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {analysis.stage.charAt(0).toUpperCase() + analysis.stage.slice(1)} Stage
                </span>
                <span className="text-sm text-gray-500">
                  Analyzed on {analysis.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-6 py-3 rounded-xl text-white font-bold text-2xl ${getRecommendationColor(analysis.recommendation.decision)}`}>
                {analysis.recommendation.score}/100
              </div>
              <p className="text-sm text-gray-600 mt-2 capitalize">
                {analysis.recommendation.decision.replace('-', ' ')}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${((analysis.extractedData.financials.currentRevenue || 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className="text-xl font-bold text-gray-900 flex items-center">
                    {analysis.extractedData.financials.revenueGrowthRate || 0}%
                    <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="text-xl font-bold text-gray-900">
                    {analysis.extractedData.financials.employees || 0}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Runway</p>
                  <p className="text-xl font-bold text-gray-900">
                    {analysis.extractedData.financials.runway || 0}mo
                  </p>
                </div>
                <BuildingOfficeIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`mr-2 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="card-body">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Investment Thesis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Investment Thesis</h3>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.recommendation.investmentThesis}
                </p>
              </div>

              {/* Key Metrics Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics vs Benchmarks</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" name="Company" />
                      <Bar dataKey="benchmark" fill="#D1D5DB" name="Industry Median" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendation.keyStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    Key Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendation.keyWeaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Financials Tab */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Financial Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Current Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${((analysis.extractedData.financials.currentRevenue || 0) / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm text-gray-600">ARR</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${((analysis.extractedData.financials.arr || 0) / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Burn Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${((analysis.extractedData.financials.burnRate || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Valuation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${((analysis.extractedData.financials.valuation || 0) / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>

              {/* Unit Economics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Unit Economics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">CAC</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${analysis.metrics.unitEconomics.cac?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">LTV</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${analysis.metrics.unitEconomics.ltv?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">LTV/CAC</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analysis.metrics.ltvratio?.toFixed(1) || 'N/A'}x
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">Payback Period</p>
                    <p className="text-xl font-bold text-gray-900">
                      {analysis.metrics.unitEconomics.paybackPeriod || 'N/A'} mo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Founders */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Founding Team</h3>
                <div className="grid gap-4">
                  {analysis.extractedData.team.founders.map((founder, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{founder.name}</h4>
                          <p className="text-blue-600 font-medium">{founder.role}</p>
                          <p className="text-gray-600 mt-1">{founder.background}</p>
                          {founder.education && (
                            <p className="text-sm text-gray-500 mt-1">Education: {founder.education}</p>
                          )}
                          {founder.previousCompanies && founder.previousCompanies.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              Previous: {founder.previousCompanies.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {founder.yearsExperience}+ years
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysis.extractedData.team.totalEmployees || 0}
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Founders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysis.extractedData.team.founders.length}
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm text-gray-600">Key Hires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysis.extractedData.team.keyHires?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Market Tab */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              {/* Market Size */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Opportunity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${(value / 1000000000).toFixed(1)}B`}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${(Number(value) / 1000000000).toFixed(1)}B`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Market Position</h4>
                  <p className="text-gray-700">{analysis.extractedData.market.marketPosition}</p>
                  
                  <h4 className="font-semibold text-gray-900 mt-4 mb-3">Market Growth</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {analysis.extractedData.market.marketGrowthRate}% YoY
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Competitors</h4>
                  <ul className="space-y-2">
                    {analysis.extractedData.market.competitors?.map((competitor, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                        <span className="text-gray-700">{competitor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              
              {analysis.riskFlags.map((risk) => (
                <div key={risk.id} className={`border rounded-lg p-4 ${getSeverityColor(risk.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{risk.title}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-800">
                      {risk.confidence}% confidence
                    </span>
                  </div>
                  <p className="mb-3">{risk.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="font-medium text-sm">Evidence:</p>
                      <ul className="list-disc list-inside text-sm opacity-90">
                        {risk.evidence.map((evidence, index) => (
                          <li key={index}>{evidence}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm">Impact:</p>
                      <p className="text-sm opacity-90">{risk.impact}</p>
                    </div>
                    
                    {risk.recommendation && (
                      <div>
                        <p className="font-medium text-sm">Recommendation:</p>
                        <p className="text-sm opacity-90">{risk.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendation Tab */}
          {activeTab === 'recommendation' && (
            <div className="space-y-6">
              {/* Investment Decision */}
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 ${getRecommendationColor(analysis.recommendation.decision)}`}>
                  {analysis.recommendation.score}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                  {analysis.recommendation.decision.replace('-', ' ')}
                </h3>
                <p className="text-gray-600">Investment Recommendation</p>
              </div>

              {/* Investment Details */}
              {analysis.recommendation.suggestedValuation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">Suggested Valuation</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(analysis.recommendation.suggestedValuation / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm text-gray-600">Suggested Check Size</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(analysis.recommendation.suggestedCheck! / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              )}

              {/* Reasoning */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investment Reasoning</h4>
                <ul className="space-y-2">
                  {analysis.recommendation.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start">
                      <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recommended Next Steps</h4>
                <ul className="space-y-2">
                  {analysis.recommendation.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onNewAnalysis}
          className="btn-primary"
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Analyze Another Startup
        </button>
        
        <button
          onClick={() => window.print()}
          className="btn-secondary"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
