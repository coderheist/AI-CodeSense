import {
  parseGithubUrl,
  fetchRepoMetadata,
  getAllCodeFiles,
  fetchFileContent,
} from '../services/githubService.js';
import { analyzeRepository, explainRepoCode, chatAboutCode, generateMasterPrompt } from '../services/aiService.js';

// Analyze entire repository
export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    console.log('📥 Analyzing repository:', repoUrl);

    // Parse GitHub URL
    const { owner, repo } = parseGithubUrl(repoUrl);

    // Fetch repository metadata
    const metadata = await fetchRepoMetadata(owner, repo);

    // Get all code files (limit to 30 for performance)
    const fileStructure = await getAllCodeFiles(owner, repo, '', 30);

    // Fetch content of key files (max 5 for AI analysis)
    const sampleFiles = [];
    const importantFiles = fileStructure
      .filter(f => 
        f.name.includes('index') || 
        f.name.includes('main') || 
        f.name.includes('app') ||
        f.path.includes('src/')
      )
      .slice(0, 5);

    for (const file of importantFiles) {
      try {
        const content = await fetchFileContent(owner, repo, file.path);
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
        sampleFiles.push({
          path: file.path,
          name: file.name,
          content: content,
          language: ext,
        });
      } catch (error) {
        console.error(`Error fetching ${file.path}:`, error.message);
      }
    }

    // Generate AI analysis
    const analysis = await analyzeRepository({
      metadata,
      fileStructure,
      sampleFiles,
    });

    res.json({
      success: true,
      repository: {
        owner,
        repo,
        metadata,
      },
      analysis,
      fileCount: fileStructure.length,
      analyzedFiles: sampleFiles.map(f => f.path),
    });

  } catch (error) {
    console.error('❌ Repository Analysis Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze repository',
      details: error.toString(),
    });
  }
};

// Explain specific file from repository
export const explainFile = async (req, res) => {
  try {
    const { repoUrl, filePath } = req.body;

    if (!repoUrl || !filePath) {
      return res.status(400).json({ error: 'Repository URL and file path are required' });
    }

    console.log('🔍 Explaining file:', filePath, 'from', repoUrl);

    // Parse GitHub URL
    const { owner, repo } = parseGithubUrl(repoUrl);

    // Fetch file content
    const content = await fetchFileContent(owner, repo, filePath);

    // Determine language from file extension
    const ext = filePath.substring(filePath.lastIndexOf('.') + 1);
    const languageMap = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rb: 'ruby',
      php: 'php',
      rs: 'rust',
    };
    const language = languageMap[ext] || ext;

    // Get repo metadata for context
    const metadata = await fetchRepoMetadata(owner, repo);

    // Generate explanation
    const explanation = await explainRepoCode(filePath, content, language, {
      repoName: metadata.name,
      projectType: metadata.language,
    });

    res.json({
      success: true,
      file: {
        path: filePath,
        language,
        size: content.length,
      },
      explanation,
      code: content,
    });

  } catch (error) {
    console.error('❌ File Explanation Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to explain file',
      details: error.toString(),
    });
  }
};

// Get repository file structure
export const getRepoStructure = async (req, res) => {
  try {
    const { repoUrl } = req.query;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    const { owner, repo } = parseGithubUrl(repoUrl);
    const metadata = await fetchRepoMetadata(owner, repo);
    const fileStructure = await getAllCodeFiles(owner, repo, '', 100);

    res.json({
      success: true,
      repository: {
        owner,
        repo,
        metadata,
      },
      files: fileStructure,
    });

  } catch (error) {
    console.error('❌ Get Structure Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to get repository structure',
    });
  }
};

// Chat about repository
export const chatAboutRepo = async (req, res) => {
  try {
    const { repoUrl, question, chatHistory, repoContext } = req.body;

    if (!repoUrl || !question) {
      return res.status(400).json({ error: 'Repository URL and question are required' });
    }

    console.log('💬 Chat about repo:', repoUrl, '- Question:', question);

    const { owner, repo } = parseGithubUrl(repoUrl);

    // If no context provided, fetch basic repo info
    let context = repoContext;
    if (!context) {
      const metadata = await fetchRepoMetadata(owner, repo);
      context = {
        name: metadata.name,
        description: metadata.description,
        language: metadata.language,
        topics: metadata.topics || [],
      };
    }

    // Build context for AI
    const contextString = `Repository: ${context.name}
Description: ${context.description || 'No description'}
Primary Language: ${context.language || 'Not specified'}
Topics: ${context.topics?.join(', ') || 'None'}

${repoContext?.analysis ? `\nRepository Analysis:\n${repoContext.analysis}` : ''}
${repoContext?.fileStructure ? `\nKey Files:\n${repoContext.fileStructure.slice(0, 20).map(f => `- ${f.path}`).join('\n')}` : ''}`;

    // Generate AI response
    const response = await chatAboutCode(
      contextString,
      'repository-context',
      question,
      chatHistory || []
    );

    res.json({
      success: true,
      response,
      repository: {
        owner,
        repo,
      },
    });

  } catch (error) {
    console.error('❌ Chat Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process chat request',
    });
  }
};

// Generate Master Prompt for V0.dev/Lovable
export const generatePrompt = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    console.log('🎯 Generating master prompt for:', repoUrl);

    // Parse GitHub URL
    const { owner, repo } = parseGithubUrl(repoUrl);

    // Fetch repository metadata
    const metadata = await fetchRepoMetadata(owner, repo);

    // Get all code files (limit to 50 for comprehensive analysis)
    const fileStructure = await getAllCodeFiles(owner, repo, '', 50);

    // Fetch content of key files (max 8 for comprehensive prompt)
    const sampleFiles = [];
    
    // Prioritize important files
    const importantPatterns = [
      'package.json',
      'README.md',
      'index',
      'main',
      'app',
      'config',
      'routes',
      'controller',
      'model',
      'component',
    ];

    const sortedFiles = fileStructure.sort((a, b) => {
      const aScore = importantPatterns.reduce((score, pattern) => 
        a.path.toLowerCase().includes(pattern) ? score + 1 : score, 0
      );
      const bScore = importantPatterns.reduce((score, pattern) => 
        b.path.toLowerCase().includes(pattern) ? score + 1 : score, 0
      );
      return bScore - aScore;
    });

    for (const file of sortedFiles.slice(0, 8)) {
      try {
        const content = await fetchFileContent(owner, repo, file.path);
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
        sampleFiles.push({
          path: file.path,
          name: file.name,
          content: content,
          language: ext,
        });
      } catch (error) {
        console.error(`Error fetching ${file.path}:`, error.message);
      }
    }

    // Generate master prompt using AI
    const masterPrompt = await generateMasterPrompt({
      metadata,
      fileStructure,
      sampleFiles,
    });

    res.json({
      success: true,
      repository: {
        owner,
        repo,
        name: metadata.name,
        description: metadata.description,
        stars: metadata.stars,
        language: metadata.language,
      },
      masterPrompt,
      analyzedFiles: sampleFiles.map(f => f.path),
      totalFiles: fileStructure.length,
    });

  } catch (error) {
    console.error('❌ Master Prompt Generation Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate master prompt',
      details: error.toString(),
    });
  }
};
