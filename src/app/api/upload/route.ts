import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

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

        // Generate unique file name
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `ambassadors/${Date.now()}_${sanitizedName}`;

        console.log(`Uploading via Admin SDK: ${fileName} (${file.type})`);

        // Use Firebase Admin SDK to upload
        // Admin SDK bypasses storage security rules
        const bucket = adminStorage.bucket();
        const blob = bucket.file(fileName);

        await blob.save(buffer, {
            contentType: file.type,
            metadata: {
                firebaseStorageDownloadTokens: crypto.randomUUID(), // Helps with public URLs
            }
        });

        // Make the file public (optional, or use getDownloadURL equivalent)
        // For Admin SDK, we usually generate a signed URL or use the standard public URL format
        await blob.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        console.log('Upload successful via Admin SDK:', publicUrl);

        return NextResponse.json({ url: publicUrl }, { status: 200 });
    } catch (error: any) {
        console.error('SERVER-SIDE ADMIN UPLOAD ERROR:', error);
        return NextResponse.json(
            {
                error: error.message || 'Upload failed',
                details: error.stack || 'Check server logs'
            },
            { status: 500 }
        );
    }
}
