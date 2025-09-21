import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/google-cloud';

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 AI analysis API called');

    const body = await request.json();
    const { text, analysisType } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required for analysis' },
        { status: 400 }
      );
    }

    if (!analysisType || typeof analysisType !== 'string') {
      return NextResponse.json(
        { error: 'Analysis type is required' },
        { status: 400 }
      );
    }

    const validAnalysisTypes = ['company', 'financial', 'team', 'market', 'risk', 'recommendation'];
    if (!validAnalysisTypes.includes(analysisType)) {
      return NextResponse.json(
        { 
          error: 'Invalid analysis type',
          validTypes: validAnalysisTypes
        },
        { status: 400 }
      );
    }

    // Validate text length
    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Text content too short. Please provide more detailed information.' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Text content too long. Maximum 50,000 characters allowed.' },
        { status: 400 }
      );
    }

    console.log(`🔍 Analyzing ${analysisType} data (${text.length} characters)...`);

    // Analyze using Gemini AI
    const analysisResult = await geminiService.analyzeStartupData(text, analysisType as any);

    console.log(`✅ Analysis completed for ${analysisType}`);

    return NextResponse.json({
      success: true,
      analysisType,
      result: analysisResult,
      metadata: {
        textLength: text.length,
        processedAt: new Date().toISOString(),
        model: 'gemini-1.5-pro',
        confidence: analysisResult.confidence || 'unknown'
      }
    });

  } catch (error) {
    console.error('❌ AI analysis error:', error);
    
    // Handle specific Google Cloud errors
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { 
            error: 'Google Cloud Vertex AI quota exceeded. Please try again later.',
            retryAfter: 3600 // 1 hour
          },
          { status: 429 }
        );
      }
      
      if (error.message.includes('authentication')) {
        return NextResponse.json(
          { 
            error: 'Google Cloud authentication failed. Please check your credentials.',
            details: 'Contact administrator to configure Google Cloud services.'
          },
          { status: 503 }
        );
      }

      if (error.message.includes('safety')) {
        return NextResponse.json(
          { 
            error: 'Content blocked by safety filters. Please review document content.',
            details: 'Gemini AI safety filters may have flagged potentially harmful content.'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
