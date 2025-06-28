import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, TrendingUp, Users, Star, Lock, Check } from 'lucide-react';

interface PremiumFeaturesProps {
  onUpgrade: () => void;
}

export function PremiumFeatures({ onUpgrade }: PremiumFeaturesProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep insights into your typing patterns and improvement areas',
      premium: true
    },
    {
      icon: Users,
      title: 'Multiplayer Races',
      description: 'Compete with friends and players worldwide in real-time',
      premium: true
    },
    {
      icon: Star,
      title: 'Custom Themes',
      description: 'Personalize your typing experience with premium themes',
      premium: true
    },
    {
      icon: Zap,
      title: 'AI-Powered Training',
      description: 'Personalized lessons based on your weaknesses',
      premium: true
    }
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$4.99',
      period: '/month',
      savings: null
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$39.99',
      period: '/year',
      savings: 'Save 33%'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-200 mb-4">TypingFlow Premium</h1>
        <p className="text-gray-400 text-lg">
          Unlock advanced features and take your typing to the next level
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-primary-600/20 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pricing */}
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Choose Your Plan</h2>
          
          {/* Plan Toggle */}
          <div className="inline-flex bg-dark-800 rounded-lg p-1">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {plan.name}
                {plan.savings && (
                  <span className="ml-2 text-xs bg-success-600 text-white px-2 py-1 rounded-full">
                    {plan.savings}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-gray-200">
              {plans.find(p => p.id === selectedPlan)?.price}
              <span className="text-lg text-gray-400">
                {plans.find(p => p.id === selectedPlan)?.period}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              'Unlimited typing tests',
              'Advanced analytics dashboard',
              'Multiplayer racing modes',
              'Custom themes and layouts',
              'AI-powered training plans',
              'Priority customer support',
              'Export detailed reports'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-success-400" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUpgrade}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Upgrade to Premium
          </motion.button>

          <p className="text-center text-gray-400 text-sm mt-4">
            7-day free trial • Cancel anytime • Secure payment
          </p>
        </div>
      </div>
    </motion.div>
  );
}