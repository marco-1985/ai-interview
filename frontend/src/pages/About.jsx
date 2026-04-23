import { motion } from 'framer-motion';
import { AcademicCapIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const About = () => {
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
            About InterviewIQ
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Empowering job seekers with AI-powered interview practice to help them land their dream jobs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <AcademicCapIcon className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To democratize interview preparation by providing accessible, AI-powered practice for everyone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <UserGroupIcon className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Team</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Founded by experienced professionals from tech companies who understand the interview process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <ChartBarIcon className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Impact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Helped thousands of candidates improve their interview skills and land their dream jobs.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
