import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique file name
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}_${sanitizedName}`;
        const filePath = path.join(uploadDir, fileName);

        console.log(`Saving file locally: ${filePath}`);

        // Save to filesystem
        fs.writeFileSync(filePath, buffer);

        // Path accessible via public URL
        const localPath = `/uploads/${fileName}`;

        console.log('Local upload successful:', localPath);

        return NextResponse.json({ url: localPath }, { status: 200 });
    } catch (error: any) {
        console.error('LOCAL UPLOAD ERROR:', error);
        return NextResponse.json(
            { error: error.message || 'Local upload failed' },
            { status: 500 }
        );
    }
}
