import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Ensure .env is loaded
dotenv.config();

// Initialize Gemini AI with validation
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
  console.error('❌ WARNING: GEMINI_API_KEY not found or invalid in .env file');
  console.error('   The app will start but AI features will not work.');
  console.error('   Please add a valid API key to the .env file.');
} else {
  console.log('🔑 Gemini API Key loaded:', apiKey.substring(0, 20) + '...');
  console.log('🔑 Key length:', apiKey.length);
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Code Review Service
export const getCodeReview = async (code, language) => {
  try {
    console.log(`📝 Starting code review for ${language}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a professional senior software engineer and code reviewer.

Analyze the following ${language} code and provide a comprehensive, well-structured review.

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

# Code Review Summary

## 📊 Overview
- **Language**: ${language}
- **Quality Rating**: [Excellent/Good/Fair/Needs Improvement]
- **Overall Assessment**: [Brief 1-2 sentence summary]

## ✅ Strengths
[List 2-4 positive aspects of the code]
- Point 1
- Point 2

## ⚠️ Areas for Improvement

### 1. Code Quality & Readability
[Provide specific feedback with examples]

### 2. Performance Optimization
[Highlight any performance concerns with suggestions]

### 3. Security & Best Practices
[Point out security issues and best practice violations]

### 4. Bug Risks & Edge Cases
[Identify potential bugs or unhandled edge cases]

## 💡 Specific Recommendations

### Priority: High
1. **[Issue Title]**
   - **Problem**: [Describe the issue]
   - **Solution**: [Provide the fix]
   - **Example**:
   \`\`\`${language}
   // Improved code here
   \`\`\`

### Priority: Medium
[Similar format for medium priority items]

### Priority: Low
[Similar format for low priority items]

## 🎯 Action Items
1. [ ] First action item
2. [ ] Second action item
3. [ ] Third action item

---

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

Remember to:
- Be specific with line numbers when referencing code
- Provide actionable suggestions
- Include code examples for improvements
- Use clear, professional language
- Focus on the most impactful changes first`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Code review generated successfully');
    return text;
  } catch (error) {
    console.error('❌ AI Code Review Error:', error.message);
    if (error.status === 400) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env file');
    } else if (error.status === 404) {
      throw new Error('Model not found. Using gemini-2.0-flash model');
    } else if (error.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later');
    }
    throw new Error(`Code review failed: ${error.message}`);
  }
};

// Test Case Generation Service
export const generateTestCases = async (code, language) => {
  try {
    console.log(`🧪 Starting test generation for ${language}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const testFramework = getTestFramework(language);
    
    const prompt = `You are an expert test engineer specializing in ${testFramework}.

Generate comprehensive, production-ready unit tests for the following ${language} code.

FORMAT YOUR RESPONSE AS FOLLOWS:

# Test Suite for ${language} Code

## 📋 Test Overview
- **Framework**: ${testFramework}
- **Test Categories**: Unit Tests, Edge Cases, Error Handling
- **Coverage Goal**: High coverage of all critical paths

## 🧪 Test Cases

### Setup & Configuration
\`\`\`${language}
// Test setup code, imports, and configuration
\`\`\`

### Test Suite 1: Core Functionality Tests
\`\`\`${language}
// Normal/happy path test cases
describe('Core Functionality', () => {
  test('should handle basic input correctly', () => {
    // Test implementation
  });
});
\`\`\`

### Test Suite 2: Edge Cases
\`\`\`${language}
// Edge case tests (empty input, null, undefined, max values, etc.)
describe('Edge Cases', () => {
  test('should handle empty input', () => {
    // Test implementation
  });
});
\`\`\`

### Test Suite 3: Error Handling
\`\`\`${language}
// Error and exception tests
describe('Error Handling', () => {
  test('should throw error for invalid input', () => {
    // Test implementation
  });
});
\`\`\`

### Test Suite 4: Integration & Mock Tests
\`\`\`${language}
// Tests with mocks, stubs, or integration scenarios
\`\`\`

## 📊 Test Coverage Summary
- Core functions: [List tested functions]
- Edge cases covered: [List scenarios]
- Expected coverage: ~[X]%

## 💡 Testing Best Practices Applied
- ✅ AAA Pattern (Arrange-Act-Assert)
- ✅ Descriptive test names
- ✅ Isolated test cases
- ✅ Comprehensive assertions

---

CODE TO TEST:
\`\`\`${language}
${code}
\`\`\`

Generate complete, runnable tests with proper setup, teardown, and meaningful assertions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Test cases generated successfully');
    return text;
  } catch (error) {
    console.error('❌ AI Test Generation Error:', error.message);
    if (error.status === 400) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env file');
    }
    throw new Error(`Test generation failed: ${error.message}`);
  }
};

// Code Summary Service
export const summarizeCode = async (code, language) => {
  try {
    console.log(`📝 Starting code summary for ${language}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a senior software architect. Provide a clear, professional summary of this ${language} code.

FORMAT YOUR RESPONSE AS FOLLOWS:

# Code Summary

## 🎯 Purpose
[One clear sentence describing what this code does]

## 🏗️ Architecture Overview
**Type**: [Class/Function/Module/Script]
**Complexity**: [Simple/Moderate/Complex]
**Main Components**:
- Component 1: [Brief description]
- Component 2: [Brief description]

## 📥 Inputs & Dependencies
**Parameters/Arguments**:
- \`param1\`: [Type] - [Description]
- \`param2\`: [Type] - [Description]

**External Dependencies**:
- [List imports/libraries used]

## 📤 Outputs & Returns
**Return Type**: [Type]
**Return Description**: [What it returns]

**Side Effects**: [Any state changes, I/O operations, etc.]

## 🔄 Core Logic Flow
1. **Step 1**: [Brief description]
2. **Step 2**: [Brief description]
3. **Step 3**: [Brief description]

## 📊 Complexity Analysis
- **Time Complexity**: O(?)
- **Space Complexity**: O(?)
- **Cyclomatic Complexity**: [Low/Medium/High]

## 🎓 Key Concepts Used
- [Design pattern or concept 1]
- [Design pattern or concept 2]

## ⚡ Quick Facts
- Lines of Code: ~${code.split('\n').length}
- Functions/Methods: [Count]
- Main Algorithm: [Name/description]
- Error Handling: [Yes/No - How]

---

CODE:
\`\`\`${language}
${code}
\`\`\`

Keep the summary professional, accurate, and developer-friendly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Code summary generated successfully');
    return text;
  } catch (error) {
    console.error('❌ AI Summary Error:', error.message);
    if (error.status === 400) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env file');
    }
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

// AI Chat Service (with context)
export const chatAboutCode = async (code, language, question, chatHistory = []) => {
  try {
    console.log(`💬 Starting AI chat for ${language}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const contextPrompt = chatHistory.length > 0 
      ? `Previous conversation:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : '';

    const prompt = `
You are an AI coding assistant helping developers understand and improve their code.

Context - ${language} code:
\`\`\`${language}
${code}
\`\`\`

${contextPrompt}

User Question: ${question}

Provide a helpful, accurate, and concise response. Include code examples when relevant.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ AI chat response generated successfully');
    return text;
  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    if (error.status === 400) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env file');
    }
    throw new Error(`Chat request failed: ${error.message}`);
  }
};

// Helper function to determine test framework
const getTestFramework = (language) => {
  const frameworks = {
    javascript: 'Jest',
    typescript: 'Jest',
    python: 'PyTest',
    java: 'JUnit 5',
    csharp: 'xUnit',
    go: 'testing package',
    ruby: 'RSpec',
    php: 'PHPUnit',
  };
  return frameworks[language.toLowerCase()] || 'appropriate testing framework';
};

// Code Metrics Analysis - Concise version
export const analyzeCodeMetrics = async (code, language) => {
  try {
    console.log(`📊 Analyzing code metrics for ${language}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const linesOfCode = code.split('\n').filter(line => line.trim().length > 0).length;

    const prompt = `You are an expert algorithm analyst. Analyze the following ${language} code and provide PRECISE metrics in a professional format.

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:

## 📊 Code Metrics Summary

### Complexity Analysis
- **Time Complexity:** \`O(?)\`
- **Space Complexity:** \`O(?)\`

### Code Statistics
- **Lines of Code:** ${linesOfCode}
- **Estimated Execution Time:** ~X ms (for n=1000)
- **Code Quality Rating:** ⭐⭐⭐⭐☆ (X/5)

### Analysis Summary
[Write a concise 2-3 sentence analysis explaining:
1. Why this complexity exists (loops, recursion, data structures)
2. Performance characteristics and scalability
3. Overall code quality assessment]

---

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

IMPORTANT:
- Use PRECISE Big O notation (O(1), O(n), O(n²), O(n log n), O(2^n), etc.)
- For execution time, provide realistic estimates (use ms, μs, or s appropriately)
- Rating should be 1-5 based on efficiency, readability, and best practices
- Use star emojis for visual rating (⭐⭐⭐⭐⭐ for 5/5)
- Keep analysis professional and concise`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Code metrics analysis completed');
    return text;
  } catch (error) {
    console.error('❌ AI Metrics Analysis Error:', error.message);
    if (error.status === 400) {
      throw new Error('Invalid API key. Please check your GEMINI_API_KEY in .env file');
    }
    throw new Error(`Metrics analysis failed: ${error.message}`);
  }
};

// Repository Analysis - Generate comprehensive documentation
export const analyzeRepository = async (repoData) => {
  try {
    console.log(`📚 Analyzing repository: ${repoData.metadata.name}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const { metadata, fileStructure, sampleFiles } = repoData;

    const prompt = `You are a senior software architect and technical writer. Analyze this GitHub repository and generate comprehensive documentation.

## Repository Information:
- **Name**: ${metadata.name}
- **Description**: ${metadata.description || 'No description'}
- **Primary Language**: ${metadata.language}
- **Stars**: ${metadata.stars} | **Forks**: ${metadata.forks}
- **Topics**: ${metadata.topics.join(', ') || 'None'}
- **Last Updated**: ${new Date(metadata.updatedAt).toLocaleDateString()}

## File Structure:
${fileStructure.map(f => `- ${f.path} (${f.size} bytes)`).join('\n')}

## Sample Code Files:
${sampleFiles.map(f => `### ${f.path}\n\`\`\`${f.language}\n${f.content.substring(0, 500)}...\n\`\`\``).join('\n\n')}

---

FORMAT YOUR RESPONSE AS FOLLOWS:

# 📦 ${metadata.name} - Project Documentation

## 🎯 Project Overview
[Write a comprehensive 2-3 paragraph overview of what this project does, its purpose, and key features]

## 🏗️ Architecture & Structure

### Technology Stack
- **Frontend**: [List frontend technologies used]
- **Backend**: [List backend technologies]
- **Database**: [Database if any]
- **DevOps**: [CI/CD, deployment tools]

### Project Structure
\`\`\`
[Provide a clean tree structure of main directories]
\`\`\`

**Key Directories:**
- \`/src\` - [Description]
- \`/components\` - [Description]
- [List other important directories]

## 🚀 Core Features
1. **[Feature 1]** - [Description]
2. **[Feature 2]** - [Description]
3. **[Feature 3]** - [Description]

## 🔧 Technical Implementation

### Main Components
[Describe 3-5 main components/modules and their responsibilities]

### Data Flow
[Explain how data flows through the application]

### Key Design Patterns
[Identify design patterns used: MVC, Redux, etc.]

## 📝 Code Quality Assessment

### Strengths
- ✅ [Strength 1]
- ✅ [Strength 2]
- ✅ [Strength 3]

### Areas for Improvement
- ⚠️ [Improvement 1]
- ⚠️ [Improvement 2]

### Code Metrics
- **Complexity**: [Low/Medium/High]
- **Maintainability**: ⭐⭐⭐⭐☆ (X/5)
- **Documentation**: [Well/Partially/Poorly documented]

## 🎓 Learning Insights

### What This Project Teaches
[List 3-5 key learning points from this codebase]

### Recommended for
- [Type of developers who would benefit]
- [Skill level: Beginner/Intermediate/Advanced]

## 🔍 Quick Start Guide
[Based on the code, provide basic setup instructions]

## 📊 Repository Stats
- **Total Files Analyzed**: ${fileStructure.length}
- **Primary Language**: ${metadata.language}
- **Code Size**: ~${Math.round(metadata.size / 1024)} KB
- **Estimated Complexity**: [Simple/Moderate/Complex]

---

Keep the documentation professional, accurate, and developer-friendly. Focus on insights that help developers understand and work with this codebase.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Repository analysis completed');
    return text;
  } catch (error) {
    console.error('❌ AI Repository Analysis Error:', error.message);
    throw new Error(`Repository analysis failed: ${error.message}`);
  }
};

// Explain specific code from repository
export const explainRepoCode = async (filePath, code, language, repoContext) => {
  try {
    console.log(`🔍 Explaining code from: ${filePath}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert code educator. Explain this code file from a GitHub repository in a clear, educational manner.

## Context:
- **Repository**: ${repoContext.repoName}
- **File**: ${filePath}
- **Language**: ${language}
- **Project Type**: ${repoContext.projectType || 'Unknown'}

## Code to Explain:
\`\`\`${language}
${code}
\`\`\`

---

FORMAT YOUR RESPONSE AS FOLLOWS:

# 📄 ${filePath.split('/').pop()} - Code Explanation

## 🎯 Purpose
[What does this file do? What's its role in the project?]

## 📋 Overview
[High-level summary of the code - 2-3 sentences]

## 🔍 Detailed Breakdown

### Imports & Dependencies
[Explain what's being imported and why]

### Main Components/Functions

#### 1. [Component/Function Name]
**What it does**: [Brief description]

**How it works**:
- Step 1: [Explanation]
- Step 2: [Explanation]
- Step 3: [Explanation]

**Code snippet**:
\`\`\`${language}
[Relevant code section]
\`\`\`

#### 2. [Next Component/Function]
[Similar breakdown]

## 💡 Key Concepts Used
- **[Concept 1]**: [Explanation]
- **[Concept 2]**: [Explanation]

## 🔗 How It Connects to the Project
[Explain how this file interacts with other parts of the codebase]

## 🎓 Learning Points
1. [Key takeaway 1]
2. [Key takeaway 2]
3. [Key takeaway 3]

## 🛠️ Potential Improvements
[Suggest 1-2 improvements if applicable]

---

Make the explanation educational and easy to understand, especially for developers learning from this codebase.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Code explanation completed');
    return text;
  } catch (error) {
    console.error('❌ AI Code Explanation Error:', error.message);
    throw new Error(`Code explanation failed: ${error.message}`);
  }
};

// Generate Master Prompt for V0.dev/Lovable - Create comprehensive project recreation prompt
export const generateMasterPrompt = async (repoData) => {
  try {
    console.log(`🎯 Generating master prompt for: ${repoData.metadata.name}...`);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const { metadata, fileStructure, sampleFiles } = repoData;

    const prompt = `You are an expert prompt engineer specializing in creating comprehensive project prompts for AI code generation tools like V0.dev and Lovable.

Analyze this GitHub repository and create a MASTER PROMPT that can be used to recreate this entire project from scratch using AI tools.

## Repository Information:
- **Name**: ${metadata.name}
- **Description**: ${metadata.description || 'No description'}
- **Primary Language**: ${metadata.language}
- **Stars**: ${metadata.stars} | **Forks**: ${metadata.forks}
- **Topics**: ${metadata.topics.join(', ') || 'None'}

## File Structure (${fileStructure.length} files):
${fileStructure.slice(0, 50).map(f => `- ${f.path} (${f.size} bytes)`).join('\n')}
${fileStructure.length > 50 ? `... and ${fileStructure.length - 50} more files` : ''}

## Sample Code Files:
${sampleFiles.slice(0, 5).map(f => `### ${f.path}\n\`\`\`${f.language}\n${f.content.substring(0, 800)}\n\`\`\``).join('\n\n')}

---

GENERATE A MASTER PROMPT FOLLOWING THIS EXACT FORMAT:

---START OF MASTER PROMPT---

# 🚀 ${metadata.name} - Complete Project Build Prompt

## 📋 Project Overview
Create a [type] application called "${metadata.name}" that [main purpose and functionality].

**Core Functionality:**
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]
- [Feature 5]

## 🎨 Technology Stack

### Frontend
- **Framework**: [e.g., React 18.x, Vue 3, Angular, etc.]
- **Build Tool**: [e.g., Vite, Webpack, Next.js]
- **Styling**: [e.g., Tailwind CSS, Material-UI, styled-components]
- **State Management**: [e.g., Redux, Zustand, Context API]
- **Additional Libraries**: [List key dependencies]

### Backend
- **Runtime**: [e.g., Node.js, Python, etc.]
- **Framework**: [e.g., Express, FastAPI, Django]
- **Database**: [e.g., MongoDB, PostgreSQL, Firebase]
- **Authentication**: [e.g., JWT, Firebase Auth, OAuth]

### DevOps & Tools
- **Package Manager**: [npm, yarn, pnpm]
- **Version Control**: Git
- **Deployment**: [Suggested platforms]

## 🏗️ Project Structure

Create the following directory structure:

\`\`\`
${metadata.name}/
├── [Frontend folder]/
│   ├── src/
│   │   ├── components/
│   │   │   ├── [Component1].jsx
│   │   │   ├── [Component2].jsx
│   │   │   └── [Component3].jsx
│   │   ├── pages/
│   │   │   ├── [Page1].jsx
│   │   │   ├── [Page2].jsx
│   │   │   └── [Page3].jsx
│   │   ├── utils/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── [Backend folder]/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
└── README.md
\`\`\`

## 🎯 Detailed Features to Implement

### 1. [Major Feature 1]
**Description**: [What it does]

**Implementation Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**User Interface:**
- [UI element 1]
- [UI element 2]

**API Endpoints (if applicable):**
- \`POST /api/[endpoint]\` - [Purpose]
- \`GET /api/[endpoint]\` - [Purpose]

### 2. [Major Feature 2]
[Same structure as above]

### 3. [Major Feature 3]
[Same structure as above]

### 4. [Major Feature 4]
[Same structure as above]

## 🎨 UI/UX Design Requirements

### Color Scheme
- Primary: [Color with hex]
- Secondary: [Color with hex]
- Background: [Color theme]
- Text: [Color scheme]

### Layout
- [Description of main layout]
- Navigation: [Type - sidebar, top nav, etc.]
- Responsive design for mobile, tablet, desktop

### Key Components
1. **[Component Name]**: [Description and requirements]
2. **[Component Name]**: [Description and requirements]
3. **[Component Name]**: [Description and requirements]

## 🔧 Technical Implementation Details

### Frontend Components

#### 1. [Component Name]
\`\`\`jsx
// Component requirements and structure
- Props: [List props]
- State: [State management needs]
- Features: [Key features]
- Styling: [Styling approach]
\`\`\`

#### 2. [Next Component]
[Similar breakdown]

### Backend API

#### 1. [API Route/Service]
\`\`\`javascript
// Endpoint details
Method: [GET/POST/PUT/DELETE]
Path: /api/[path]
Request Body: { [fields] }
Response: { [fields] }
Authentication: [Required/Not required]
\`\`\`

### Database Schema

\`\`\`javascript
// Define data models
[ModelName] {
  field1: Type,
  field2: Type,
  field3: Type,
  timestamps: true
}
\`\`\`

## 🔐 Authentication & Security

- Implement [authentication method]
- Protect routes with [strategy]
- Store credentials using [method]
- Handle sessions with [approach]

## 📦 Dependencies to Install

### Frontend (\`package.json\`)
\`\`\`json
{
  "dependencies": {
    "[package1]": "^[version]",
    "[package2]": "^[version]",
    "[package3]": "^[version]"
  },
  "devDependencies": {
    "[dev-package1]": "^[version]"
  }
}
\`\`\`

### Backend (\`package.json\`)
\`\`\`json
{
  "dependencies": {
    "[package1]": "^[version]",
    "[package2]": "^[version]"
  }
}
\`\`\`

## 🚀 Setup & Configuration

### Environment Variables
Create \`.env\` files with:

**Frontend (.env):**
\`\`\`
VITE_API_URL=[backend URL]
VITE_[SERVICE]_KEY=[API key]
\`\`\`

**Backend (.env):**
\`\`\`
PORT=[port number]
DATABASE_URL=[connection string]
[SERVICE]_API_KEY=[API key]
JWT_SECRET=[secret key]
\`\`\`

### Database Setup
- Create database: [Instructions]
- Initialize collections/tables: [Details]
- Seed data (if needed): [Sample data]

## ✨ Advanced Features

### 1. [Advanced Feature 1]
[Implementation details]

### 2. [Advanced Feature 2]
[Implementation details]

### 3. [Advanced Feature 3]
[Implementation details]

## 📱 Responsive Design Requirements

- **Mobile (< 768px)**: [Specific requirements]
- **Tablet (768px - 1024px)**: [Specific requirements]
- **Desktop (> 1024px)**: [Specific requirements]

## 🎯 User Flows

### Flow 1: [User Action]
1. User [action]
2. System [response]
3. Display [result]
4. Store [data]

### Flow 2: [User Action]
[Similar breakdown]

## 🧪 Testing Considerations

- Unit tests for [components/functions]
- Integration tests for [API endpoints]
- E2E tests for [critical user flows]

## 🎁 Nice-to-Have Features

1. [Optional feature 1]
2. [Optional feature 2]
3. [Optional feature 3]

## 📝 Additional Notes

- [Important implementation note 1]
- [Important implementation note 2]
- [Performance considerations]
- [Accessibility requirements]

## 🎯 Success Criteria

The project is complete when:
- ✅ [Criterion 1]
- ✅ [Criterion 2]
- ✅ [Criterion 3]
- ✅ [Criterion 4]
- ✅ [Criterion 5]

---

**Build this as a production-ready, scalable application with clean code, proper error handling, loading states, and professional UI/UX design.**

---END OF MASTER PROMPT---

CRITICAL INSTRUCTIONS FOR GENERATING THE PROMPT:
1. Be EXTREMELY specific about technologies, versions, and implementation details
2. Include actual code structure examples where helpful
3. Break down complex features into clear, actionable steps
4. Specify UI/UX requirements clearly
5. Include all necessary API endpoints and their specs
6. List all dependencies that need to be installed
7. Provide database schema details
8. Make it copy-paste ready for V0.dev/Lovable
9. Focus on clarity and completeness
10. The prompt should enable someone to recreate the ENTIRE project from scratch

Generate a prompt that is comprehensive enough that an AI tool can build this entire project without additional questions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Master prompt generation completed');
    return text;
  } catch (error) {
    console.error('❌ Master Prompt Generation Error:', error.message);
    throw new Error(`Master prompt generation failed: ${error.message}`);
  }
};
