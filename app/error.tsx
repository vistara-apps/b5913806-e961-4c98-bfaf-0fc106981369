'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('EmotiBuild error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="glass-card p-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h2>
          
          <p className="text-text-secondary mb-6">
            We encountered an error while loading EmotiBuild. This might be a temporary issue.
          </p>
          
          <button
            onClick={reset}
            className="btn-primary w-full py-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <div className="mt-4 text-xs text-text-secondary">
            If the problem persists, please try refreshing the page.
          </div>
        </div>
      </div>
    </div>
  );
}
