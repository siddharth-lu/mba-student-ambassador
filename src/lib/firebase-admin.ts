import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mba-student-chat';

        // Use the env var if it's a valid bucket name, otherwise try to infer it
        let bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
        if (!bucketName || /^\d+$/.test(bucketName)) {
            // Most newer projects use .firebasestorage.app, but some use .appspot.com
            // We'll default to .firebasestorage.app as seen in their local .env
            bucketName = `${projectId}.firebasestorage.app`;
            console.log(`Inferring bucket name from project ID: ${bucketName}`);
        }

        console.log(`Initializing Admin SDK for project [${projectId}] with bucket [${bucketName}]`);

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Robust private key handling: remove extra quotes and fix newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
            }),
            storageBucket: bucketName,
        });
    } catch (error: any) {
        console.error('CRITICAL: Firebase admin initialization failed!', error.message);
    }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
