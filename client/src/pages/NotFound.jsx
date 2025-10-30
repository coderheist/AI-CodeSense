import { motion } from 'framer-motion';
import { Home as HomeIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-8">
          <Search className="w-24 h-24 text-gray-700 mx-auto mb-4" />
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center space-x-2">
            <HomeIcon className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          <Link to="/home" className="btn-secondary">
            Try Code Review
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
