'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
      <div className="glass-card p-6 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          We encountered an error while loading EmotiBuild. Please try again.
        </p>
        <button
          onClick={reset}
          className="btn-primary w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
