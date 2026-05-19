import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const apiUrl = `http://localhost:5204/perfiles/${filename}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 });
  }
}