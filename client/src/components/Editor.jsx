import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language = 'javascript', height = '400px' }) => {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
