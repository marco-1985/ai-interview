import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      name: 'AI-Powered Questions',
      description: 'Smart question generation based on your field and experience level',
      icon: SparklesIcon,
      route: '/ai-questions',
      cta: 'Open AI Questions',
    },
    {
      name: 'Mock Test',
      description: 'Start a complete AI interview simulation with 5 unique questions',
      icon: ClipboardDocumentListIcon,
      route: '/mock-test',
      cta: 'Start Mock Test',
    },
    {
      name: 'Real-time Feedback',
      description: 'Get instant analysis of your answers with detailed insights',
      icon: ChartBarIcon,
      route: '/feedback',
      cta: 'View Feedback',
    },
    {
      name: 'Progress Tracking',
      description: 'Track scores, pass rate, and long-term interview growth',
      icon: ShieldCheckIcon,
      route: '/progress',
      cta: 'Open Progress',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to ace your next interview
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
              <Link
                to={feature.route}
                className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                {feature.cta}
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
