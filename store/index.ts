// Global state management using Zustand
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { StartupAnalysis, Document, ProcessingStage, AnalysisConfig } from '@/types';

interface AnalysisStore {
  // Current analysis state
  currentAnalysis: StartupAnalysis | null;
  analyses: StartupAnalysis[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  processingStage: ProcessingStage;
  
  // Configuration
  analysisConfig: AnalysisConfig;
  
  // Actions
  setCurrentAnalysis: (analysis: StartupAnalysis | null) => void;
  addAnalysis: (analysis: StartupAnalysis) => void;
  updateAnalysis: (id: string, updates: Partial<StartupAnalysis>) => void;
  deleteAnalysis: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUploadProgress: (progress: number) => void;
  setProcessingStage: (stage: ProcessingStage) => void;
  
  updateConfig: (config: Partial<AnalysisConfig>) => void;
  
  // Utilities
  clearAll: () => void;
  getAnalysisById: (id: string) => StartupAnalysis | undefined;
}

export const useAnalysisStore = create<AnalysisStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentAnalysis: null,
        analyses: [],
        
        isLoading: false,
        error: null,
        uploadProgress: 0,
        processingStage: 'idle',
        
        analysisConfig: {
          investorType: 'vc',
          riskTolerance: 'medium',
          customWeights: {
            team: 25,
            market: 25,
            product: 20,
            traction: 20,
            financials: 10,
          },
        },
        
        // Actions
        setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
        
        addAnalysis: (analysis) => set((state) => ({
          analyses: [analysis, ...state.analyses],
          currentAnalysis: analysis,
        })),
        
        updateAnalysis: (id, updates) => set((state) => ({
          analyses: state.analyses.map(analysis =>
            analysis.id === id ? { ...analysis, ...updates } : analysis
          ),
          currentAnalysis: state.currentAnalysis?.id === id
            ? { ...state.currentAnalysis, ...updates }
            : state.currentAnalysis,
        })),
        
        deleteAnalysis: (id) => set((state) => ({
          analyses: state.analyses.filter(analysis => analysis.id !== id),
          currentAnalysis: state.currentAnalysis?.id === id ? null : state.currentAnalysis,
        })),
        
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setUploadProgress: (progress) => set({ uploadProgress: progress }),
        setProcessingStage: (stage) => set({ processingStage: stage }),
        
        updateConfig: (config) => set((state) => ({
          analysisConfig: { ...state.analysisConfig, ...config },
        })),
        
        clearAll: () => set({
          currentAnalysis: null,
          analyses: [],
          isLoading: false,
          error: null,
          uploadProgress: 0,
          processingStage: 'idle',
        }),
        
        getAnalysisById: (id) => get().analyses.find(analysis => analysis.id === id),
      }),
      {
        name: 'analysis-store',
        partialize: (state) => ({
          analyses: state.analyses,
          analysisConfig: state.analysisConfig,
        }),
      }
    ),
    {
      name: 'analysis-store',
    }
  )
);

// Document upload store
interface DocumentStore {
  documents: Document[];
  uploadQueue: File[];
  
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  
  addToUploadQueue: (files: File[]) => void;
  removeFromUploadQueue: (index: number) => void;
  clearUploadQueue: () => void;
  
  clearAll: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  devtools(
    (set) => ({
      documents: [],
      uploadQueue: [],
      
      addDocument: (document) => set((state) => ({
        documents: [...state.documents, document],
      })),
      
      removeDocument: (id) => set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id),
      })),
      
      updateDocument: (id, updates) => set((state) => ({
        documents: state.documents.map(doc =>
          doc.id === id ? { ...doc, ...updates } : doc
        ),
      })),
      
      addToUploadQueue: (files) => set((state) => ({
        uploadQueue: [...state.uploadQueue, ...files],
      })),
      
      removeFromUploadQueue: (index) => set((state) => ({
        uploadQueue: state.uploadQueue.filter((_, i) => i !== index),
      })),
      
      clearUploadQueue: () => set({ uploadQueue: [] }),
      
      clearAll: () => set({
        documents: [],
        uploadQueue: [],
      }),
    }),
    {
      name: 'document-store',
    }
  )
);

// UI state store
interface UIStore {
  sidebarOpen: boolean;
  activeTab: string;
  theme: 'light' | 'dark';
  notifications: Notification[];
  
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        activeTab: 'overview',
        theme: 'light',
        notifications: [],
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setTheme: (theme) => set({ theme }),
        
        addNotification: (notification) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substring(2),
            },
          ],
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),
        
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

// Computed selectors
export const useAnalysisSelectors = () => {
  const store = useAnalysisStore();
  
  return {
    // Get recent analyses
    recentAnalyses: store.analyses.slice(0, 5),
    
    // Get analyses by status
    completedAnalyses: store.analyses.filter(a => a.status === 'completed'),
    processingAnalyses: store.analyses.filter(a => a.status === 'processing'),
    
    // Get high-risk analyses
    highRiskAnalyses: store.analyses.filter(a => 
      a.riskFlags.some(flag => flag.severity === 'high' || flag.severity === 'critical')
    ),
    
    // Get top recommendations
    topRecommendations: store.analyses
      .filter(a => a.recommendation.decision === 'strong-buy' || a.recommendation.decision === 'buy')
      .sort((a, b) => b.recommendation.score - a.recommendation.score),
    
    // Get processing progress
    isProcessing: store.processingStage !== 'idle' && store.processingStage !== 'completed',
    
    // Get current processing step
    processingProgress: {
      idle: 0,
      uploading: 20,
      extracting: 40,
      analyzing: 60,
      generating: 80,
      completed: 100,
      error: 0,
    }[store.processingStage],
  };
};
