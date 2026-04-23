import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Pricing = () => {
  const plans = [
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your interview preparation needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 ${
                plan.highlighted ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
