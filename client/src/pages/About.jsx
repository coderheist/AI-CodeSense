import { motion } from 'framer-motion';
import { Code2, Cpu, Cloud, Shield } from 'lucide-react';

const About = () => {
  const techStack = {
    frontend: [
      'React 18',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'Monaco Editor',
      'Firebase Auth',
    ],
    backend: [
      'Node.js',
      'Express',
      'MongoDB',
      'Google Gemini AI',
      'LangChain',
      'Firebase Admin',
    ],
    deployment: [
      'Frontend: Vercel',
      'Backend: Render/Railway',
      'Database: MongoDB Atlas',
      'Auth: Firebase',
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-16">
          <Code2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">About AI CodeSense</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            An AI-powered code review and test generation platform built with cutting-edge technologies
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            AI CodeSense aims to democratize code quality by providing intelligent, AI-powered code reviews
            and test generation accessible to developers of all skill levels. We believe great code should
            be accessible to everyone, and AI can help make that happen.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <Cpu className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">AI-Powered Analysis</h3>
            <p className="text-gray-400">
              Powered by Google Gemini AI and LangChain, our platform provides intelligent code
              reviews, bug detection, and optimization suggestions.
            </p>
          </div>

          <div className="card">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Secure & Private</h3>
            <p className="text-gray-400">
              Your code is processed securely and never stored without your permission. We use
              Firebase Authentication for secure user management.
            </p>
          </div>

          <div className="card">
            <Code2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Multi-Language Support</h3>
            <p className="text-gray-400">
              Support for JavaScript, TypeScript, Python, Java, C#, Go, Rust, and more.
              Get relevant feedback regardless of your language choice.
            </p>
          </div>

          <div className="card">
            <Cloud className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Cloud-Based</h3>
            <p className="text-gray-400">
              Access your code reviews from anywhere. All hosted on reliable, free-tier
              cloud infrastructure.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card">
          <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Frontend</h3>
              <ul className="space-y-2">
                {techStack.frontend.map((tech, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-gray-300">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Backend</h3>
              <ul className="space-y-2">
                {techStack.backend.map((tech, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-gray-300">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Deployment</h3>
              <ul className="space-y-2">
                {techStack.deployment.map((tech, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-gray-300">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
