export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <div className="text-white font-medium">Loading EmotiBuild...</div>
        <div className="text-sm text-white text-opacity-70">
          Building resilience, one emotion at a time
        </div>
      </div>
    </div>
  );
}
