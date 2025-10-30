import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

const DashboardCard = ({ review, onClick }) => {
  const getTypeColor = (type) => {
    const colors = {
      review: 'bg-blue-500/10 text-blue-400',
      testgen: 'bg-green-500/10 text-green-400',
      summary: 'bg-purple-500/10 text-purple-400',
      chat: 'bg-orange-500/10 text-orange-400',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-400';
  };

  const getTypeLabel = (type) => {
    const labels = {
      review: 'Code Review',
      testgen: 'Test Generation',
      summary: 'Summary',
      chat: 'Chat',
    };
    return labels[type] || type;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card cursor-pointer hover:border-primary/50 transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(review.type)}`}>
          {getTypeLabel(review.type)}
        </span>
        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
      </div>
      
      <p className="text-sm text-gray-400 mb-2">
        Language: <span className="text-gray-300 font-medium">{review.language}</span>
      </p>
      
      {review.metadata && (
        <div className="flex space-x-4 text-xs text-gray-500">
          {review.metadata.linesOfCode && (
            <span>{review.metadata.linesOfCode} lines</span>
          )}
          {review.metadata.complexity && (
            <span>Complexity: {review.metadata.complexity}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
