import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const LoadingSpinner = ({ message = "AI is analyzing..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative"
      >
        <Brain className="w-12 h-12 text-primary" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 space-y-2 text-center"
      >
        <p className="text-gray-300 font-medium">{message}</p>
        <div className="flex space-x-1 justify-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        </div>
      </motion.div>

      <div className="mt-6 max-w-md">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="space-y-2">
            <LoadingBar delay={0} />
            <LoadingBar delay={0.3} />
            <LoadingBar delay={0.6} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingBar = ({ delay }) => {
  return (
    <motion.div
      initial={{ width: "0%" }}
      animate={{ width: ["0%", "100%", "0%"] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="h-1.5 bg-primary/30 rounded-full"
    />
  );
};

export default LoadingSpinner;
