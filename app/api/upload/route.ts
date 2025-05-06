import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '../../../lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Chuyển đổi file Blob thành Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'book-images',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}