import admin from 'firebase-admin';

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Skip Firebase Admin if credentials not provided (optional feature)
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_PRIVATE_KEY || 
        !process.env.FIREBASE_CLIENT_EMAIL ||
        process.env.FIREBASE_PRIVATE_KEY === 'your_private_key_here') {
      console.log('⚠️  Firebase Admin not configured (optional - skipping)');
      return;
    }

    // Using environment variables (recommended for production)
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin initialized');
    }
  } catch (error) {
    console.error('⚠️  Firebase Admin initialization error:', error.message);
  }
};

initializeFirebase();

// Middleware to verify Firebase token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default admin;
