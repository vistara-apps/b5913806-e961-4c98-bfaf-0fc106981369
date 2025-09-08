import toast, { Toaster, ToastOptions } from 'react-hot-toast';

// Custom toast styles matching EmotiBuild design system
const defaultToastOptions: ToastOptions = {
  duration: 4000,
  position: 'top-center',
  style: {
    background: 'hsl(220 20% 14%)',
    color: 'hsl(220 10% 95%)',
    border: '1px solid hsl(220 20% 20%)',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 12px hsla(0, 0%, 0%, 0.1)',
  },
};

// Success toast
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      borderColor: 'hsl(150 65% 45%)',
      ...options?.style,
    },
    iconTheme: {
      primary: 'hsl(150 65% 45%)',
      secondary: 'hsl(220 20% 14%)',
    },
  });
};

// Error toast
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultToastOptions,
    duration: 6000, // Longer duration for errors
    ...options,
    style: {
      ...defaultToastOptions.style,
      borderColor: 'hsl(0 65% 55%)',
      ...options?.style,
    },
    iconTheme: {
      primary: 'hsl(0 65% 55%)',
      secondary: 'hsl(220 20% 14%)',
    },
  });
};

// Info toast
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      borderColor: 'hsl(220 89.8% 52.4%)',
      ...options?.style,
    },
    icon: 'ℹ️',
  });
};

// Warning toast
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      borderColor: 'hsl(30 80% 55%)',
      ...options?.style,
    },
    icon: '⚠️',
  });
};

// Loading toast
export const showLoadingToast = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      borderColor: 'hsl(220 89.8% 52.4%)',
      ...options?.style,
    },
  });
};

// Custom toast with emoji
export const showCustomToast = (
  message: string,
  emoji: string,
  options?: ToastOptions
) => {
  return toast(message, {
    ...defaultToastOptions,
    ...options,
    icon: emoji,
  });
};

// Mood-specific toasts
export const showMoodToast = (mood: string, message?: string) => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    excited: '🤩',
    calm: '😌',
    frustrated: '😤',
    grateful: '🙏',
    overwhelmed: '😵',
    content: '😊',
  };

  const emoji = moodEmojis[mood] || '💭';
  const defaultMessage = message || `Mood logged: ${mood}`;

  return showCustomToast(defaultMessage, emoji, {
    duration: 3000,
  });
};

// Coping mechanism toast
export const showCopingToast = (mechanismName: string, action: 'started' | 'completed' | 'favorited' | 'unfavorited') => {
  const actionEmojis = {
    started: '🌟',
    completed: '✅',
    favorited: '❤️',
    unfavorited: '💔',
  };

  const actionMessages = {
    started: `Started: ${mechanismName}`,
    completed: `Completed: ${mechanismName}`,
    favorited: `Added ${mechanismName} to favorites`,
    unfavorited: `Removed ${mechanismName} from favorites`,
  };

  return showCustomToast(
    actionMessages[action],
    actionEmojis[action],
    {
      duration: action === 'completed' ? 5000 : 3000,
    }
  );
};

// Streak toast
export const showStreakToast = (days: number) => {
  const getStreakEmoji = (days: number) => {
    if (days === 0) return '🌱';
    if (days < 7) return '🔥';
    if (days < 30) return '⚡';
    if (days < 100) return '🚀';
    return '👑';
  };

  const getStreakMessage = (days: number) => {
    if (days === 1) return 'Great start! 1 day streak';
    if (days === 7) return 'Amazing! 1 week streak!';
    if (days === 30) return 'Incredible! 1 month streak!';
    if (days === 100) return 'Legendary! 100 day streak!';
    return `${days} day streak!`;
  };

  return showCustomToast(
    getStreakMessage(days),
    getStreakEmoji(days),
    {
      duration: 5000,
    }
  );
};

// Achievement toast
export const showAchievementToast = (achievement: string) => {
  return showCustomToast(
    `Achievement unlocked: ${achievement}`,
    '🏆',
    {
      duration: 6000,
      style: {
        ...defaultToastOptions.style,
        borderColor: 'hsl(45 100% 50%)',
        background: 'linear-gradient(135deg, hsl(220 20% 14%) 0%, hsl(45 100% 5%) 100%)',
      },
    }
  );
};

// Sync status toasts
export const showSyncToast = (status: 'syncing' | 'success' | 'error', message?: string) => {
  const syncMessages = {
    syncing: message || 'Syncing data...',
    success: message || 'Data synced successfully',
    error: message || 'Sync failed. Data saved locally.',
  };

  const syncEmojis = {
    syncing: '🔄',
    success: '✅',
    error: '⚠️',
  };

  if (status === 'syncing') {
    return showLoadingToast(syncMessages[status]);
  } else if (status === 'success') {
    return showSuccessToast(syncMessages[status], { duration: 2000 });
  } else {
    return showWarningToast(syncMessages[status]);
  }
};

// Offline/Online status toasts
export const showConnectionToast = (isOnline: boolean) => {
  if (isOnline) {
    return showSuccessToast('Back online! Data will sync automatically.', {
      duration: 3000,
    });
  } else {
    return showWarningToast('You\'re offline. Changes will sync when reconnected.', {
      duration: 5000,
    });
  }
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Promise toast - shows loading, then success/error
export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...defaultToastOptions,
      ...options,
    }
  );
};

// Export the Toaster component with custom styling
export { Toaster };

// Default Toaster configuration
export const ToasterConfig = () => (
  <Toaster
    position="top-center"
    reverseOrder={false}
    gutter={8}
    containerClassName=""
    containerStyle={{}}
    toastOptions={defaultToastOptions}
  />
);
