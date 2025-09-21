// Real Google Cloud Services Integration
import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VertexAI } from '@google-cloud/vertexai';

// Environment configuration
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'ai-startup-analyst';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Initialize Google Cloud clients
let storage: Storage;
let visionClient: ImageAnnotatorClient;
let vertex_ai: VertexAI;

try {
  // Initialize with service account key or default credentials
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS ? 
    { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS } : 
    {}; // Use default credentials in production

  storage = new Storage({
    projectId,
    ...credentials,
  });

  visionClient = new ImageAnnotatorClient(credentials);

  // Initialize Vertex AI for Gemini
  vertex_ai = new VertexAI({
    project: projectId,
    location: location,
  });

  console.log('✅ Google Cloud services initialized successfully');
} catch (error) {
  console.error('❌ Google Cloud initialization error:', error);
  throw new Error(`Failed to initialize Google Cloud services: ${error}`);
}

// Cloud Storage Service
export const cloudStorage = {
  /**
   * Upload a file to Google Cloud Storage
   */
  async uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType: string
  ): Promise<{
    fileName: string;
    url: string;
    bucket: string;
    size: number;
  }> {
    try {
      const bucketName = process.env.GOOGLE_CLOUD_BUCKET || 'ai-startup-analyst-docs';
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);

      console.log(`📤 Uploading file to Cloud Storage: ${fileName}`);

      // Upload the file
      await file.save(buffer, {
        metadata: {
          contentType,
          metadata: {
            uploadedAt: new Date().toISOString(),
          }
        },
        public: false,
        validation: 'md5',
      });

      // Generate signed URL for temporary access (24 hours)
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000,
      });

      console.log(`✅ File uploaded successfully: ${fileName}`);

      return {
        fileName,
        url,
        bucket: bucketName,
        size: buffer.length,
      };
    } catch (error) {
      console.error('❌ Cloud Storage error:', error);
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Delete a file from Cloud Storage
   */
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const bucketName = process.env.GOOGLE_CLOUD_BUCKET || 'ai-startup-analyst-docs';
      const bucket = storage.bucket(bucketName);
      await bucket.file(fileName).delete();
      console.log(`🗑️ File deleted: ${fileName}`);
      return true;
    } catch (error) {
      console.error('❌ File deletion error:', error);
      return false;
    }
  }
};

