// Document processing utilities
import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

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
    const fileType = this.getFileType(file);
    
    switch (fileType) {
      case 'pdf':
        return this.processPDF(file);
      case 'docx':
        return this.processDOCX(file);
      case 'pptx':
        return this.processPPTX(file);
      case 'txt':
        return this.processText(file);
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }
  }

  private getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (file.type === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') return 'docx';
    if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || extension === 'pptx') return 'pptx';
    if (file.type === 'text/plain' || extension === 'txt') return 'txt';
    
    return 'unknown';
  }

  private async processPDF(file: File): Promise<ProcessedDocument> {
    try {
      const buffer = await file.arrayBuffer();
      const data = await pdfParse(Buffer.from(buffer));
      
      return {
        text: data.text,
        metadata: {
          pageCount: data.numpages,
          wordCount: this.countWords(data.text),
          extractedAt: new Date(),
          processingMethod: 'pdf-parse',
        },
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processDOCX(file: File): Promise<ProcessedDocument> {
    try {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      
      return {
        text: result.value,
        metadata: {
          wordCount: this.countWords(result.value),
          extractedAt: new Date(),
          processingMethod: 'mammoth',
        },
      };
    } catch (error) {
      throw new Error(`DOCX processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processPPTX(file: File): Promise<ProcessedDocument> {
    // For PPTX, we'll use Cloud Vision API after upload
    // This is a placeholder that returns basic file info
    const text = `PowerPoint presentation: ${file.name}`;
    
    return {
      text,
      metadata: {
        wordCount: 0,
        extractedAt: new Date(),
        processingMethod: 'cloud-vision-pending',
      },
    };
  }

  private async processText(file: File): Promise<ProcessedDocument> {
    try {
      const text = await file.text();
      
      return {
        text,
        metadata: {
          wordCount: this.countWords(text),
          extractedAt: new Date(),
          processingMethod: 'direct-text',
        },
      };
    } catch (error) {
      throw new Error(`Text processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Extract financial metrics from text using regex patterns
  extractFinancialMetrics(text: string): any {
    const metrics: any = {};
    
    // Revenue patterns
    const revenuePatterns = [
      /revenue[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)[mk]?/gi,
      /\$([0-9,]+(?:\.[0-9]+)?)[mk]?\s*revenue/gi,
      /sales[:\s]*\$?([0-9,]+(?:\.[0-9]+)?)[mk]?/gi,
    ];
    
    // Growth rate patterns
    const growthPatterns = [
      /growth[:\s]*([0-9]+(?:\.[0-9]+)?)%/gi,
      /growing[:\s]*([0-9]+(?:\.[0-9]+)?)%/gi,
      /([0-9]+(?:\.[0-9]+)?)%\s*growth/gi,
    ];
    
    // User/customer patterns
    const userPatterns = [
      /([0-9,]+(?:\.[0-9]+)?)[mk]?\s*users/gi,
      /([0-9,]+(?:\.[0-9]+)?)[mk]?\s*customers/gi,
    ];
    
    // Extract values
    metrics.revenue = this.extractNumericValues(text, revenuePatterns);
    metrics.growth = this.extractNumericValues(text, growthPatterns);
    metrics.users = this.extractNumericValues(text, userPatterns);
    
    return metrics;
  }

  private extractNumericValues(text: string, patterns: RegExp[]): number[] {
    const values: number[] = [];
    
    patterns.forEach(pattern => {
      // Use Array.from to handle matchAll iterator compatibility
      const matches = Array.from(text.matchAll(pattern));
      matches.forEach(match => {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value)) {
          values.push(value);
        }
      });
    });
    
    return values;
  }

  // Extract company information
  extractCompanyInfo(text: string): any {
    const info: any = {};
    
    // Company name (often in the first few lines)
    const lines = text.split('\n').slice(0, 10);
    const titleLine = lines.find(line => 
      line.length > 3 && 
      line.length < 50 && 
      !line.includes('confidential') &&
      !line.includes('pitch deck')
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
      /headquarters[:\s]*([^,\n.]+)/gi,
    ];
    
    locationPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && !info.location) {
        info.location = match[1].trim();
      }
    });
    
    return info;
  }

  // Extract team information
  extractTeamInfo(text: string): any {
    const team: any = { founders: [] };
    
    // Founder patterns
    const founderPatterns = [
      /founder[:\s]*([^,\n.]+)/gi,
      /ceo[:\s]*([^,\n.]+)/gi,
      /co-founder[:\s]*([^,\n.]+)/gi,
    ];
    
    founderPatterns.forEach(pattern => {
      // Use Array.from to handle matchAll iterator compatibility
      const matches = Array.from(text.matchAll(pattern));
      matches.forEach(match => {
        const name = match[1].trim();
        if (name && name.length > 2 && name.length < 50) {
          team.founders.push({
            name,
            role: match[0].split(':')[0].trim(),
          });
        }
      });
    });
    
    // Employee count patterns
    const employeePatterns = [
      /([0-9]+)\s*employees/gi,
      /team of ([0-9]+)/gi,
      /([0-9]+)\s*team members/gi,
    ];
    
    employeePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && !team.totalEmployees) {
        team.totalEmployees = parseInt(match[1]);
      }
    });
    
    return team;
  }
}

export const documentProcessor = new DocumentProcessor();
