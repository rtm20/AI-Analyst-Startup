import { NextRequest, NextResponse } from 'next/server';
import { healthCheck } from '@/lib/google-cloud';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Health check API called');

    // Check Google Cloud services
    const serviceStatus = await healthCheck.checkServices();

    // Calculate overall health score
    const totalServices = Object.keys(serviceStatus).filter(key => key !== 'overall').length;
    const healthyServices = Object.values(serviceStatus).filter((status, index) => 
      index < totalServices && status === true
    ).length;
    
    const healthScore = Math.round((healthyServices / totalServices) * 100);

    // Determine health status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (healthScore >= 100) {
      overallStatus = 'healthy';
    } else if (healthScore >= 50) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'unhealthy';
    }

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        cloudStorage: {
          status: serviceStatus.storage ? 'operational' : 'failed',
          enabled: true,
          description: 'Google Cloud Storage for document uploads'
        },
        visionAPI: {
          status: serviceStatus.vision ? 'operational' : 'failed',
          enabled: true,
          description: 'Google Vision API for text extraction'
        },
        vertexAI: {
          status: serviceStatus.vertexAI ? 'operational' : 'failed',
          enabled: true,
          description: 'Google Vertex AI (Gemini) for startup analysis'
        }
      },
      healthScore,
      configuration: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'not-configured',
        location: process.env.GOOGLE_CLOUD_LOCATION || 'not-configured',
        bucket: process.env.GOOGLE_CLOUD_BUCKET || 'not-configured',
        authMethod: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'service-account-key' : 'default-credentials',
        realAIEnabled: process.env.NEXT_PUBLIC_ENABLE_REAL_AI === 'true',
        mockModeEnabled: process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === 'true'
      },
      features: {
        textExtraction: true,
        aiAnalysis: true,
        fileUpload: true,
        realTimeProcessing: true,
        batchProcessing: false // Future feature
      },
      limits: {
        maxFileSize: `${process.env.MAX_FILE_SIZE_MB || '20'}MB`,
        allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,jpeg,jpg,png').split(','),
        rateLimit: `${process.env.API_RATE_LIMIT_REQUESTS || '100'} requests per ${process.env.API_RATE_LIMIT_WINDOW || '3600'} seconds`
      }
    };

    // Set appropriate status code based on health
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 207 : 503;

    console.log(`✅ Health check completed: ${overallStatus} (${healthScore}%)`);

    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('❌ Health check error:', error);

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      services: {
        cloudStorage: { status: 'unknown', enabled: false },
        visionAPI: { status: 'unknown', enabled: false },
        vertexAI: { status: 'unknown', enabled: false }
      },
      healthScore: 0,
      configuration: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'not-configured',
        location: process.env.GOOGLE_CLOUD_LOCATION || 'not-configured',
        realAIEnabled: process.env.NEXT_PUBLIC_ENABLE_REAL_AI === 'true'
      }
    }, { status: 503 });
  }
}
