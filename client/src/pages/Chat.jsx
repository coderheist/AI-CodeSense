import { useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from '../components/Editor';
import ChatPanel from '../components/ChatPanel';
import { chatWithAI } from '../utils/api';

const Chat = () => {
  const [code, setCode] = useState('// Paste your code here\n\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n');
  const [language, setLanguage] = useState('javascript');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'csharp',
    'go', 'rust', 'ruby', 'php', 'cpp'
  ];

  const handleSend = async (question) => {
    if (!code.trim()) {
      alert('Please add some code first');
      return;
    }

    const userMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatWithAI(code, language, question, chatHistory);
      
      const aiMessage = { role: 'assistant', content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">AI Code Chat</h1>
        <p className="text-gray-400 mb-8">Ask questions and get help with your code</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Code Context</label>
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
              height="600px"
            />
          </div>

          {/* Chat Section */}
          <div className="card h-[700px] flex flex-col p-0">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <p className="text-sm text-gray-400">Ask me anything about your code</p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatPanel
                messages={messages}
                onSend={handleSend}
                input={input}
                setInput={setInput}
                isLoading={loading}
              />
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold mb-4">Quick Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSend('Explain what this code does')}
              disabled={loading}
              className="btn-secondary text-sm"
            >
              Explain this code
            </button>
            <button
              onClick={() => handleSend('How can I optimize this code?')}
              disabled={loading}
              className="btn-secondary text-sm"
            >
              Optimize this code
            </button>
            <button
              onClick={() => handleSend('Are there any bugs in this code?')}
              disabled={loading}
              className="btn-secondary text-sm"
            >
              Find bugs
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
