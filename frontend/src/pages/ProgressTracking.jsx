import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { interviewService } from '../services/interviewService';

const ProgressTracking = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgScore: 0,
    passRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [interviewResponse, resultResponse] = await Promise.all([
          interviewService.getUserInterviews(0, 100),
          interviewService.getResultsHistory(0, 100),
        ]);

        const interviews = interviewResponse.data || [];
        const results = resultResponse.data || [];
        const completed = interviews.filter((item) => item.status === 'COMPLETED').length;
        const avgScore = results.length
          ? Math.round(results.reduce((sum, item) => sum + (item.overallScore || 0), 0) / results.length)
          : 0;
        const passRate = results.length
          ? Math.round((results.filter((item) => item.passFail).length / results.length) * 100)
          : 0;

        setStats({
          total: interviews.length,
          completed,
          avgScore,
          passRate,
        });
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading progress...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Progress Tracking</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg dark:border-gray-700"><p className="text-gray-600 dark:text-gray-300">Total Interviews</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p></div>
            <div className="p-4 border rounded-lg dark:border-gray-700"><p className="text-gray-600 dark:text-gray-300">Completed</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p></div>
            <div className="p-4 border rounded-lg dark:border-gray-700"><p className="text-gray-600 dark:text-gray-300">Average Score</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgScore}%</p></div>
            <div className="p-4 border rounded-lg dark:border-gray-700"><p className="text-gray-600 dark:text-gray-300">Pass Rate</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passRate}%</p></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracking;
