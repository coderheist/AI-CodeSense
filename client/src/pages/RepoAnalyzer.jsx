import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Search, FileCode, Loader, Download, Copy, Check, MessageSquare, Send, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

// Ensure API_URL always ends with /api
let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (API_URL && !API_URL.includes('/api')) {
  API_URL = `${API_URL}/api`;
}
console.log('🔗 RepoAnalyzer API URL:', API_URL);

// File type icon mapping
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const iconMap = {
    js: '🟨',
    jsx: '⚛️',
    ts: '🔷',
    tsx: '⚛️',
    py: '🐍',
    java: '☕',
    cpp: '⚙️',
    c: '⚙️',
    html: '🌐',
    css: '🎨',
    json: '📋',
    md: '📝',
    yml: '⚙️',
    yaml: '⚙️',
    xml: '📄',
    svg: '🖼️',
    png: '🖼️',
    jpg: '🖼️',
    gif: '🖼️',
    pdf: '📕',
    txt: '📄',
    sh: '💻',
    bat: '💻',
    go: '🐹',
    rs: '🦀',
    php: '🐘',
    rb: '💎',
    swift: '🐦',
    kt: '🎯',
  };
  return iconMap[ext] || '📄';
};

const RepoAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [repoInfo, setRepoInfo] = useState(null);
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileExplanation, setFileExplanation] = useState(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  
  // Master prompt state
  const [masterPrompt, setMasterPrompt] = useState(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;

    try {
      setLoading(true);
      setAnalysis(null);
      setRepoInfo(null);
      setFileStructure([]);
      setChatMessages([]); // Reset chat when analyzing new repo

      const response = await axios.post(`${API_URL}/repo/analyze`, {
        repoUrl: repoUrl.trim(),
      });

      setAnalysis(response.data.analysis);
      setRepoInfo(response.data.repository);
      
      // Fetch file structure
      const structureResponse = await axios.get(`${API_URL}/repo/structure`, {
        params: { repoUrl: repoUrl.trim() },
      });
      setFileStructure(structureResponse.data.files || []);

      // Add welcome message to chat
      setChatMessages([{
        role: 'assistant',
        content: `Hello! I've analyzed **${response.data.repository.repo}**. Feel free to ask me any questions about this repository! 🚀`
      }]);

    } catch (error) {
      console.error('Analysis error:', error);
      alert(error.response?.data?.error || 'Failed to analyze repository. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !analysis) return;

    const userMessage = chatInput.trim();
    setChatInput('');

    // Add user message to chat
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);

    try {
      setChatLoading(true);

      const response = await axios.post(`${API_URL}/repo/chat`, {
        repoUrl: repoUrl.trim(),
        question: userMessage,
        chatHistory: newMessages.slice(-10), // Send last 10 messages for context
        repoContext: {
          name: repoInfo?.repo,
          description: repoInfo?.metadata?.description,
          language: repoInfo?.metadata?.language,
          topics: repoInfo?.metadata?.topics,
          analysis: analysis,
          fileStructure: fileStructure,
        },
      });

      // Add AI response to chat
      setChatMessages([...newMessages, {
        role: 'assistant',
        content: response.data.response
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error processing your question. Please try again.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleExplainFile = async (filePath) => {
    try {
      setLoadingFile(true);
      setSelectedFile(filePath);
      setFileExplanation(null);

      const response = await axios.post(`${API_URL}/repo/explain`, {
        repoUrl: repoUrl.trim(),
        filePath,
      });

      setFileExplanation(response.data.explanation);
    } catch (error) {
      console.error('File explanation error:', error);
      alert('Failed to explain file. Please try again.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleCopy = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoInfo?.repo || 'repo'}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGeneratePrompt = async () => {
    if (!repoUrl.trim()) return;

    try {
      setLoadingPrompt(true);
      setMasterPrompt(null);

      const response = await axios.post(`${API_URL}/repo/generate-prompt`, {
        repoUrl: repoUrl.trim(),
      });

      setMasterPrompt(response.data.masterPrompt);
      setShowPromptModal(true);

    } catch (error) {
      console.error('Prompt generation error:', error);
      alert(error.response?.data?.error || 'Failed to generate master prompt. Please try again.');
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!masterPrompt) return;
    try {
      await navigator.clipboard.writeText(masterPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const handleDownloadPrompt = () => {
    if (!masterPrompt) return;
    const blob = new Blob([masterPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoInfo?.repo || 'repo'}-master-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold">Repository Analyzer</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Analyze any GitHub repository with AI-powered insights
          </p>
        </div>

        {/* Input Section */}
        <div className="card mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub Repository URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo or owner/repo"
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !repoUrl.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>💡 Examples:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>https://github.com/facebook/react</li>
                <li>vercel/next.js</li>
                <li>https://github.com/microsoft/vscode</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card">
            <LoadingSpinner message="Analyzing repository... This may take a moment." />
          </div>
        )}

        {/* Results Section */}
        {!loading && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Analysis */}
            <div className="lg:col-span-2 space-y-6">
              {/* Repository Info Card */}
              {repoInfo && (
                <div className="card">
                  {/* Owner Avatar and Repo Header */}
                  <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-700">
                    <img 
                      src={`https://github.com/${repoInfo.owner}.png`}
                      alt={repoInfo.owner}
                      className="w-16 h-16 rounded-full border-2 border-purple-500"
                      onError={(e) => {
                        e.target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-2xl font-bold">
                          {repoInfo.metadata.name}
                        </h2>
                        <a 
                          href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                        </a>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        <span className="text-purple-400 font-medium">{repoInfo.owner}</span> / {repoInfo.repo}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {repoInfo.metadata.description || 'No description available'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 mb-4">
                    <button
                      onClick={handleGeneratePrompt}
                      disabled={loadingPrompt}
                      className="btn-primary flex items-center space-x-2 text-sm py-2 px-3"
                      title="Generate master prompt for V0.dev/Lovable"
                    >
                      {loadingPrompt ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Master Prompt</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="btn-secondary flex items-center space-x-2 text-sm py-2 px-3"
                      title="Copy documentation"
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
                    <button
                      onClick={handleDownload}
                      className="btn-secondary flex items-center space-x-2 text-sm py-2 px-3"
                      title="Download documentation"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center space-x-1">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{repoInfo.metadata.stars}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Stars</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-500 flex items-center justify-center space-x-1">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        <span>{repoInfo.metadata.forks}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Forks</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-500 flex items-center justify-center space-x-1">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <span className="text-sm">{repoInfo.metadata.language}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Language</div>
                    </div>
                  </div>

                  {repoInfo.metadata.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {repoInfo.metadata.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Analysis */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">📚 AI-Generated Documentation</h3>
                <MarkdownRenderer content={analysis} />
              </div>

              {/* AI Chat Interface */}
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Ask AI About This Repository</span>
                </h3>

                {/* Chat Messages */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Start asking questions about this repository!</p>
                      <p className="text-sm mt-2">Example: "What design patterns are used?"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === 'user'
                                ? 'bg-purple-500/20 text-purple-100'
                                : 'bg-gray-700/50 text-gray-100'
                            }`}
                          >
                            {msg.role === 'assistant' ? (
                              <MarkdownRenderer content={msg.content} />
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <Loader className="w-5 h-5 animate-spin text-purple-400" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask anything about this repository..."
                    className="input-field flex-1"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || !chatInput.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {chatLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Suggested Questions */}
                {chatMessages.length === 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setChatInput('What is the main purpose of this repository?')}
                      className="text-xs bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full"
                    >
                      💡 Main purpose?
                    </button>
                    <button
                      onClick={() => setChatInput('What are the key dependencies?')}
                      className="text-xs bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full"
                    >
                      📦 Key dependencies?
                    </button>
                    <button
                      onClick={() => setChatInput('How do I set up this project locally?')}
                      className="text-xs bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full"
                    >
                      🚀 Setup guide?
                    </button>
                    <button
                      onClick={() => setChatInput('What design patterns are used?')}
                      className="text-xs bg-gray-700/50 hover:bg-gray-600/50 px-3 py-1 rounded-full"
                    >
                      🎨 Design patterns?
                    </button>
                  </div>
                )}
              </div>

              {/* File Explanation */}
              {fileExplanation && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">
                    🔍 File Analysis: {selectedFile?.split('/').pop()}
                  </h3>
                  {loadingFile ? (
                    <LoadingSpinner message="Analyzing file..." />
                  ) : (
                    <MarkdownRenderer content={fileExplanation} />
                  )}
                </div>
              )}
            </div>

            {/* File Explorer Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <FileCode className="w-5 h-5" />
                  <span>Project Files</span>
                </h3>
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {fileStructure.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No files to display
                    </p>
                  ) : (
                    fileStructure.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExplainFile(file.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedFile === file.path
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                        }`}
                        disabled={loadingFile}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getFileIcon(file.name)}</span>
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1 ml-7">
                          {file.path}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysis && (
          <div className="card text-center py-16">
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub" 
              className="w-20 h-20 mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-gray-400">
              Enter a GitHub repository URL above to get started with AI-powered analysis
            </p>
          </div>
        )}
        {/* Master Prompt Modal */}
        {showPromptModal && masterPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-60"
              onClick={() => setShowPromptModal(false)}
            />
            <div className="bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Master Prompt for {repoInfo?.repo}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="btn-secondary text-sm px-3 py-1 flex items-center space-x-2"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadPrompt}
                    className="btn-secondary text-sm px-3 py-1 flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowPromptModal(false)}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto bg-gray-800 rounded p-4">
                <pre className="whitespace-pre-wrap text-sm">{masterPrompt}</pre>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default RepoAnalyzer;
