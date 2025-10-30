import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Log token status on startup
if (!GITHUB_TOKEN) {
  console.warn('⚠️  WARNING: GITHUB_TOKEN not found in .env file');
  console.warn('   GitHub API rate limit will be 60 requests/hour (unauthenticated)');
  console.warn('   Add GITHUB_TOKEN to .env for 5,000 requests/hour');
} else {
  console.log('✅ GitHub Token loaded:', GITHUB_TOKEN.substring(0, 8) + '...');
  console.log('📊 Rate limit: 5,000 requests/hour (authenticated)');
}

// Fetch repository structure
export const fetchRepoStructure = async (owner, repo, path = '') => {
  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
    };
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
    
    console.log(`📁 Fetching repo structure: ${owner}/${repo}/${path}`);
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching repo structure:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. Please add GITHUB_TOKEN to .env file.`);
    }
    throw new Error(`Failed to fetch repository: ${error.response?.data?.message || error.message}`);
  }
};

// Fetch file content from GitHub
export const fetchFileContent = async (owner, repo, path) => {
  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
    };
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
    
    const response = await axios.get(url, { headers });
    
    // Decode base64 content
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.error('❌ Error fetching file content:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. Please add GITHUB_TOKEN to .env file.`);
    }
    throw new Error(`Failed to fetch file: ${error.response?.data?.message || error.message}`);
  }
};

// Fetch repository metadata
export const fetchRepoMetadata = async (owner, repo) => {
  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
    };
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    
    console.log(`📊 Fetching metadata for: ${owner}/${repo}`);
    const response = await axios.get(url, { headers });
    return {
      name: response.data.name,
      description: response.data.description,
      language: response.data.language,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      openIssues: response.data.open_issues_count,
      size: response.data.size,
      defaultBranch: response.data.default_branch,
      createdAt: response.data.created_at,
      updatedAt: response.data.updated_at,
      topics: response.data.topics || [],
    };
  } catch (error) {
    console.error('❌ Error fetching repo metadata:', error.response?.status, error.response?.data?.message || error.message);
    if (error.response?.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. Please add GITHUB_TOKEN to .env file.`);
    }
    if (error.response?.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}. Check if the repo is public or if you have access.`);
    }
    throw new Error(`Failed to fetch repository metadata: ${error.response?.data?.message || error.message}`);
  }
};

// Get all code files recursively (limit to prevent overload)
export const getAllCodeFiles = async (owner, repo, path = '', maxFiles = 50) => {
  const codeFiles = [];
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rb', '.php', '.rs', '.swift'];
  
  const traverse = async (currentPath) => {
    if (codeFiles.length >= maxFiles) return;
    
    try {
      const items = await fetchRepoStructure(owner, repo, currentPath);
      
      for (const item of items) {
        if (codeFiles.length >= maxFiles) break;
        
        if (item.type === 'file') {
          const ext = item.name.substring(item.name.lastIndexOf('.'));
          if (codeExtensions.includes(ext)) {
            codeFiles.push({
              path: item.path,
              name: item.name,
              size: item.size,
              url: item.download_url,
            });
          }
        } else if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'node_modules') {
          await traverse(item.path);
        }
      }
    } catch (error) {
      console.error(`Error traversing ${currentPath}:`, error.message);
    }
  };
  
  await traverse(path);
  return codeFiles;
};

// Parse GitHub URL to extract owner and repo
export const parseGithubUrl = (url) => {
  try {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/i,
      /^([^\/]+)\/([^\/]+)$/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
        };
      }
    }
    
    throw new Error('Invalid GitHub URL format');
  } catch (error) {
    throw new Error('Could not parse GitHub URL. Use format: owner/repo or https://github.com/owner/repo');
  }
};
