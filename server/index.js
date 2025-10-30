import functions from 'firebase-functions';
import app from './src/server.js';

// Export Express app as Firebase Function
export const api = functions.https.onRequest(app);
