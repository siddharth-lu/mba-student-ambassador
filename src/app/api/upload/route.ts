import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        const uniqueName = `ambassadors/${Date.now()}_${sanitizedName}`;

        console.log(`Attempting upload to Firebase Storage: ${uniqueName} (${file.type}, ${file.size} bytes)`);

        // Create storage reference
        const storageRef = ref(storage, uniqueName);

        // Upload the file to Firebase Storage from the server
        const snapshot = await uploadBytes(storageRef, buffer, {
            contentType: file.type,
        });

        console.log('Upload successful, getting download URL...');

        // Get the public download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return NextResponse.json({ url: downloadUrl }, { status: 200 });
    } catch (error: any) {
        console.error('SERVER-SIDE UPLOAD ERROR DETAILS:', {
            message: error.message,
            code: error.code,
            customData: error.customData,
            stack: error.stack,
            serverResponse: error.serverResponse
        });
        return NextResponse.json(
            {
                error: error.message || 'Upload failed',
                code: error.code,
                details: error.serverResponse || 'Check server logs'
            },
            { status: 500 }
        );
    }
}
