export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
};

export const getLanguageLabel = (lang) => {
  const labels = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    ruby: 'Ruby',
    php: 'PHP',
    cpp: 'C++',
  };
  return labels[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
};
