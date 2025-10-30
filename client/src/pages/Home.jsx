import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Loader, Copy, Check } from 'lucide-react';
import CodeEditor from '../components/Editor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingSpinner from '../components/LoadingSpinner';
import { reviewCode, saveReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [code, setCode] = useState('// Paste your code here\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp',
    'go', 'rust', 'ruby', 'php', 'cpp'
  ];

  const handleReview = async () => {
    if (!code.trim()) return;
    
    try {
      setLoading(true);
      const response = await reviewCode(code, language);
      setReview(response.review);
      setMetrics(response.metrics);
    } catch (error) {
      console.error('Review error:', error);
      alert('Failed to review code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !review) return;

    try {
      console.log('Saving review with data:', {
        userId: user.uid,
        type: 'review',
        language,
        hasCode: !!code,
        hasReview: !!review,
        hasMetrics: !!metrics,
      });

      const response = await saveReview({
        userId: user.uid,
        type: 'review',
        language,
        code,
        aiResponse: review,
        metadata: metrics,
      });

      console.log('Save response:', response);
      alert('✅ Review saved successfully! Check your dashboard.');
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error.response?.data);
      alert(`❌ Failed to save review: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCopy = async () => {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">AI Code Review</h1>
        <p className="text-gray-400 mb-8">Get instant intelligent feedback on your code</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field w-auto"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              height="500px"
            />

            <div className="flex space-x-4">
              <button
                onClick={handleReview}
                disabled={loading || !code.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Review Code</span>
                  </>
                )}
              </button>

              {review && user && (
                <button
                  onClick={handleSave}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Review</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {loading ? (
              <div className="card">
                <LoadingSpinner message="Analyzing your code..." />
              </div>
            ) : (
              <>
                {/* Code Metrics - Show FIRST (above review) */}
                {metrics && (
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4">📊 Code Metrics & Complexity</h3>
                    <MarkdownRenderer content={metrics} />
                  </div>
                )}

                {/* AI Review - Show SECOND (below metrics) */}
                {review && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">✨ AI Review</h3>
                      <button
                        onClick={handleCopy}
                        className="btn-secondary flex items-center space-x-2 text-sm py-2 px-3"
                        title="Copy review to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <MarkdownRenderer content={review} />
                  </div>
                )}

                {!review && !metrics && (
                  <div className="card text-center py-12">
                    <p className="text-gray-500">Click "Review Code" to get AI-powered feedback and complexity analysis</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