// Vision API Service
export const visionService = {
  /**
   * Extract text from documents using Google Vision API
   */
  async extractTextFromDocument(buffer: Buffer): Promise<string> {
    try {
      console.log('🔍 Extracting text using Google Vision API...');

      const [result] = await visionClient.documentTextDetection({
        image: {
          content: buffer.toString('base64'),
        },
      });

      const fullTextAnnotation = result.fullTextAnnotation;
      
      if (!fullTextAnnotation?.text) {
        console.log('⚠️ No text found with document detection, trying basic text detection...');
        
        // Fallback to regular text detection
        const [textResult] = await visionClient.textDetection({
          image: {
            content: buffer.toString('base64'),
          },
        });
        
        const extractedText = textResult.textAnnotations?.[0]?.description || '';
        console.log(`✅ Text extracted (fallback): ${extractedText.length} characters`);
        return extractedText;
      }

      console.log(`✅ Text extracted: ${fullTextAnnotation.text.length} characters`);
      return fullTextAnnotation.text;
    } catch (error) {
      console.error('❌ Vision API error:', error);
      throw new Error(`Text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Extract text from PDF files using Vision API
   */
  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      console.log('📄 Processing PDF with Vision API...');
      
      // For PDFs, we'll use the document text detection
      return await this.extractTextFromDocument(buffer);
    } catch (error) {
      console.error('❌ PDF processing error:', error);
      throw new Error(`PDF text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Gemini AI Service
export const geminiService = {
  /**
   * Analyze startup data using Gemini Pro
   */
  async analyzeStartupData(
    text: string,
    analysisType: 'company' | 'financial' | 'team' | 'market' | 'risk' | 'recommendation'
  ): Promise<any> {
    try {
      console.log(`🤖 Analyzing ${analysisType} data with Gemini AI...`);

      const model = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-1.5-pro-preview-0409',
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.3,
          topP: 0.8,
        },
      });

      const prompt = this.getAnalysisPrompt(text, analysisType);
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      console.log(`✅ Gemini analysis completed for ${analysisType}`);
      
      return this.parseGeminiResponse(responseText, analysisType);
    } catch (error) {
      console.error('❌ Gemini AI analysis error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * Generate executive summary using Gemini
   */
  async generateSummary(analysisData: any): Promise<string> {
    try {
      console.log('📝 Generating executive summary with Gemini...');

      const model = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-1.5-pro-preview-0409',
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.4,
        },
      });

      const prompt = `
Based on the following startup analysis data, generate a comprehensive executive summary 
that highlights the key investment opportunity, risks, and recommendation:

${JSON.stringify(analysisData, null, 2)}

Please provide a clear, concise executive summary (200-300 words) suitable for investors that covers:
1. Business overview and value proposition
2. Key financial metrics and traction
3. Market opportunity
4. Team strengths
5. Main risks and mitigations
6. Investment recommendation

Format as plain text, not JSON.
`;

      const result = await model.generateContent(prompt);
      const summary = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'Executive summary generation failed. Please review individual analysis sections.';

      console.log('✅ Executive summary generated');
      return summary;
    } catch (error) {
      console.error('❌ Summary generation error:', error);
      return 'Executive summary generation failed. Please review individual analysis sections.';
    }
  },

  /**
   * Get analysis prompt based on type
   */
  getAnalysisPrompt(text: string, analysisType: string): string {
    const basePrompt = `Analyze the following startup document text and extract relevant information. 
Return your response as valid JSON only, no additional text or explanation.

Document content:
${text.substring(0, 8000)} // Limit text length for API efficiency

`;

    const prompts = {
      company: basePrompt + `
Extract company information and return ONLY valid JSON with this exact structure:
{
  "companyInfo": {
    "name": "string",
    "tagline": "string", 
    "description": "string",
    "website": "string",
    "location": "string",
    "founded": "string",
    "industry": "string",
    "businessModel": "string"
  },
  "confidence": 85
}`,
      
      financial: basePrompt + `
Extract financial information and return ONLY valid JSON with this exact structure:
{
  "financialMetrics": {
    "currentRevenue": 0,
    "revenueGrowthRate": 0,
    "grossMargin": 0,
    "burnRate": 0,
    "runway": 0,
    "cashRaised": 0,
    "valuation": 0,
    "employees": 0,
    "customers": 0,
    "arr": 0,
    "mrr": 0
  },
  "unitEconomics": {
    "cac": 0,
    "ltv": 0,
    "paybackPeriod": 0,
    "churnRate": 0
  },
  "confidence": 85
}`,
      
      team: basePrompt + `
Extract team information and return ONLY valid JSON with this exact structure:
{
  "founders": [
    {
      "name": "string",
      "role": "string",
      "background": "string",
      "previousCompanies": ["string"],
      "education": "string",
      "yearsExperience": 0
    }
  ],
  "totalEmployees": 0,
  "keyHires": [
    {
      "name": "string",
      "role": "string", 
      "background": "string"
    }
  ],
  "advisors": [
    {
      "name": "string",
      "background": "string"
    }
  ],
  "confidence": 85
}`,
      
      market: basePrompt + `
Extract market information and return ONLY valid JSON with this exact structure:
{
  "marketInfo": {
    "tam": 0,
    "sam": 0,
    "som": 0,
    "marketGrowthRate": 0,
    "competitors": ["string"],
    "marketPosition": "string"
  },
  "confidence": 85
}`,
      
      risk: basePrompt + `
Identify risks and return ONLY valid JSON with this exact structure:
{
  "riskFlags": [
    {
      "id": "string",
      "type": "market",
      "severity": "medium",
      "title": "string",
      "description": "string",
      "evidence": ["string"],
      "confidence": 85,
      "impact": "string",
      "recommendation": "string"
    }
  ],
  "confidence": 85
}`,
      
      recommendation: basePrompt + `
Provide investment recommendation and return ONLY valid JSON with this exact structure:
{
  "recommendation": {
    "decision": "buy",
    "score": 75,
    "reasoning": ["string"],
    "keyStrengths": ["string"],
    "keyWeaknesses": ["string"],
    "investmentThesis": "string",
    "suggestedValuation": 0,
    "suggestedCheck": 0,
    "nextSteps": ["string"]
  },
  "confidence": 85
}`
    };

    return prompts[analysisType as keyof typeof prompts] || basePrompt;
  },

  /**
   * Parse Gemini AI response
   */
  parseGeminiResponse(responseText: string, analysisType: string): any {
    try {
      // Clean the response text
      let cleanText = responseText.trim();
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanText);
      console.log(`✅ Successfully parsed ${analysisType} response`);
      return parsed;
    } catch (error) {
      console.error(`❌ Failed to parse ${analysisType} response:`, error);
      console.log('Raw response:', responseText);
      
      // Return default structure based on analysis type
      const defaults = {
        company: { 
          companyInfo: {
            name: 'Unknown Company',
            industry: 'Unknown',
            description: 'Could not extract company information'
          }, 
          confidence: 50 
        },
        financial: { 
          financialMetrics: {
            currentRevenue: 0,
            revenueGrowthRate: 0,
            grossMargin: 0
          }, 
          unitEconomics: {
            cac: 0,
            ltv: 0,
            paybackPeriod: 0,
            churnRate: 0
          }, 
          confidence: 50 
        },
        team: { 
          founders: [], 
          totalEmployees: 0, 
          keyHires: [], 
          advisors: [], 
          confidence: 50 
        },
        market: { 
          marketInfo: {
            tam: 0,
            sam: 0,
            som: 0,
            marketGrowthRate: 0,
            competitors: [],
            marketPosition: 'Unknown'
          }, 
          confidence: 50 
        },
        risk: { 
          riskFlags: [{
            id: 'parse-error',
            type: 'technical',
            severity: 'low',
            title: 'Analysis Parsing Error',
            description: 'Could not parse AI response',
            evidence: ['Response parsing failed'],
            confidence: 50,
            impact: 'Limited analysis available',
            recommendation: 'Retry analysis with different document'
          }], 
          confidence: 50 
        },
        recommendation: { 
          recommendation: { 
            decision: 'hold', 
            score: 50,
            reasoning: ['Insufficient data for recommendation'],
            keyStrengths: [],
            keyWeaknesses: [],
            investmentThesis: 'Unable to generate recommendation due to parsing error',
            suggestedValuation: 0,
            suggestedCheck: 0,
            nextSteps: ['Retry analysis', 'Provide clearer documentation']
          }, 
          confidence: 50 
        }
      };
      
      return defaults[analysisType as keyof typeof defaults] || { confidence: 50 };
    }
  }
};

