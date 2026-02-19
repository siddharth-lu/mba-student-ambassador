import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ambassador_id, platform, referrer } = body;

        const userAgent = req.headers.get('user-agent') || 'unknown';
        const deviceType = /mobile/i.test(userAgent) ? 'mobile' : 'desktop';

        // Check if Firebase is configured
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            console.log('Mock tracking:', { ambassador_id, platform, referrer, deviceType });
            return NextResponse.json({ success: true, message: 'Mock tracking logged (Firebase not configured)' });
        }

        try {
            await addDoc(collection(db, 'interaction_logs'), {
                ambassador_id,
                platform,
                device_type: deviceType,
                referrer,
                created_at: serverTimestamp(),
            });
        } catch (dbError: any) {
            console.error('Error inserting Firestore log:', dbError);
            return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('API error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
