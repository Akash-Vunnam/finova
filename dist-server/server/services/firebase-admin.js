"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStorage = exports.adminAuth = exports.adminDb = exports.firebaseStatus = void 0;
exports.verifyFirebaseToken = verifyFirebaseToken;
const admin = __importStar(require("firebase-admin"));
exports.firebaseStatus = 'disconnected';
if (!admin.apps.length) {
    try {
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountStr || serviceAccountStr.trim() === '' || serviceAccountStr.startsWith('your_')) {
            console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing or contains a placeholder.');
            console.warn('⚠️ Firebase Admin SDK will initialize with default credentials, which may fail in production unless running on GCP.');
            admin.initializeApp();
        }
        else {
            let serviceAccount;
            try {
                // Support both Base64 and raw JSON formats for Render compatibility
                if (!serviceAccountStr.trim().startsWith('{')) {
                    const decoded = Buffer.from(serviceAccountStr, 'base64').toString('utf8');
                    serviceAccount = JSON.parse(decoded);
                }
                else {
                    serviceAccount = JSON.parse(serviceAccountStr);
                }
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                exports.firebaseStatus = 'connected';
                console.log(`✅ Firebase Admin SDK initialized successfully. (Project ID: ${serviceAccount.project_id || 'unknown'})`);
            }
            catch (parseError) {
                console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it is valid JSON or Base64 encoded JSON.');
                console.error('Error details:', parseError instanceof Error ? parseError.message : String(parseError));
                // Fallback to default credentials to avoid crashing the server
                admin.initializeApp();
            }
        }
    }
    catch (error) {
        console.error('❌ Unexpected Firebase admin initialization error:', error);
    }
}
exports.adminDb = new Proxy({}, {
    get(target, prop, receiver) {
        return Reflect.get(admin.firestore(), prop, receiver);
    }
});
exports.adminAuth = new Proxy({}, {
    get(target, prop, receiver) {
        return Reflect.get(admin.auth(), prop, receiver);
    }
});
exports.adminStorage = new Proxy({}, {
    get(target, prop, receiver) {
        return Reflect.get(admin.storage(), prop, receiver);
    }
});
async function verifyFirebaseToken(token) {
    try {
        const decodedToken = await exports.adminAuth.verifyIdToken(token);
        return { id: decodedToken.uid, ...decodedToken };
    }
    catch (error) {
        return null;
    }
}
