'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, TrendingUp, Sparkles, Wallet, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { config } from '@/lib/config';

export function WelcomeScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Heart,
      title: 'Daily Mood Tracking',
      description: 'Log your emotions and identify patterns in your mental wellness journey.',
    },
    {
      icon: Brain,
      title: 'Coping Mechanisms',
      description: 'Access a curated library of techniques to build resilience and manage stress.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Insights',
      description: 'Visualize your emotional growth with detailed analytics and trends.',
    },
    {
      icon: Sparkles,
      title: 'Premium Features',
      description: 'Unlock advanced coping techniques and AI-powered personalized insights.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="container-app">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {config.app.name}
            </h1>
            <p className="text-xl text-white/80">
              {config.app.description}
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="glass-card p-4"
            >
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Get Started
            </h2>
            <p className="text-white/70">
              Connect your wallet or Farcaster account to begin your resilience journey
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4"
          >
            {isLoading ? (
              <div className="loading-spinner w-5 h-5" />
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </>
            )}
          </button>

          {config.features.enableFarcasterIntegration && (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full btn-secondary flex items-center justify-center gap-3 py-4"
            >
              {isLoading ? (
                <div className="loading-spinner w-5 h-5" />
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Connect with Farcaster
                </>
              )}
            </button>
          )}

          <div className="text-center">
            <p className="text-xs text-white/50">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="font-semibold text-white mb-4 text-center">
            Why Choose EmotiBuild?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-white/80">
                Science-backed coping mechanisms
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-sm text-white/80">
                Privacy-first approach to mental health
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-400 rounded-full" />
              <span className="text-sm text-white/80">
                Web3-native with micro-transaction support
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm text-white/80">
                Seamless Farcaster integration
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-white/40">
            Built with ❤️ for the Base ecosystem
          </p>
        </motion.div>
      </div>
    </div>
  );
}
