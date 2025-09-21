import { NextRequest, NextResponse } from 'next/server';
import { visionService } from '@/lib/google-cloud';

export async function POST(request: NextRequest) {
  try {
    console.log('📄 Text extraction API called');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Unsupported file type. Please upload PDF, JPEG, PNG, GIF, WebP, BMP, or TIFF files.' 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    console.log(`📁 Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using Google Vision API
    const extractedText = await visionService.extractTextFromDocument(buffer);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'No text could be extracted from the document. Please ensure the document contains readable text.' 
        },
        { status: 400 }
      );
    }

    console.log(`✅ Text extracted successfully: ${extractedText.length} characters`);

    return NextResponse.json({
      success: true,
      extractedText,
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        extractedTextLength: extractedText.length,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Text extraction error:', error);
    
    // Handle specific Google Cloud errors
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { 
            error: 'Google Cloud Vision API quota exceeded. Please try again later.',
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
    }

    return NextResponse.json(
      { 
        error: 'Failed to extract text from document',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
