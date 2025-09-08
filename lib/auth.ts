/**
 * Authentication and Web3 Integration
 * Handles Privy authentication and wallet connections
 */

import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { config } from './config';

// Wagmi configuration for Base network
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(config.blockchain.rpcUrl),
  },
});

// Query client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
});

// Privy configuration
export const privyConfig = {
  appId: config.privy.appId,
  config: {
    loginMethods: ['wallet', 'farcaster'],
    appearance: {
      theme: 'dark',
      accentColor: '#8B5CF6',
      logo: '/logo.png',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      requireUserPasswordOnCreate: false,
    },
    farcaster: {
      enabled: config.features.enableFarcasterIntegration,
    },
  },
};

// Authentication hook
export function useAuth() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    linkFarcaster,
    unlinkFarcaster,
    createWallet,
  } = usePrivy();

  const { wallets } = useWallets();

  return {
    // Auth state
    isReady: ready,
    isAuthenticated: authenticated,
    user,
    
    // Wallet info
    wallets,
    primaryWallet: wallets[0],
    
    // Auth actions
    login,
    logout,
    
    // Farcaster actions
    linkFarcaster,
    unlinkFarcaster,
    
    // Wallet actions
    createWallet,
    
    // User info helpers
    getUserId: () => user?.id,
    getFarcasterId: () => user?.farcaster?.fid,
    getWalletAddress: () => wallets[0]?.address,
    getUsername: () => user?.farcaster?.username || user?.wallet?.address?.slice(0, 8),
    getAvatarUrl: () => user?.farcaster?.pfp,
    
    // Premium status
    isPremium: () => {
      // This would be determined by checking user's premium status in database
      // For now, return false as default
      return false;
    },
  };
}

// Farcaster integration utilities
export class FarcasterService {
  private static baseUrl = config.neynar.baseUrl;
  private static apiKey = config.neynar.apiKey;

  static async getUserByFid(fid: number) {
    try {
      const response = await fetch(`${this.baseUrl}/user/bulk?fids=${fid}`, {
        headers: {
          'api_key': this.apiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.users[0];
    } catch (error) {
      console.error('Error fetching Farcaster user:', error);
      throw error;
    }
  }

  static async publishCast(text: string, fid: number, signerUuid: string) {
    try {
      const response = await fetch(`${this.baseUrl}/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': this.apiKey,
        },
        body: JSON.stringify({
          signer_uuid: signerUuid,
          text,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to publish cast: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error publishing cast:', error);
      throw error;
    }
  }

  static async getFrameMetadata(url: string) {
    return {
      'fc:frame': 'vNext',
      'fc:frame:image': `${config.app.url}/api/frame/image`,
      'fc:frame:button:1': 'Log Mood',
      'fc:frame:button:2': 'View Progress',
      'fc:frame:post_url': `${config.app.url}/api/frame/action`,
    };
  }
}

// Premium features utilities
export class PremiumService {
  static async checkPremiumStatus(userId: string): Promise<boolean> {
    try {
      // This would check the user's premium status in the database
      // For now, return false as default
      return false;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  static async purchasePremium(userId: string, feature: string): Promise<boolean> {
    try {
      // This would handle the premium purchase flow
      // Integration with payment processor would go here
      console.log(`Purchasing premium feature ${feature} for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error purchasing premium:', error);
      return false;
    }
  }

  static getPremiumFeatures() {
    return {
      copingMechanismPack: {
        name: 'Advanced Coping Mechanisms',
        description: 'Unlock 15+ premium coping techniques',
        price: config.premium.copingMechanismPack,
      },
      advancedAnalytics: {
        name: 'Advanced Analytics',
        description: 'Detailed insights and trends',
        price: config.premium.advancedAnalytics,
      },
      personalizedInsights: {
        name: 'AI-Powered Insights',
        description: 'Personalized recommendations',
        price: config.premium.personalizedInsights,
      },
    };
  }
}

// Error handling for authentication
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Handle specific Privy errors
    if (error.message.includes('User rejected')) {
      return 'Authentication was cancelled. Please try again.';
    }
    
    if (error.message.includes('Network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred during authentication.';
}

// Session management
export class SessionManager {
  private static readonly SESSION_KEY = 'emotibuild_session';
  
  static saveSession(sessionData: any) {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }
  
  static getSession() {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
  
  static clearSession() {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
}
