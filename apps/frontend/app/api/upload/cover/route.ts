import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的图片' },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/cover`, {
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
