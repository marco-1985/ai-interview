import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Home = ({ user }) => {
  const [email, setEmail] = useState('');

  const features = [
    {
      name: 'AI-Powered Questions',
      description: 'Smart question generation based on your field and experience level',
      icon: SparklesIcon,
      color: 'from-blue-500 to-purple-600',
      route: '/ai-questions',
    },
    {
      name: 'Real-time Feedback',
      description: 'Get instant analysis of your answers with detailed insights',
      icon: ChartBarIcon,
      color: 'from-green-500 to-teal-600',
      route: '/feedback',
    },
    {
      name: 'Mock Interviews',
      description: 'Practice with realistic interview scenarios and time constraints',
      icon: AcademicCapIcon,
      color: 'from-orange-500 to-red-600',
      route: '/mock-test',
    },
    {
      name: 'Progress Tracking',
      description: 'Monitor your improvement over time with detailed analytics',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-pink-600',
      route: '/progress',
    },
    {
      name: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security',
      icon: ShieldCheckIcon,
      color: 'from-indigo-500 to-blue-600',
      route: '/features',
    },
    {
      name: '24/7 Availability',
      description: 'Practice anytime, anywhere with our always-available platform',
      icon: ClockIcon,
      color: 'from-yellow-500 to-orange-600',
      route: '/features',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'Tech Corp',
      content: 'InterviewIQ helped me land my dream job! The AI feedback was invaluable.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Backend Engineer',
      company: 'StartupXYZ',
      content: 'The realistic interview scenarios prepared me for the real thing.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Data Analyst',
      company: 'DataFlow',
      content: 'I improved my confidence and skills dramatically with InterviewIQ.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      features: [
        '5 mock interviews per month',
        'Basic feedback',
        'Limited question categories',
        'Email support',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited mock interviews',
        'Advanced AI feedback',
        'All question categories',
        'Video recording',
        'Priority support',
        'Resume analysis',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Everything in Professional',
        'Custom question sets',
        'Team management',
        'API access',
        'Dedicated support',
        'White-label options',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                >
                  <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    AI-Powered Interview Practice
                  </span>
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Ace Your Next
                  <span className="gradient-text"> Interview</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Practice with AI-powered mock interviews, get instant feedback, 
                  and land your dream job with confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Get Started Free
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                      to="/features"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Learn More
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Go to Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                )}
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white dark:border-gray-900"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">10,000+</span> users interviewed
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="glassmorphism rounded-2xl p-8 shadow-2xl">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/9EOb0E0SlkI?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=9EOb0E0SlkI"
                      title="InterviewIQ Demo Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Mock Interview Simulation
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Live
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-3/4" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Experience realistic interview scenarios with AI-powered feedback
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full opacity-20"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full opacity-20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose InterviewIQ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to succeed in your interviews
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={feature.route}
                  className="block h-full p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center text-blue-600 dark:text-blue-400 mt-4">
                    View details
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of professionals who've landed their dream jobs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start practicing today and join thousands of successful candidates
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 w-full sm:w-64"
                />
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
