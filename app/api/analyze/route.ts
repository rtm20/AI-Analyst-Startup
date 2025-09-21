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
        console.error('Analysis API error:', error);

        return NextResponse.json(
            {
                error: 'Analysis failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'AI Startup Analyst API',
        version: '1.0.0',
        endpoints: {
            analyze: 'POST /api/analyze - Analyze startup documents',
            upload: 'POST /api/upload - Upload documents to Cloud Storage',
        },
        powered_by: 'Google Cloud AI',
    });
}
