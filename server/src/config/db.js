import mongoose from 'mongoose';
import dns from 'node:dns';

const isSrvLookupError = (message = '') => {
  return message.includes('querySrv') || message.includes('_mongodb._tcp');
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    // Common issue: placeholder brackets or unencoded special chars in credentials.
    if (mongoUri.includes('<') || mongoUri.includes('>')) {
      throw new Error('MONGODB_URI contains invalid angle brackets. Remove placeholders and URL-encode special characters in username/password.');
    }

    const authority = mongoUri.split('://')[1]?.split('/')[0] || '';
    const atCount = (authority.match(/@/g) || []).length;
    if (atCount > 1) {
      throw new Error('MONGODB_URI credentials appear malformed. URL-encode special characters in username/password (for example @ as %40).');
    }

    let conn;

    try {
      conn = await mongoose.connect(mongoUri);
    } catch (connectError) {
      // Some networks expose DNS resolvers that fail SRV lookups for Atlas clusters.
      if (!isSrvLookupError(connectError.message)) {
        throw connectError;
      }

      console.warn('⚠️ MongoDB SRV lookup failed with current DNS. Retrying with public DNS servers...');
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      conn = await mongoose.connect(mongoUri);
    }

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
};

export default connectDB;
