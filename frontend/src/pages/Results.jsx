import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DocumentArrowDownIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { interviewService } from '../services/interviewService';

const Results = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const resultsResponse = await interviewService.getResults(id);
      const interviewResponse = await interviewService.getInterviewById(id);
      
      setResults(resultsResponse.data);
      setInterview(interviewResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      navigate('/dashboard');
    }
  };

  const downloadReport = () => {
    // Implement PDF download functionality
    alert('PDF download feature coming soon!');
  };

  const shareResults = () => {
    // Implement share functionality
    alert('Share feature coming soon!');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Interview Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {interview?.category?.replace('_', ' ')} - {interview?.level?.replace('_', ' ')}
            </p>
          </div>

          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center">
              <div className="mb-6">
                {results?.passFail ? (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <XCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {results?.passFail ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You {results?.passFail ? 'passed' : 'did not pass'} the interview
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Score</p>
                  <p className={`text-4xl font-bold ${getScoreColor(results?.overallScore)}`}>
                    {results?.overallScore || 0}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Grade</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {results?.grade || 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(results?.overallScore)}`}>
                    {results?.passFail ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={shareResults}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share Results
                </button>
              </div>
            </div>
          </motion.div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Performance Breakdown
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {results?.confidenceScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results?.confidenceScore || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Communication
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {results?.communicationScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results?.communicationScore || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Technical
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {results?.technicalScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results?.technicalScore || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Problem Solving
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {results?.problemSolvingScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results?.problemSolvingScore || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                AI Feedback
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <ArrowUpIcon className="w-4 h-4 text-green-500 mr-2" />
                    Strengths
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {results?.strengths || 'No specific strengths identified.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <ArrowDownIcon className="w-4 h-4 text-red-500 mr-2" />
                    Areas for Improvement
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {results?.weaknesses || 'No specific areas for improvement identified.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <ChartBarIcon className="w-4 h-4 text-blue-500 mr-2" />
                    Recommendations
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {results?.improvements || 'Continue practicing to improve your skills.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <ChartBarIcon className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Practice Again</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start a new interview</p>
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <CheckCircleIcon className="w-8 h-8 text-green-500 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">View Progress</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your improvement</p>
                </button>

                <button
                  onClick={() => navigate('/features')}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <ArrowUpIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <p className="font-medium text-gray-900 dark:text-white">Upgrade</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlock premium features</p>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
