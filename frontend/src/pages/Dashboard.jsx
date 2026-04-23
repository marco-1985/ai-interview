import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { interviewService } from '../services/interviewService';

const Dashboard = ({ user }) => {
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    passRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const courses = [
    { value: 'BTECH', label: 'BTech' },
    { value: 'MTECH', label: 'MTech' },
    { value: 'MCA', label: 'MCA' },
  ];

  const levels = [
    { value: 'FRESHER', label: 'Fresher' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'EXPERIENCED', label: 'Experienced' },
  ];

  const types = [
    { value: 'TECHNICAL', label: 'Technical' },
    { value: 'HR', label: 'HR' },
    { value: 'MIXED', label: 'Mixed' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [interviewResponse, resultResponse] = await Promise.all([
        interviewService.getUserInterviews(0, 20),
        interviewService.getResultsHistory(0, 50),
      ]);
      const interviewList = interviewResponse.data || [];
      const resultList = resultResponse.data || [];
      setInterviews(interviewList.slice(0, 5));

      const completedCount = interviewList.filter((item) => item.status === 'COMPLETED').length;
      const avgScore = resultList.length
        ? Math.round(resultList.reduce((sum, item) => sum + (item.overallScore || 0), 0) / resultList.length)
        : 0;
      const passCount = resultList.filter((item) => item.passFail).length;
      const passRate = resultList.length ? Math.round((passCount / resultList.length) * 100) : 0;

      setStats({
        totalInterviews: interviewList.length,
        completedInterviews: completedCount,
        averageScore: avgScore,
        passRate,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedCourse || !selectedLevel || !selectedType) {
      alert('Please select all interview parameters');
      return;
    }

    try {
      const response = await interviewService.startInterview({
        category: selectedCourse,
        course: selectedCourse,
        level: selectedLevel,
        type: selectedType,
        durationMinutes: 30,
      });
      
      navigate(`/interview/${response.data._id || response.data.id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  const statCards = [
    {
      title: 'Total Interviews',
      value: stats.totalInterviews,
      icon: CalendarIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed',
      value: stats.completedInterviews,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Pass Rate',
      value: `${stats.passRate}%`,
      icon: UserGroupIcon,
      color: 'from-orange-500 to-orange-600',
    },
  ];

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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ready to practice your interview skills?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Start Interview Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Start New Interview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select your level</option>
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select interview type</option>
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartInterview}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Start Interview
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recent Interviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Interviews
                </h2>
                <Link
                  to="/interview-history"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {interviews.length > 0 ? (
                  interviews.map((interview) => (
                    <div
                      key={interview._id || interview.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(interview.course || interview.category || 'GENERAL')?.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          interview.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : interview.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {interview.status?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{interview.level?.replace('_', ' ')}</span>
                        <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                      </div>

                      {interview.status === 'COMPLETED' ? (
                        <Link
                          to={`/results/${interview._id || interview.id}`}
                          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                          View Results
                        </Link>
                      ) : interview.status === 'IN_PROGRESS' ? (
                        <Link
                          to={`/interview/${interview._id || interview.id}`}
                          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                          Continue Interview
                        </Link>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No interviews yet. Start your first interview!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/ai-questions"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <CalendarIcon className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">AI Powered Questions</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate fresh AI questions</p>
                </div>
              </Link>

              <Link
                to="/mock-test"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Mock Test</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attempt full interview simulation</p>
                </div>
              </Link>

              <Link
                to="/feedback"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChartBarIcon className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Feedback & Progress</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">See AI feedback and growth</p>
                </div>
              </Link>
            </div>
            <div className="mt-4">
              <Link
                to="/progress"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open detailed progress tracking
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
