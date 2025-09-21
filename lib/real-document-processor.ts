import { geminiService } from './google-cloud';

export class RealDocumentProcessor {
  private extractedText: string = '';

  /**
   * Extract text from document using Google Vision API
   */
  async extractText(file: File): Promise<string> {
    try {
      console.log(`📄 Processing document: ${file.name}`);
      
      // Create FormData to send to our text extraction API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Text extraction failed');
      }

      const result = await response.json();
      this.extractedText = result.extractedText;
      
      console.log(`✅ Text extracted: ${this.extractedText.length} characters`);
      return this.extractedText;
    } catch (error) {
      console.error('❌ Document processing error:', error);
      throw error;
    }
  }

  /**
   * Extract company information using Gemini AI
   */
  async extractCompanyInfo() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('🏢 Extracting company information...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'company'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Company analysis failed');
      }

      const result = await response.json();
      console.log('✅ Company information extracted');
      return result.result.companyInfo;
    } catch (error) {
      console.error('❌ Company extraction error:', error);
      throw error;
    }
  }

  /**
   * Extract financial metrics using Gemini AI
   */
  async extractFinancialMetrics() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('💰 Extracting financial metrics...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'financial'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Financial analysis failed');
      }

      const result = await response.json();
      console.log('✅ Financial metrics extracted');
      return result.result.financialMetrics;
    } catch (error) {
      console.error('❌ Financial extraction error:', error);
      throw error;
    }
  }

  /**
   * Extract team information using Gemini AI
   */
  async extractTeamInfo() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('👥 Extracting team information...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'team'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Team analysis failed');
      }

      const result = await response.json();
      console.log('✅ Team information extracted');
      return result.result;
    } catch (error) {
      console.error('❌ Team extraction error:', error);
      throw error;
    }
  }

  /**
   * Extract market information using Gemini AI
   */
  async extractMarketInfo() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('📊 Extracting market information...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'market'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Market analysis failed');
      }

      const result = await response.json();
      console.log('✅ Market information extracted');
      return result.result.marketInfo;
    } catch (error) {
      console.error('❌ Market extraction error:', error);
      throw error;
    }
  }

  /**
   * Analyze risks using Gemini AI
   */
  async analyzeRisks() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('⚠️ Analyzing risks...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'risk'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Risk analysis failed');
      }

      const result = await response.json();
      console.log('✅ Risk analysis completed');
      return result.result.riskFlags;
    } catch (error) {
      console.error('❌ Risk analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate investment recommendation using Gemini AI
   */
  async generateRecommendation() {
    if (!this.extractedText) {
      throw new Error('No text extracted. Please process a document first.');
    }

    try {
      console.log('🎯 Generating investment recommendation...');
      
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.extractedText,
          analysisType: 'recommendation'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Recommendation generation failed');
      }

      const result = await response.json();
      console.log('✅ Investment recommendation generated');
      return result.result.recommendation;
    } catch (error) {
      console.error('❌ Recommendation generation error:', error);
      throw error;
    }
  }

  /**
   * Get the extracted text (for debugging or additional processing)
   */
  getExtractedText(): string {
    return this.extractedText;
  }

  /**
   * Clear the extracted text
   */
  clearExtractedText(): void {
    this.extractedText = '';
    console.log('🧹 Extracted text cleared');
  }
}

// Singleton instance for use across components
export const realDocumentProcessor = new RealDocumentProcessor();
