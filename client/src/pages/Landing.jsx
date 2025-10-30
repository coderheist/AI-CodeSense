import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Sparkles, TestTube2, MessageSquare, Shield, Zap, BarChart3, Github } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'AI Code Review',
      description: 'Get instant, intelligent code reviews with best practice suggestions',
    },
    {
      icon: <TestTube2 className="w-8 h-8" />,
      title: 'Test Generation',
      description: 'Automatically generate comprehensive test cases for your code',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'AI Chat Assistant',
      description: 'Interactive AI to explain, optimize, and debug your code',
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: 'Repository Analyzer',
      description: 'Analyze entire GitHub repositories with AI-powered insights',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Security Analysis',
      description: 'Detect potential security vulnerabilities and get fixes',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Performance Insights',
      description: 'Optimize your code for better performance',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Code Metrics',
      description: 'Track complexity, quality, and improvement over time',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-blue-500 bg-clip-text text-transparent">
              AI CodeSense
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Elevate your code quality with AI-powered reviews, test generation, and intelligent suggestions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-primary text-lg">
                Get Started Free
              </Link>
              <Link to="/about" className="btn-secondary text-lg">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to write better code</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:border-primary/50 transition-all group"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/30"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to improve your code?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of developers using AI CodeSense
            </p>
            <Link to="/login" className="btn-primary text-lg">
              Start Coding Smarter
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
