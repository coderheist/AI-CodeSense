import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="ai-review-content prose prose-invert max-w-none">
      <ReactMarkdown
        children={content}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-gray-800 border border-gray-700"
                customStyle={{
                  margin: '1rem 0',
                  padding: '1rem',
                  fontSize: '0.875rem',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              />
            ) : (
              <code {...props} className="bg-gray-800 text-primary px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => (
            <h1 className="text-3xl font-bold text-primary mb-6 mt-8 border-b-2 border-primary/30 pb-3" {...props} />
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-6 border-b border-gray-700 pb-2" {...props} />
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-xl font-semibold text-gray-200 mb-3 mt-5" {...props} />
          ),
          p: ({node, ...props}) => (
            <p className="mb-4 text-gray-300 leading-relaxed" {...props} />
          ),
          ul: ({node, ...props}) => (
            <ul className="mb-4 ml-6 space-y-2 list-disc marker:text-primary" {...props} />
          ),
          ol: ({node, ...props}) => (
            <ol className="mb-4 ml-6 space-y-2 list-decimal marker:text-primary" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="text-gray-300 leading-relaxed" {...props} />
          ),
          strong: ({node, ...props}) => (
            <strong className="text-gray-100 font-semibold" {...props} />
          ),
          em: ({node, ...props}) => (
            <em className="text-gray-200 italic" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary bg-gray-800/50 pl-4 py-2 my-4 italic text-gray-400" {...props} />
          ),
          hr: ({node, ...props}) => (
            <hr className="my-8 border-gray-700" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700" {...props} />
            </div>
          ),
          th: ({node, ...props}) => (
            <th className="border border-gray-700 bg-gray-800 px-4 py-2 text-left font-semibold" {...props} />
          ),
          td: ({node, ...props}) => (
            <td className="border border-gray-700 px-4 py-2" {...props} />
          ),
        }}
      />
    </div>
  );
};

export default MarkdownRenderer;
