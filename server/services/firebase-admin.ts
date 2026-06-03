import * as admin from 'firebase-admin';

export let firebaseStatus = 'disconnected';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountStr || serviceAccountStr.trim() === '' || serviceAccountStr.startsWith('your_')) {
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing or contains a placeholder.');
      console.warn('⚠️ Firebase Admin SDK will initialize with default credentials, which may fail in production unless running on GCP.');
      admin.initializeApp();
    } else {
      let serviceAccount;
      try {
        let cleanedStr = serviceAccountStr.trim();
        // Remove surrounding quotes if accidentally included
        if ((cleanedStr.startsWith("'") && cleanedStr.endsWith("'")) || (cleanedStr.startsWith('"') && cleanedStr.endsWith('"'))) {
          cleanedStr = cleanedStr.slice(1, -1);
        }

        // Support both Base64 and raw JSON formats for Render compatibility
        if (cleanedStr.startsWith('{')) {
          serviceAccount = JSON.parse(cleanedStr);
        } else {
          const decoded = Buffer.from(cleanedStr, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        }
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        firebaseStatus = 'connected';
        console.log(`✅ Firebase Admin SDK initialized successfully. (Project ID: ${serviceAccount.project_id || 'unknown'})`);
      } catch (parseError) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it is valid JSON or Base64 encoded JSON.');
        console.error('Error details:', parseError instanceof Error ? parseError.message : String(parseError));
        // Fallback to default credentials to avoid crashing the server
        admin.initializeApp();
      }
    }
  } catch (error) {
    console.error('❌ Unexpected Firebase admin initialization error:', error);
  }
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop, receiver) {
    return Reflect.get(admin.firestore(), prop, receiver);
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(target, prop, receiver) {
    return Reflect.get(admin.auth(), prop, receiver);
  }
});

export const adminStorage = new Proxy({} as admin.storage.Storage, {
  get(target, prop, receiver) {
    return Reflect.get(admin.storage(), prop, receiver);
  }
});

export async function verifyFirebaseToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { id: decodedToken.uid, ...decodedToken };
  } catch (error) {
    return null;
  }
}
