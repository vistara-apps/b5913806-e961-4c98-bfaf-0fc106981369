/**
 * Application Configuration
 * Centralized configuration management for EmotiBuild
 */

export const config = {
  // App Information
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'EmotiBuild',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Build resilience, one emotion at a time',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    version: '1.0.0',
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Privy Configuration (Web3 Auth)
  privy: {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    appSecret: process.env.PRIVY_APP_SECRET,
  },

  // Neynar Configuration (Farcaster)
  neynar: {
    apiKey: process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
    apiSecret: process.env.NEYNAR_API_SECRET,
    baseUrl: 'https://api.neynar.com/v2',
  },

  // OnchainKit Configuration
  onchainkit: {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!,
  },

  // Blockchain Configuration
  blockchain: {
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8453'),
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org',
    networkName: 'Base',
  },

  // Redis Configuration
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },

  // Feature Flags
  features: {
    enablePremiumFeatures: process.env.NEXT_PUBLIC_ENABLE_PREMIUM_FEATURES === 'true',
    enableFarcasterIntegration: process.env.NEXT_PUBLIC_ENABLE_FARCASTER_INTEGRATION === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },

  // Premium Features Configuration
  premium: {
    // Pricing in USD cents
    copingMechanismPack: 299, // $2.99
    advancedAnalytics: 499, // $4.99
    personalizedInsights: 799, // $7.99
    
    // Free tier limits
    freeTier: {
      maxMoodEntries: 50,
      maxCopingMechanisms: 5,
      maxAnalyticsDays: 7,
    },
  },

  // API Rate Limits
  rateLimits: {
    moodEntry: 10, // per minute
    copingMechanism: 20, // per minute
    farcasterPost: 5, // per minute
  },

  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 4000,
    maxRecentEntries: 10,
  },
} as const;

// Validation function to ensure required environment variables are set
export function validateConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_PRIVY_APP_ID',
    'NEXT_PUBLIC_NEYNAR_API_KEY',
    'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Development mode check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
