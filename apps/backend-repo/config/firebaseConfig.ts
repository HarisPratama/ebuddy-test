import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '';

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
});

export const db = admin.firestore();
