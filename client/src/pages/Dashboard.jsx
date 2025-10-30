import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileCode, TestTube2, MessageSquare, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, getUserStats } from '../utils/api';
import DashboardCard from '../components/DashboardCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [historyData, statsData] = await Promise.all([
          getUserHistory(user.uid, { limit: 12 }),
          getUserStats(user.uid),
        ]);

        setHistory(historyData.reviews || []);
        setStats(statsData.stats || {});
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);

  const statCards = [
    {
      icon: <FileCode className="w-8 h-8" />,
      label: 'Total Reviews',
      value: stats?.total || 0,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: <FileCode className="w-8 h-8" />,
      label: 'Code Reviews',
      value: stats?.byType?.review || 0,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      icon: <TestTube2 className="w-8 h-8" />,
      label: 'Tests Generated',
      value: stats?.byType?.testgen || 0,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      label: 'AI Chats',
      value: stats?.byType?.chat || 0,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Track your coding analytics</p>
          </div>
          <TrendingUp className="w-12 h-12 text-primary" />
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-lg w-fit mb-4`}>
                    {stat.icon}
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* History Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="all">All Types</option>
                  <option value="review">Code Reviews</option>
                  <option value="testgen">Test Generation</option>
                  <option value="summary">Summaries</option>
                  <option value="chat">Chats</option>
                </select>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">No activity yet. Start reviewing code!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHistory.map((item) => (
                    <DashboardCard
                      key={item._id}
                      review={item}
                      onClick={() => console.log('View details:', item._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
