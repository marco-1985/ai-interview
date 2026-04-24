import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { interviewService } from '../services/interviewService';

const InterviewRoom = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [answer, setAnswer] = useState('');
  const [lastFeedback, setLastFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoStream, setVideoStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchInterviewData();
    
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isStarted) {
      handleNextQuestion();
    }
  }, [timeRemaining, isStarted]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  const fetchInterviewData = async () => {
    try {
      const interviewResponse = await interviewService.getInterviewById(id);
      setInterview(interviewResponse.data);
      
      const questionsResponse = await interviewService.getQuestions({
        interviewId: id,
        course: interviewResponse.data.course,
        category: interviewResponse.data.category,
        level: interviewResponse.data.level,
        type: interviewResponse.data.type,
        count: 5
      });
      
      setQuestions(questionsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch interview data:', error);
      navigate('/dashboard');
    }
  };

  const handleStartInterview = async () => {
    try {
      await interviewService.updateInterviewStatus(id, 'IN_PROGRESS');
      setIsStarted(true);
      setCurrentQuestion(questions[0]);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const handleNextQuestion = async () => {
  
    if (currentQuestion && answer.trim()) {
      try {
        const submitResponse = await interviewService.submitAnswer(id, {
          questionId: currentQuestion.id,
          question: currentQuestion.questionText,
          userAnswer: answer,
          timeTaken: 120 - timeRemaining,
        });
        setLastFeedback(submitResponse.answerFeedback || null);
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setAnswer('');
      setLastFeedback(null);
      setTimeRemaining(120);
    } else {
    
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
  try {

    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setIsVideoEnabled(false);
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
      setIsAudioEnabled(false);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    await interviewService.completeInterview(id);

    
    navigate(`/results/${id}`);

  } catch (error) {
    console.error('Failed to complete interview:', error);
  }
};

  const toggleVideo = async () => {
    if (!isVideoEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        });
        setVideoStream(stream);
        setIsVideoEnabled(true);
        
    
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        console.log('Camera enabled');
      } catch (error) {
        console.error('Failed to enable camera:', error);
        alert('Failed to access camera. Please check permissions.');
      }
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
      setIsVideoEnabled(false);
      
    
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      console.log('Camera disabled');
    }
  };

  const toggleAudio = async () => {
    if (!isAudioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);
        setIsAudioEnabled(true);
        console.log('Microphone enabled');
      } catch (error) {
        console.error('Failed to enable microphone:', error);
        alert('Failed to access microphone. Please check permissions.');
      }
    } else {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      }
      setIsAudioEnabled(false);
      console.log('Microphone disabled');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);

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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">AI Interview Session</h1>
                <p className="text-blue-100">
                  {interview?.category?.replace('_', ' ')} - {interview?.level?.replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm text-blue-100">Question</p>
                  <p className="text-xl font-bold">{currentQuestionIndex + 1}/{questions.length}</p>
                </div>
                {isStarted && (
                  <div className="text-center">
                    <ClockIcon className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xl font-bold">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Video Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                {isVideoEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <VideoCameraIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Camera is off</p>
                  </div>
                )}
                
                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={toggleVideo}
                    className={`p-3 rounded-full ${
                      isVideoEnabled ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                    } hover:opacity-80 transition-opacity`}
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleAudio}
                    className={`p-3 rounded-full ${
                      isAudioEnabled ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'
                    } hover:opacity-80 transition-opacity`}
                  >
                    <MicrophoneIcon className="w-5 h-5" />
                  </button>
                  {isStarted && (
                    <button
                      onClick={toggleRecording}
                      className={`p-3 rounded-full ${
                        isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-300'
                      } hover:opacity-80 transition-opacity`}
                    >
                      {isRecording ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Question Section */}
              {isStarted && currentQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Question {currentQuestionIndex + 1}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {currentQuestion.questionText}
                    </p>
                  </div>

                  {/* Answer Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your answer here or use voice recording..."
                    />
                  </div>
                  {lastFeedback && (
                    <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Real-time AI Feedback: {lastFeedback.score}%
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        {lastFeedback.feedback}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Start Section */}
              {!isStarted && (
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ready to start your interview?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Make sure your camera and microphone are working properly before you begin.
                  </p>
                  <button
                    onClick={handleStartInterview}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Start Interview
                  </button>
                </div>
              )}
            </div>

            {/* AI Interviewer Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI Interviewer
                </h3>
                
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-white rounded-full" />
                  </div>
                  <p className="text-white text-center text-sm">AI Assistant</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I'm here to help you practice your interview skills. Take your time to answer each question thoughtfully.
                    </p>
                  </div>
                  
                  {isStarted && (
                    <>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Remember to speak clearly and structure your answers well.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Tips */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Be specific and provide examples</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Use the STAR method for behavioral questions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Stay calm and confident</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewRoom;
