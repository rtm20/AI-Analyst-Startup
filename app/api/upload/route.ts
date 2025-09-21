import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.pptx')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and PPTX files are supported.' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename and mock upload for demo
    const timestamp = Date.now();
    const fileName = `startup-docs/${timestamp}-${file.name}`;
    
    // For demo purposes, return mock upload success
    return NextResponse.json({
      success: true,
      document: {
        id: `doc-${timestamp}`,
        name: file.name,
        type: 'document',
        url: `demo/${fileName}`,
        uploadedAt: new Date(),
        processed: false,
        size: file.size,
      },
      uploadInfo: {
        fileName,
        bucket: 'demo-bucket',
        size: file.size,
      }
    });

  } catch (error) {
    console.error('Upload API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
