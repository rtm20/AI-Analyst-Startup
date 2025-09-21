'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAnalysisStore, useDocumentStore } from '@/store';
import { documentProcessor } from '@/lib/document-processor-client';
import toast from 'react-hot-toast';

interface UploadSectionProps {
  onAnalysisComplete: () => void;
}

export function UploadSection({ onAnalysisComplete }: UploadSectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  
  const { setLoading, setProcessingStage: setGlobalStage, addAnalysis } = useAnalysisStore();
  const { addToUploadQueue } = useDocumentStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const validFiles = acceptedFiles.filter(file => {
      const isValidType = allowedTypes.includes(file.type) || 
        file.name.toLowerCase().endsWith('.pdf') ||
        file.name.toLowerCase().endsWith('.pptx') ||
        file.name.toLowerCase().endsWith('.docx') ||
        file.name.toLowerCase().endsWith('.txt');
      
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        toast.error(`${file.name}: Unsupported file type. Please upload PDF, PPTX, DOCX, or TXT files.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name}: File too large. Maximum size is 50MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      addToUploadQueue(validFiles);
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  }, [addToUploadQueue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    setIsProcessing(true);
    setLoading(true);
    
    try {
      // Stage 1: Process documents locally
      setProcessingStage('Processing documents...');
      setGlobalStage('uploading');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Process the first file for demo
      const mainFile = uploadedFiles[0];
      const processedDoc = await documentProcessor.processFile(mainFile);

      // Stage 2: Extract data with AI simulation
      setProcessingStage('Extracting startup data...');
      setGlobalStage('extracting');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Extract information from processed text with error handling
      let companyInfo, teamInfo, financialMetrics;
      
      try {
        companyInfo = documentProcessor.extractCompanyInfo(processedDoc.text || '');
      } catch (error) {
        console.warn('Error extracting company info:', error);
        companyInfo = { name: 'Unknown Company', industry: 'Unknown' };
      }

      try {
        teamInfo = documentProcessor.extractTeamInfo(processedDoc.text || '');
      } catch (error) {
        console.warn('Error extracting team info:', error);
        teamInfo = { founders: [], totalEmployees: 0 };
      }

      try {
        financialMetrics = documentProcessor.extractFinancialMetrics(processedDoc.text || '');
      } catch (error) {
        console.warn('Error extracting financial metrics:', error);
        financialMetrics = { revenue: 0, growth: 0 };
      }

      // Stage 3: Analyze with AI simulation
      setProcessingStage('Analyzing with AI...');
      setGlobalStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Stage 4: Generate insights
      setProcessingStage('Generating investment insights...');
      setGlobalStage('generating');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock analysis result
      const mockAnalysis = {
        id: `analysis-${Date.now()}`,
        companyName: 'TechCorp AI Solutions',
        industry: 'Artificial Intelligence',
        stage: 'seed' as const,
        documents: uploadedFiles.map((file, index) => ({
          id: `doc-${index}`,
          name: file.name,
          type: 'pitch-deck' as const,
          url: `https://storage.googleapis.com/bucket/${file.name}`,
          uploadedAt: new Date(),
          processed: true,
          extractedText: 'Sample extracted text...',
          pageCount: 15,
          size: file.size,
        })),
        extractedData: {
          companyInfo: {
            name: 'TechCorp AI Solutions',
            tagline: 'Revolutionizing enterprise AI workflows',
            description: 'AI-powered automation platform for enterprise customers',
            website: 'https://techcorp.ai',
            location: 'San Francisco, CA',
            founded: '2023',
            industry: 'Artificial Intelligence',
            businessModel: 'B2B SaaS',
          },
          financials: {
            currentRevenue: 2400000,
            revenueGrowthRate: 300,
            grossMargin: 85,
            burnRate: 150000,
            runway: 18,
            cashRaised: 5000000,
            valuation: 25000000,
            employees: 25,
            customersCount: 150,
            arr: 2880000,
            mrr: 240000,
          },
          team: {
            founders: [
              {
                name: 'Sarah Chen',
                role: 'CEO & Co-founder',
                background: 'Former VP of Engineering at Google',
                previousCompanies: ['Google', 'DeepMind'],
                education: 'PhD Computer Science, Stanford',
                yearsExperience: 12,
              },
              {
                name: 'Michael Rodriguez',
                role: 'CTO & Co-founder',
                background: 'Ex-Principal Engineer at OpenAI',
                previousCompanies: ['OpenAI', 'Tesla'],
                education: 'MS AI, MIT',
                yearsExperience: 10,
              }
            ],
            totalEmployees: 25,
            keyHires: [
              { name: 'Jennifer Wu', role: 'VP Sales', background: 'Former Enterprise Sales at Salesforce' }
            ],
            advisors: [
              { name: 'Dr. Andrew Ng', background: 'AI Pioneer, Stanford Professor' }
            ]
          },
          market: {
            tam: 150000000000,
            sam: 25000000000,
            som: 2500000000,
            marketGrowthRate: 25,
            competitors: ['UiPath', 'Automation Anywhere', 'Blue Prism'],
            marketPosition: 'AI-first approach with superior accuracy',
          },
          product: {
            description: 'No-code AI workflow automation platform',
            stage: 'launched' as const,
            differentiators: ['Advanced NLP', 'Enterprise-grade security', 'Easy integration'],
            technology: ['Python', 'TensorFlow', 'React', 'Kubernetes'],
          },
          traction: {
            users: 2500,
            customers: 150,
            revenue: 2400000,
            partnerships: ['Microsoft', 'AWS', 'Salesforce'],
            milestones: [
              { description: 'Closed Series A', date: '2024-01', achieved: true },
              { description: 'Launch enterprise platform', date: '2024-03', achieved: true },
              { description: 'Reach $5M ARR', date: '2024-12', achieved: false },
            ]
          }
        },
        metrics: {
          revenueMultiple: 8.7,
          growthRate: 300,
          burnMultiple: 1.5,
          grossMarginPercent: 85,
          ltvratio: 4.2,
          monthsOfRunway: 18,
          capitalEfficiency: 82,
          unitEconomics: {
            cac: 2500,
            ltv: 10500,
            paybackPeriod: 8,
            churnRate: 3.5,
          }
        },
        riskFlags: [
          {
            id: 'risk-1',
            type: 'market' as const,
            severity: 'medium' as const,
            title: 'Competitive Market',
            description: 'Operating in highly competitive RPA/automation space',
            evidence: ['Multiple established players', 'High customer acquisition costs'],
            confidence: 75,
            impact: 'May face pricing pressure and customer acquisition challenges',
            recommendation: 'Differentiate through AI capabilities and superior user experience'
          },
          {
            id: 'risk-2',
            type: 'financial' as const,
            severity: 'low' as const,
            title: 'High Burn Rate',
            description: 'Monthly burn rate is 6.25% of current cash',
            evidence: ['$150K monthly burn', '$2.4M cash remaining'],
            confidence: 90,
            impact: 'Need to raise additional funding within 12-18 months',
            recommendation: 'Focus on path to profitability and extend runway'
          }
        ],
        benchmarks: [
          {
            metric: 'Revenue Growth Rate',
            companyValue: 300,
            industryMedian: 150,
            industryP75: 250,
            industryP90: 400,
            percentile: 85,
            comparison: 'above' as const,
          },
          {
            metric: 'Gross Margin',
            companyValue: 85,
            industryMedian: 75,
            industryP75: 82,
            industryP90: 88,
            percentile: 78,
            comparison: 'above' as const,
          }
        ],
        recommendation: {
          decision: 'buy' as const,
          score: 78,
          reasoning: [
            'Strong founding team with relevant experience',
            'High-growth market with clear demand',
            'Solid financial metrics and unit economics',
            'Differentiated AI-first approach'
          ],
          keyStrengths: [
            'Experienced founders from top-tier companies',
            'Strong revenue growth (300% YoY)',
            'Healthy gross margins (85%)',
            'Good customer retention and LTV/CAC ratio'
          ],
          keyWeaknesses: [
            'Competitive market with established players',
            'Relatively high burn rate',
            'Early stage with execution risk'
          ],
          investmentThesis: 'TechCorp represents a compelling investment opportunity in the rapidly growing AI automation space. The founding team\'s experience at Google and OpenAI, combined with strong early traction and solid unit economics, positions them well to capture market share.',
          suggestedValuation: 28000000,
          suggestedCheck: 2000000,
          nextSteps: [
            'Conduct technical due diligence',
            'Reference calls with customers',
            'Review detailed financial model',
            'Assess competitive positioning'
          ]
        },
        confidence: 82,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'completed' as const,
      };

      // Add to store
      addAnalysis(mockAnalysis);
      
      setGlobalStage('completed');
      toast.success('Analysis completed successfully!');
      onAnalysisComplete();
      
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Analysis failed: ${errorMessage}`);
      setGlobalStage('error');
    } finally {
      setIsProcessing(false);
      setLoading(false);
      setProcessingStage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Area */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Upload Startup Documents</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload pitch decks, financial models, or other startup documents for AI analysis
          </p>
        </div>
        
        <div className="card-body">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, PPTX, DOCX, TXT • Max 50MB per file
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
          </div>
          
          <div className="card-body">
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="card">
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Processing...</p>
                <p className="text-sm text-gray-600">{processingStage}</p>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${
                    processingStage.includes('Uploading') ? '25%' :
                    processingStage.includes('Extracting') ? '50%' :
                    processingStage.includes('Analyzing') ? '75%' :
                    processingStage.includes('Generating') ? '90%' : '100%'
                  }` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={startAnalysis}
          disabled={uploadedFiles.length === 0 || isProcessing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Start AI Analysis'}
        </button>
        
        {uploadedFiles.length > 0 && !isProcessing && (
          <button
            onClick={() => setUploadedFiles([])}
            className="btn-secondary"
          >
            Clear Files
          </button>
        )}
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Document Processing</h3>
          <p className="text-sm text-gray-600">
            Extract text and data from pitch decks using Google Cloud Vision API
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
          <p className="text-sm text-gray-600">
            Analyze startup metrics and generate insights using Gemini Pro
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Risk Detection</h3>
          <p className="text-sm text-gray-600">
            Identify potential red flags and investment risks automatically
          </p>
        </div>
      </div>
    </div>
  );
}
