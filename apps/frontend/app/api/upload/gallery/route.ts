import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的图片' },
        { status: 400 }
      );
    }

    if (files.length > 6) {
      return NextResponse.json(
        { success: false, message: '最多只能上传6张图片' },
        { status: 400 }
      );
    }

    const body = new FormData();
    files.forEach((file) => {
      body.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/api/upload/gallery`, {
      method: 'POST',
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: '上传失败，请重试' },
      { status: 500 }
    );
  }
}