// Health check function
export const healthCheck = {
  async checkServices(): Promise<{
    storage: boolean;
    vision: boolean;
    vertexAI: boolean;
    overall: boolean;
  }> {
    const results = {
      storage: false,
      vision: false,
      vertexAI: false,
      overall: false,
    };

    try {
      console.log('🔍 Running Google Cloud services health check...');

      // Test Cloud Storage
      await storage.getBuckets({ maxResults: 1 });
      results.storage = true;
      console.log('✅ Cloud Storage: OK');
    } catch (error) {
      console.error('❌ Cloud Storage health check failed:', error);
    }

    try {
      // Test Vision API with a simple image
      const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const buffer = Buffer.from(testImageBase64.split(',')[1], 'base64');
      
      await visionClient.textDetection({
        image: { content: buffer.toString('base64') }
      });
      results.vision = true;
      console.log('✅ Vision API: OK');
    } catch (error) {
      console.error('❌ Vision API health check failed:', error);
    }

    try {
      // Test Vertex AI
      const model = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-1.5-pro-preview-0409'
      });
      
      const result = await model.generateContent('Hello, this is a test.');
      // Check if we got a valid response
      if (result.response.candidates?.[0]?.content?.parts?.[0]?.text) {
        results.vertexAI = true;
        console.log('✅ Vertex AI (Gemini): OK');
      }
    } catch (error) {
      console.error('❌ Vertex AI health check failed:', error);
    }

    results.overall = results.storage && results.vision && results.vertexAI;
    
    if (results.overall) {
      console.log('🎉 All Google Cloud services are operational!');
    } else {
      console.log('⚠️ Some Google Cloud services are not available');
    }

    return results;
  }
};
