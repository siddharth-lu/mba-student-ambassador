import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique file name
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueName = `${Date.now()}_${sanitizedName}`;

        // Save to public/uploads directory
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, uniqueName);

        await writeFile(filePath, buffer);

        // Return the public URL path
        const publicUrl = `/uploads/${uniqueName}`;

        return NextResponse.json({ url: publicUrl }, { status: 200 });
    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
}
