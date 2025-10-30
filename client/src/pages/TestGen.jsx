import { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube2, Save, Loader, Copy, Check } from 'lucide-react';
import CodeEditor from '../components/Editor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateTests, saveReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TestGen = () => {
  const [code, setCode] = useState('// Paste your code here to generate test cases\n\nfunction add(a, b) {\n  return a + b;\n}\n');
  const [language, setLanguage] = useState('javascript');
  const [tests, setTests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp',
    'go', 'rust', 'ruby', 'php', 'cpp'
  ];

  const handleGenerate = async () => {
    if (!code.trim()) return;
    
    try {
      setLoading(true);
      const response = await generateTests(code, language);
      setTests(response.tests);
    } catch (error) {
      console.error('Test generation error:', error);
      alert('Failed to generate tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !tests) return;

    try {
      console.log('Saving test with data:', {
        userId: user.uid,
        type: 'testgen',
        language,
        hasCode: !!code,
        hasTests: !!tests,
      });

      const response = await saveReview({
        userId: user.uid,
        type: 'testgen',
        language,
        code,
        aiResponse: tests,
      });

      console.log('Save response:', response);
      alert('✅ Tests saved successfully! Check your dashboard.');
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error.response?.data);
      alert(`❌ Failed to save tests: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tests);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">AI Test Generator</h1>
        <p className="text-gray-400 mb-8">Automatically generate comprehensive test cases</p>

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
                onClick={handleGenerate}
                disabled={loading || !code.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <TestTube2 className="w-5 h-5" />
                    <span>Generate Tests</span>
                  </>
                )}
              </button>

              {tests && user && (
                <button
                  onClick={handleSave}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Tests</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {loading ? (
              <div className="card">
                <LoadingSpinner message="Generating comprehensive test cases..." />
              </div>
            ) : tests ? (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated Tests</h3>
                  <button
                    onClick={handleCopy}
                    className="btn-secondary flex items-center space-x-2 text-sm py-2 px-3"
                    title="Copy tests to clipboard"
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
                <MarkdownRenderer content={tests} />
              </div>
            ) : (
              <div className="card text-center py-12">
                <TestTube2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Click "Generate Tests" to create test cases</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestGen;
