// Core domain types for the AI Startup Analyst platform

export interface StartupAnalysis {
  id: string;
  companyName: string;
  industry: string;
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c+';
  documents: Document[];
  extractedData: ExtractedData;
  metrics: FinancialMetrics;
  riskFlags: RiskFlag[];
  benchmarks: Benchmark[];
  recommendation: Recommendation;
  confidence: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  status: 'processing' | 'completed' | 'failed';
}

export interface Document {
  id: string;
  name: string;
  type: 'pitch-deck' | 'financial-model' | 'transcript' | 'email' | 'other';
  url: string;
  uploadedAt: Date;
  processed: boolean;
  extractedText?: string;
  pageCount?: number;
  size: number; // bytes
}

export interface ExtractedData {
  companyInfo: CompanyInfo;
  financials: ExtractedFinancials;
  team: TeamInfo;
  market: MarketInfo;
  product: ProductInfo;
  traction: TractionInfo;
}

export interface CompanyInfo {
  name: string;
  tagline?: string;
  description?: string;
  website?: string;
  location?: string;
  founded?: string;
  industry?: string;
  businessModel?: string;
}

export interface ExtractedFinancials {
  currentRevenue?: number;
  revenueGrowthRate?: number;
  grossMargin?: number;
  burnRate?: number;
  runway?: number; // months
  cashRaised?: number;
  valuation?: number;
  employees?: number;
  customersCount?: number;
  arr?: number; // Annual Recurring Revenue
  mrr?: number; // Monthly Recurring Revenue
}

export interface TeamInfo {
  founders: Founder[];
  totalEmployees?: number;
  keyHires?: KeyHire[];
  advisors?: Advisor[];
}

export interface Founder {
  name: string;
  role: string;
  background?: string;
  previousCompanies?: string[];
  education?: string;
  yearsExperience?: number;
}

export interface KeyHire {
  name: string;
  role: string;
  background?: string;
}

export interface Advisor {
  name: string;
  background?: string;
}

export interface MarketInfo {
  tam?: number; // Total Addressable Market
  sam?: number; // Serviceable Addressable Market
  som?: number; // Serviceable Obtainable Market
  marketGrowthRate?: number;
  competitors?: string[];
  marketPosition?: string;
}

export interface ProductInfo {
  description?: string;
  stage: 'idea' | 'mvp' | 'beta' | 'launched' | 'scaling';
  differentiators?: string[];
  technology?: string[];
}

export interface TractionInfo {
  users?: number;
  customers?: number;
  revenue?: number;
  partnerships?: string[];
  milestones?: Milestone[];
}

export interface Milestone {
  description: string;
  date?: string;
  achieved: boolean;
}

export interface FinancialMetrics {
  revenueMultiple?: number;
  growthRate: number;
  burnMultiple?: number;
  grossMarginPercent?: number;
  ltvratio?: number; // LTV/CAC ratio
  monthsOfRunway?: number;
  capitalEfficiency: number; // 0-100 score
  unitEconomics: UnitEconomics;
}

export interface UnitEconomics {
  cac?: number; // Customer Acquisition Cost
  ltv?: number; // Lifetime Value
  paybackPeriod?: number; // months
  churnRate?: number; // monthly %
}

export interface RiskFlag {
  id: string;
  type: 'financial' | 'market' | 'team' | 'operational' | 'competitive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  evidence: string[];
  confidence: number; // 0-100
  impact: string;
  recommendation?: string;
}

export interface Benchmark {
  metric: string;
  companyValue: number;
  industryMedian: number;
  industryP75: number;
  industryP90: number;
  percentile: number;
  comparison: 'above' | 'below' | 'at' | 'unknown';
}

export interface Recommendation {
  decision: 'strong-buy' | 'buy' | 'hold' | 'pass' | 'strong-pass';
  score: number; // 0-100
  reasoning: string[];
  keyStrengths: string[];
  keyWeaknesses: string[];
  investmentThesis: string;
  suggestedValuation?: number;
  suggestedCheck?: number;
  nextSteps: string[];
}

export interface AnalysisConfig {
  industry?: string;
  stage?: string;
  checkSize?: number;
  investorType: 'vc' | 'angel' | 'corporate' | 'accelerator';
  riskTolerance: 'low' | 'medium' | 'high';
  customWeights?: {
    team: number;
    market: number;
    product: number;
    traction: number;
    financials: number;
  };
}

// API Response types
export interface AnalysisResponse {
  success: boolean;
  data?: StartupAnalysis;
  error?: string;
  processingTime?: number;
}

export interface UploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

// UI State types
export interface AnalysisStore {
  currentAnalysis: StartupAnalysis | null;
  analyses: StartupAnalysis[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  processingStage: ProcessingStage;
}

export type ProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'generating'
  | 'completed'
  | 'error';

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  users?: number;
  burn?: number;
}

// Industry benchmarks
export interface IndustryBenchmarks {
  industry: string;
  stage: string;
  metrics: {
    [key: string]: {
      median: number;
      p25: number;
      p75: number;
      p90: number;
    };
  };
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Google Cloud types
export interface CloudStorageFile {
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  size: string;
  md5Hash: string;
  crc32c: string;
  etag: string;
  timeCreated: string;
  updated: string;
}

export interface VisionApiResponse {
  textAnnotations: Array<{
    description: string;
    boundingPoly: any;
  }>;
  fullTextAnnotation: {
    text: string;
    pages: any[];
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: any[];
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}
