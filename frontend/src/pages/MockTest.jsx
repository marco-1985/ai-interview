import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';

const MockTest = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState('BTECH');
  const [level, setLevel] = useState('INTERMEDIATE');
  const [type, setType] = useState('TECHNICAL');
  const [loading, setLoading] = useState(false);

  const startMockTest = async () => {
    try {
      setLoading(true);
      const response = await interviewService.startInterview({
        course,
        category: course,
        level,
        type,
      });
      const interviewId = response.data?._id || response.data?.id;
      navigate(`/interview/${interviewId}`);
    } catch (error) {
      console.error('Failed to start mock test:', error);
      alert('Unable to start mock test right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Mock Test</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Start a full 5-question AI interview simulation with real-time feedback.</p>

          <div className="space-y-4">
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="BTECH">BTech</option>
              <option value="MTECH">MTech</option>
              <option value="MCA">MCA</option>
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="FRESHER">Fresher</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERIENCED">Experienced</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
              <option value="TECHNICAL">Technical</option>
              <option value="HR">HR</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>

          <button
            onClick={startMockTest}
            disabled={loading}
            className="mt-6 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Mock Test'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MockTest;
