import { documentProcessor } from './document-processor-client';
import { realDocumentProcessor } from './real-document-processor';

/**
 * Smart Document Processor
 * Automatically switches between real Google AI and mock processing
 * based on environment configuration
 */
class SmartDocumentProcessor {
  private extractedText: string = '';

  private get useRealAI(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_REAL_AI === 'true' && 
           process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE !== 'true';
  }

  /**
   * Extract text from document
   */
  async extractText(file: File): Promise<string> {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI text extraction');
        this.extractedText = await realDocumentProcessor.extractText(file);
        return this.extractedText;
      } else {
        console.log('🎭 Using MOCK text extraction for development');
        // For mock mode, we simulate text extraction from file content
        const text = await this.readFileAsText(file);
        this.extractedText = text || this.getMockTextForFile(file.name);
        return this.extractedText;
      }
    } catch (error) {
      console.error('❌ Text extraction failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        this.extractedText = this.getMockTextForFile(file.name);
        return this.extractedText;
      }
      
      throw error;
    }
  }

  /**
   * Extract company information
   */
  async extractCompanyInfo() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI company analysis');
        return await realDocumentProcessor.extractCompanyInfo();
      } else {
        console.log('🎭 Using MOCK company analysis');
        return await documentProcessor.extractCompanyInfo(this.extractedText);
      }
    } catch (error) {
      console.error('❌ Company info extraction failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return await documentProcessor.extractCompanyInfo(this.extractedText);
      }
      
      throw error;
    }
  }

  /**
   * Extract financial metrics
   */
  async extractFinancialMetrics() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI financial analysis');
        return await realDocumentProcessor.extractFinancialMetrics();
      } else {
        console.log('🎭 Using MOCK financial analysis');
        return await documentProcessor.extractFinancialMetrics(this.extractedText);
      }
    } catch (error) {
      console.error('❌ Financial metrics extraction failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return await documentProcessor.extractFinancialMetrics(this.extractedText);
      }
      
      throw error;
    }
  }

  /**
   * Extract team information
   */
  async extractTeamInfo() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI team analysis');
        return await realDocumentProcessor.extractTeamInfo();
      } else {
        console.log('🎭 Using MOCK team analysis');
        return await documentProcessor.extractTeamInfo(this.extractedText);
      }
    } catch (error) {
      console.error('❌ Team info extraction failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return await documentProcessor.extractTeamInfo(this.extractedText);
      }
      
      throw error;
    }
  }

  /**
   * Extract market information
   */
  async extractMarketInfo() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI market analysis');
        return await realDocumentProcessor.extractMarketInfo();
      } else {
        console.log('🎭 Using MOCK market analysis');
        // Mock market info for demo
        return {
          tam: 150000000000,
          sam: 25000000000,
          som: 2500000000,
          marketGrowthRate: 25,
          competitors: ['UiPath', 'Automation Anywhere', 'Blue Prism'],
          marketPosition: 'AI-first approach with superior accuracy',
        };
      }
    } catch (error) {
      console.error('❌ Market info extraction failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return {
          tam: 150000000000,
          sam: 25000000000,
          som: 2500000000,
          marketGrowthRate: 25,
          competitors: ['UiPath', 'Automation Anywhere', 'Blue Prism'],
          marketPosition: 'AI-first approach with superior accuracy',
        };
      }
      
      throw error;
    }
  }

  /**
   * Analyze risks
   */
  async analyzeRisks() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI risk analysis');
        return await realDocumentProcessor.analyzeRisks();
      } else {
        console.log('🎭 Using MOCK risk analysis');
        // Mock risk analysis for demo
        return [
          {
            id: 'risk-1',
            type: 'market',
            severity: 'medium',
            title: 'Competitive Market',
            description: 'Operating in highly competitive RPA/automation space',
            evidence: ['Multiple established players', 'High customer acquisition costs'],
            confidence: 75,
            impact: 'May face pricing pressure and customer acquisition challenges',
            recommendation: 'Differentiate through AI capabilities and superior user experience'
          },
          {
            id: 'risk-2',
            type: 'financial',
            severity: 'low',
            title: 'Manageable Burn Rate',
            description: 'Monthly burn rate is reasonable for growth stage',
            evidence: ['$150K monthly burn', '18 months runway'],
            confidence: 90,
            impact: 'Need to raise additional funding within 12-18 months',
            recommendation: 'Focus on path to profitability and extend runway'
          }
        ];
      }
    } catch (error) {
      console.error('❌ Risk analysis failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return [
          {
            id: 'risk-fallback',
            type: 'technical',
            severity: 'low',
            title: 'Analysis Fallback',
            description: 'Real AI analysis failed, using fallback data',
            evidence: ['Service unavailable'],
            confidence: 50,
            impact: 'Limited analysis available',
            recommendation: 'Retry with proper Google Cloud setup'
          }
        ];
      }
      
      throw error;
    }
  }

  /**
   * Generate investment recommendation
   */
  async generateRecommendation() {
    try {
      if (this.useRealAI) {
        console.log('🤖 Using REAL Google AI recommendation generation');
        return await realDocumentProcessor.generateRecommendation();
      } else {
        console.log('🎭 Using MOCK recommendation generation');
        // Mock recommendation for demo
        return {
          decision: 'buy',
          score: 78,
          reasoning: [
            'Strong founding team with relevant experience at top-tier companies',
            'High-growth market with clear customer demand and validation',
            'Solid financial metrics and healthy unit economics',
            'Differentiated AI-first approach in competitive market'
          ],
          keyStrengths: [
            'Experienced founders from Google and OpenAI with deep AI expertise',
            'Strong revenue growth (300% YoY) with expanding customer base',
            'Healthy gross margins (85%) indicating scalable business model',
            'Good customer retention and favorable LTV/CAC ratio'
          ],
          keyWeaknesses: [
            'Competitive market with established enterprise players',
            'Relatively high burn rate requiring future fundraising',
            'Early stage with execution risk and scaling challenges'
          ],
          investmentThesis: 'TechCorp represents a compelling investment opportunity in the rapidly growing AI automation space. The founding team\'s experience at Google and OpenAI, combined with strong early traction and solid unit economics, positions them well to capture significant market share.',
          suggestedValuation: 28000000,
          suggestedCheck: 2000000,
          nextSteps: [
            'Conduct technical due diligence on AI/ML capabilities',
            'Reference calls with existing enterprise customers',
            'Review detailed financial model and projections',
            'Assess competitive positioning and differentiation'
          ]
        };
      }
    } catch (error) {
      console.error('❌ Recommendation generation failed:', error);
      
      // Fallback to mock if real AI fails
      if (this.useRealAI) {
        console.log('🔄 Falling back to mock processing...');
        return {
          decision: 'hold',
          score: 50,
          reasoning: ['Real AI analysis failed, using fallback recommendation'],
          keyStrengths: ['Unable to determine'],
          keyWeaknesses: ['Analysis incomplete'],
          investmentThesis: 'Unable to generate recommendation due to service unavailability',
          suggestedValuation: 0,
          suggestedCheck: 0,
          nextSteps: ['Set up Google Cloud services', 'Retry analysis']
        };
      }
      
      throw error;
    }
  }

  /**
   * Get extracted text (for debugging)
   */
  getExtractedText(): string {
    return this.extractedText;
  }

  /**
   * Clear extracted text
   */
  clearExtractedText(): void {
    this.extractedText = '';
    if (this.useRealAI) {
      realDocumentProcessor.clearExtractedText();
    }
    console.log('🧹 Extracted text cleared');
  }

  /**
   * Get processing mode info
   */
  getProcessingMode(): {
    mode: 'real' | 'mock';
    description: string;
    services: string[];
  } {
    if (this.useRealAI) {
      return {
        mode: 'real',
        description: 'Using real Google Cloud AI services',
        services: ['Google Vision API', 'Google Vertex AI (Gemini)', 'Google Cloud Storage']
      };
    } else {
      return {
        mode: 'mock',
        description: 'Using mock processing for development/demo',
        services: ['Client-side regex processing', 'Hardcoded analysis data']
      };
    }
  }

  /**
   * Helper to read file as text for mock processing
   */
  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // For text files, read as text
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other files in mock mode, return empty string
        resolve('');
      }
    });
  }

  /**
   * Get mock text based on file name for demo purposes
   */
  private getMockTextForFile(fileName: string): string {
    return `Mock extracted text from ${fileName}. This is demo content that would normally be extracted from the uploaded document using Google Cloud Vision API. In a real implementation, this would contain the actual text content from PDFs, presentations, or images.

TECHCORP AI SOLUTIONS
Revolutionizing Enterprise AI Workflows

PROBLEM
• 70% of enterprises struggle with manual document processing
• Average processing time: 8 hours per document  
• Error rates exceed 15% in manual workflows
• Growing demand for intelligent automation

SOLUTION
TechCorp's AI-powered automation platform transforms how enterprises handle document workflows through:
• Advanced NLP and computer vision
• No-code workflow builder
• Enterprise-grade security and compliance
• Seamless integration with existing systems

MARKET OPPORTUNITY
• Total Addressable Market: $150B
• Serviceable Addressable Market: $25B
• Serviceable Obtainable Market: $2.5B

BUSINESS MODEL
• B2B SaaS with enterprise focus
• Annual contracts ranging from $50K-$500K
• Current ARR: $2.4M with 300% growth
• 150+ enterprise customers

TEAM
• Sarah Chen, CEO - Former VP Engineering at Google, PhD Stanford
• Michael Rodriguez, CTO - Ex-Principal Engineer OpenAI, MS MIT
• 25 total employees across engineering, sales, and operations

FINANCIALS
• Current Revenue: $2.4M ARR
• Revenue Growth: 300% YoY
• Gross Margin: 85%
• Monthly Burn: $150K
• Runway: 18 months
• Previous funding: $5M Series A

This mock text allows the application to demonstrate the full analysis workflow even without real Google Cloud credentials configured.`;
  }
}

// Export singleton instance
// Export singleton instance
export const smartDocumentProcessor = new SmartDocumentProcessor();
