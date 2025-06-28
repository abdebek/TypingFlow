import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, TrendingUp, Users, Star, Check, CreditCard, Loader } from 'lucide-react';
import { createStripeCheckout } from '../lib/supabase';
import { PREMIUM_PLANS } from '../lib/stripe';

interface PremiumFeaturesProps {
  onUpgrade: () => void;
}

export function PremiumFeatures({ onUpgrade }: PremiumFeaturesProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Analytics',
      description: 'Deep insights into your typing patterns with personalized recommendations',
      premium: true
    },
    {
      icon: Users,
      title: 'Multiplayer Racing',
      description: 'Compete with friends and players worldwide in real-time races',
      premium: true
    },
    {
      icon: Star,
      title: 'Custom Themes & Layouts',
      description: 'Personalize your typing experience with premium themes and keyboard layouts',
      premium: true
    },
    {
      icon: Zap,
      title: 'Advanced Training Plans',
      description: 'Structured learning paths designed by typing experts',
      premium: true
    }
  ];

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Monthly',
      price: '$4.99',
      period: '/month',
      savings: null,
      priceId: PREMIUM_PLANS.monthly.priceId
    },
    {
      id: 'yearly' as const,
      name: 'Yearly',
      price: '$39.99',
      period: '/year',
      savings: 'Save 33%',
      priceId: PREMIUM_PLANS.yearly.priceId
    }
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    try {
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (!selectedPlanData) throw new Error('Plan not found');

      const { url } = await createStripeCheckout(selectedPlanData.priceId);
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          Unlock advanced features and accelerate your typing journey
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
                onClick={() => setSelectedPlan(plan.id)}
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
              'AI-powered performance analysis',
              'Real-time multiplayer racing',
              'Custom themes and layouts',
              'Advanced training programs',
              'Detailed progress reports',
              'Priority customer support',
              'Export performance data'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-success-400" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: isProcessing ? 1 : 1.05 }}
            whileTap={{ scale: isProcessing ? 1 : 0.95 }}
            onClick={handleUpgrade}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              isProcessing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Upgrade to Premium</span>
              </>
            )}
          </motion.button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Secure payment via Stripe • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>
    </motion.div>
  );
}