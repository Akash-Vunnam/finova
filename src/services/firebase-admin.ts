import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountStr) {
      const serviceAccount = JSON.parse(serviceAccountStr);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is missing. Using default credentials (which might fail in some environments).');
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
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
