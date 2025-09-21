// Mock document processor for client-side demo
export interface ProcessedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    extractedAt: Date;
    processingMethod: string;
  };
}

export class DocumentProcessor {
  async processFile(file: File): Promise<ProcessedDocument> {
    // For demo purposes, return mock extracted text based on file name
    const mockText = this.generateMockText(file.name);
    
    return {
      text: mockText,
      metadata: {
        pageCount: 15,
        wordCount: this.countWords(mockText),
        extractedAt: new Date(),
        processingMethod: 'demo-mock',
      },
    };
  }

  private generateMockText(fileName: string): string {
    // Generate realistic startup pitch deck content
    return `
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
• Market growing at 25% annually

BUSINESS MODEL
• B2B SaaS subscription model
• Tiered pricing: Starter ($500/mo), Professional ($2,500/mo), Enterprise ($10,000/mo)
• Implementation and consulting services
• Revenue per customer: $50,000 annually

TRACTION
• Monthly Recurring Revenue: $240,000
• Annual Recurring Revenue: $2.88M
• 150 enterprise customers
• 95% customer retention rate
• 300% revenue growth year-over-year

FINANCIAL HIGHLIGHTS
• Current Revenue: $2.4M annually
• Gross Margin: 85%
• Monthly Burn Rate: $150,000
• Cash on Hand: $2.7M
• Runway: 18 months
• Previous Funding: $5M Series A

FOUNDING TEAM
Sarah Chen - CEO & Co-founder
• Former VP of Engineering at Google
• PhD Computer Science, Stanford University
• 12 years experience in AI/ML

Michael Rodriguez - CTO & Co-founder  
• Ex-Principal Engineer at OpenAI
• MS Artificial Intelligence, MIT
• 10 years experience in deep learning

COMPETITIVE LANDSCAPE
• Competing with UiPath, Automation Anywhere, Blue Prism
• Differentiated by AI-first approach and superior accuracy
• 40% better accuracy than traditional RPA solutions
• Faster implementation times

FUNDING REQUEST
• Raising $8M Series B
• Use of funds: Product development (40%), Sales & Marketing (35%), Operations (25%)
• Target market expansion and international growth
• Path to profitability within 24 months

FINANCIAL PROJECTIONS
• Year 1: $5M revenue, 200 customers
• Year 2: $12M revenue, 400 customers  
• Year 3: $25M revenue, 750 customers
• Projected gross margins: 85-90%

INVESTMENT HIGHLIGHTS
• Experienced founding team from top-tier companies
• Strong product-market fit with enterprise customers
• Healthy unit economics and growth metrics
• Large and growing market opportunity
• Clear path to profitability and scale

CONTACT
• Website: www.techcorp.ai
• Email: investors@techcorp.ai
• Location: San Francisco, CA
• Founded: 2023
    `;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Extract financial metrics from text using regex patterns
  extractFinancialMetrics(text: string): any {
    if (!text || typeof text !== 'string') {
      return {
        revenue: 0,
        growth: 0,
        customers: 0,
        employees: 0,
        funding: 0
      };
    }
    
    const metrics: any = {};
    
    // Revenue patterns
    const revenuePatterns = [
      /revenue[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)[mk]?/gi,
      /\$([0-9,]+(?:\.[0-9]+)?)[mk]?\s*revenue/gi,
      /ARR[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)[mk]?/gi,
      /MRR[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)[mk]?/gi,
    ];
    
    // Growth rate patterns
    const growthPatterns = [
      /growth[:\s]*([0-9]+(?:\.[0-9]+)?)%/gi,
      /growing[:\s]*([0-9]+(?:\.[0-9]+)?)%/gi,
      /([0-9]+(?:\.[0-9]+)?)%\s*growth/gi,
    ];
    
    // User/customer patterns
    const userPatterns = [
      /([0-9,]+(?:\.[0-9]+)?)\s*customers/gi,
      /([0-9,]+(?:\.[0-9]+)?)\s*users/gi,
    ];
    
    // Extract values
    metrics.revenue = this.extractNumericValues(text, revenuePatterns);
    metrics.growth = this.extractNumericValues(text, growthPatterns);
    metrics.customers = this.extractNumericValues(text, userPatterns);
    
    return metrics;
  }

  private extractNumericValues(text: string, patterns: RegExp[]): number[] {
    const values: number[] = [];
    
    patterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0; // Reset regex
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          const value = parseFloat(match[1].replace(/,/g, ''));
          if (!isNaN(value)) {
            values.push(value);
          }
        }
      }
    });
    
    return values;
  }

  // Extract company information
  extractCompanyInfo(text: string): any {
    if (!text || typeof text !== 'string') {
      return {
        name: 'Unknown Company',
        industry: 'Unknown',
        location: 'Unknown',
        description: 'No description available'
      };
    }
    
    const info: any = {};
    
    // Company name (often in the first few lines)
    const lines = text.split('\n').slice(0, 10);
    const titleLine = lines.find(line => 
      line && 
      line.length > 3 && 
      line.length < 50 && 
      !line.toLowerCase().includes('confidential') &&
      !line.toLowerCase().includes('pitch deck')
    );
    
    if (titleLine) {
      info.name = titleLine.trim();
    }
    
    // Website patterns
    const websitePattern = /(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/g;
    const websites = text.match(websitePattern);
    if (websites && websites.length > 0) {
      info.website = websites[0];
    }
    
    // Location patterns
    const locationPatterns = [
      /based in ([^,\n.]+)/gi,
      /located in ([^,\n.]+)/gi,
      /location[:\s]*([^,\n.]+)/gi,
    ];
    
    locationPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1] && !info.location) {
        info.location = match[1].trim();
      }
    });
    
    return info;
  }

  // Extract team information
  extractTeamInfo(text: string): any {
    if (!text || typeof text !== 'string') {
      return {
        founders: [],
        totalEmployees: 0,
        keyHires: [],
        advisors: []
      };
    }
    
    const team: any = { founders: [] };
    
    // Founder patterns
    const founderPatterns = [
      /([A-Za-z\s]+)\s*-\s*(CEO|CTO|Co-founder)/gi,
      /founder[:\s]*([^,\n.]+)/gi,
    ];
    
    founderPatterns.forEach(pattern => {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(text)) !== null) {
        if (match[1]) {
          const name = match[1].trim();
          const role = match[2] || 'Founder';
          if (name && name.length > 2 && name.length < 50) {
            team.founders.push({
              name,
              role,
            });
          }
        }
      }
    });
    
    // Employee count patterns
    const employeePatterns = [
      /([0-9]+)\s*employees/gi,
      /team of ([0-9]+)/gi,
      /([0-9]+)\s*team members/gi,
    ];
    
    employeePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && match[1] && !team.totalEmployees) {
        team.totalEmployees = parseInt(match[1]);
      }
    });
    
    return team;
  }
}

export const documentProcessor = new DocumentProcessor();
