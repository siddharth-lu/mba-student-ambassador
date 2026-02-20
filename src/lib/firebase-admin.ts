import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mba-student-chat';
        // If bucket is missing or is just a sender ID (number), infer it from project ID
        let bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!bucketName || /^\d+$/.test(bucketName)) {
            bucketName = `${projectId}.firebasestorage.app`;
        }

        console.log(`Initializing Firebase Admin for project: ${projectId}, bucket: ${bucketName}`);

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Robust private key handling: remove extra quotes and fix newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
            }),
            storageBucket: bucketName,
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
