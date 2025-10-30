import { motion } from 'framer-motion';
import { User, Mail, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement delete account logic
      alert('Account deletion feature coming soon!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8">Profile</h1>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-24 h-24 rounded-full border-4 border-primary"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">
                {user.displayName || 'Anonymous User'}
              </h2>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleLogout} className="btn-secondary flex items-center justify-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">User ID</label>
              <p className="text-gray-300 font-mono text-sm bg-gray-800 p-3 rounded-lg">
                {user.uid}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Verified</label>
              <p className="text-gray-300">
                {user.emailVerified ? (
                  <span className="text-green-400">✓ Verified</span>
                ) : (
                  <span className="text-orange-400">⚠ Not Verified</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Account Created</label>
              <p className="text-gray-300">
                {new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Sign In</label>
              <p className="text-gray-300">
                {new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
