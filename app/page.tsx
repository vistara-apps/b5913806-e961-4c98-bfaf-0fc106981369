'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAuth } from '@/lib/auth';
import { AppShell } from '@/components/AppShell';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { validateConfig } from '@/lib/config';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const { isReady, isAuthenticated } = useAuth();
  const [configValid, setConfigValid] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Signal that the frame is ready for interaction
    setFrameReady();
  }, [setFrameReady]);

  useEffect(() => {
    try {
      validateConfig();
      setConfigValid(true);
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Configuration error');
      console.error('Configuration validation failed:', error);
    }
  }, []);

  // Show loading screen while Privy is initializing
  if (!isReady) {
    return <LoadingScreen message="Initializing EmotiBuild..." />;
  }

  // Show configuration error if validation failed
  if (!configValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-400 mb-4">Configuration Error</h1>
          <p className="text-white/80 mb-4">
            {configError || 'Please check your environment configuration.'}
          </p>
          <p className="text-sm text-white/60">
            Make sure all required environment variables are set correctly.
          </p>
        </div>
      </div>
    );
  }

  // Show welcome screen for unauthenticated users
  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  // Show main app for authenticated users
  return <AppShell />;
}
