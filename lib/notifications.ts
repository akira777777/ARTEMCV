import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced Notification Management Utilities
 *
 * Advanced notification system with toast, snackbar, modal notifications,
 * and comprehensive user preferences.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loading';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  icon?: React.ReactNode;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  dismissible?: boolean;
  onDismiss?: () => void;
  createdAt: number;
  read?: boolean;
  category?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  soundVolume: number;
  vibration: boolean;
  categories: Record<string, boolean>;
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: number[];
  };
  maxNotifications: number;
  animation: boolean;
  position: Notification['position'];
}

export interface NotificationManager {
  add: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  remove: (id: string) => void;
  clear: () => void;
  dismiss: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getNotifications: () => Notification[];
  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
  getPreferences: () => NotificationPreferences;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced notification manager hook
 */
export function useNotifications(initialPreferences?: Partial<NotificationPreferences>) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    sound: true,
    soundVolume: 0.5,
    vibration: true,
    categories: {},
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
      days: [0, 6], // Weekend
    },
    maxNotifications: 50,
    animation: true,
    position: 'top-right',
  });

  const notificationQueue = useRef<Notification[]>([]);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const vibrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Initialize preferences
  useEffect(() => {
    if (initialPreferences) {
      setPreferences((prev) => ({ ...prev, ...initialPreferences }));
    }

    // Load from localStorage
    try {
      const saved = localStorage.getItem('notification-preferences');
      if (saved) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (error) {
      console.warn('Failed to load notification preferences:', error);
    }

    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save preferences to localStorage
  useEffect(() => {
    if (!mountedRef.current) return;

    try {
      localStorage.setItem('notification-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save notification preferences:', error);
    }
  }, [preferences]);

  // Check do not disturb
  const isDoNotDisturbActive = useCallback((): boolean => {
    if (!preferences.doNotDisturb.enabled) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startTime = preferences.doNotDisturb.startTime.split(':').map(Number);
    const endTime = preferences.doNotDisturb.endTime.split(':').map(Number);
    const startTimeMinutes = startTime[0] * 60 + startTime[1];
    const endTimeMinutes = endTime[0] * 60 + endTime[1];

    const isWeekendDay = preferences.doNotDisturb.days.includes(currentDay);
    const isWeekday = !isWeekendDay;

    if (isWeekendDay) {
      return currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
    } else {
      return currentTime >= startTimeMinutes || currentTime <= endTimeMinutes;
    }
  }, [preferences.doNotDisturb]);

  // Play notification sound
  const playSound = useCallback(() => {
    if (!preferences.sound || isDoNotDisturbActive()) return;

    try {
      if (!soundRef.current) {
        soundRef.current = new Audio();
        soundRef.current.src = '/notification-sound.mp3'; // Would need actual sound file
      }

      soundRef.current.volume = preferences.soundVolume;
      soundRef.current.play().catch((error) => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [preferences.sound, preferences.soundVolume, isDoNotDisturbActive]);

  // Vibrate device
  const vibrate = useCallback(() => {
    if (!preferences.vibration || !navigator.vibrate || isDoNotDisturbActive()) return;

    try {
      navigator.vibrate([100, 50, 100]);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }, [preferences.vibration, isDoNotDisturbActive]);

  // Add notification
  const add = useCallback(
    (notificationData: Omit<Notification, 'id' | 'createdAt'>): string => {
      if (!preferences.enabled || isDoNotDisturbActive()) {
        // Queue notification for later
        const queuedNotification = {
          ...notificationData,
          id: `queued-${Date.now()}`,
          createdAt: Date.now(),
        };
        notificationQueue.current.push(queuedNotification);
        return queuedNotification.id;
      }

      const newNotification: Notification = {
        ...notificationData,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, preferences.maxNotifications);
      });

      // Play sound and vibrate
      playSound();
      vibrate();

      // Auto-dismiss if not persistent
      if (
        !notificationData.persistent &&
        notificationData.duration &&
        notificationData.duration > 0
      ) {
        setTimeout(() => {
          dismiss(newNotification.id);
        }, notificationData.duration);
      }

      return newNotification.id;
    },
    [preferences, isDoNotDisturbActive, playSound, vibrate],
  );

  // Remove notification
  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  // Dismiss notification
  const dismiss = useCallback(
    (id: string) => {
      const notification = notifications.find((n) => n.id === id);
      if (notification) {
        notification.onDismiss?.();
        remove(id);
      }
    },
    [notifications, remove],
  );

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Get all notifications
  const getNotifications = useCallback(() => {
    return [...notifications];
  }, [notifications]);

  // Set preferences
  const setNotificationPreferences = useCallback(
    (newPreferences: Partial<NotificationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    },
    [],
  );

  // Get preferences
  const getNotificationPreferences = useCallback(() => {
    return { ...preferences };
  }, [preferences]);

  // Process queued notifications
  const processQueue = useCallback(() => {
    if (notificationQueue.current.length === 0) return;

    const queued = [...notificationQueue.current];
    notificationQueue.current = [];

    queued.forEach((notification) => {
      add(notification);
    });
  }, [add]);

  // Check for queued notifications when DND ends
  useEffect(() => {
    const checkQueue = () => {
      if (!isDoNotDisturbActive() && notificationQueue.current.length > 0) {
        processQueue();
      }
    };

    const interval = setInterval(checkQueue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isDoNotDisturbActive, processQueue]);

  return {
    notifications,
    preferences,
    add,
    remove,
    clear,
    dismiss,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getNotifications,
    setPreferences: setNotificationPreferences,
    getPreferences: getNotificationPreferences,
    isDoNotDisturbActive,
    processQueue,
  };
}

/**
 * Toast notification hook for simple messages
 */
export function useToast() {
  const { add, dismiss } = useNotifications();

  const showToast = useCallback(
    (message: string, options: Partial<Notification> = {}) => {
      return add({
        message,
        type: 'info',
        duration: 3000,
        dismissible: true,
        ...options,
      });
    },
    [add],
  );

  const showSuccess = useCallback(
    (message: string, options: Partial<Notification> = {}) => {
      return add({
        message,
        type: 'success',
        duration: 3000,
        dismissible: true,
        ...options,
      });
    },
    [add],
  );

  const showWarning = useCallback(
    (message: string, options: Partial<Notification> = {}) => {
      return add({
        message,
        type: 'warning',
        duration: 5000,
        dismissible: true,
        ...options,
      });
    },
    [add],
  );

  const showError = useCallback(
    (message: string, options: Partial<Notification> = {}) => {
      return add({
        message,
        type: 'error',
        duration: 0, // Don't auto-dismiss errors
        dismissible: true,
        ...options,
      });
    },
    [add],
  );

  const showLoading = useCallback(
    (message: string, options: Partial<Notification> = {}) => {
      return add({
        message,
        type: 'loading',
        persistent: true,
        dismissible: false,
        ...options,
      });
    },
    [add],
  );

  return {
    showToast,
    showSuccess,
    showWarning,
    showError,
    showLoading,
    dismiss,
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Notification utilities for common tasks
 */
export const notificationUtils = {
  /**
   * Create notification with default settings
   */
  createNotification: (
    type: Notification['type'],
    message: string,
    options: Partial<Notification> = {},
  ): Notification => {
    return {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      duration: type === 'error' ? 0 : 3000,
      persistent: type === 'loading',
      dismissible: type !== 'loading',
      createdAt: Date.now(),
      read: false,
      ...options,
    };
  },

  /**
   * Format notification time
   */
  formatTime: (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    return new Date(timestamp).toLocaleDateString();
  },

  /**
   * Get notification icon based on type
   */
  getIcon: (type: Notification['type']): string => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      case 'error':
        return '✗';
      case 'loading':
        return '⟳';
      default:
        return 'ℹ️';
    }
  },

  /**
   * Check if notification should be shown based on preferences
   */
  shouldShowNotification: (
    notification: Notification,
    preferences: NotificationPreferences,
  ): boolean => {
    if (!preferences.enabled) return false;
    if (!preferences.categories[notification.category || 'default']) return false;
    if (preferences.doNotDisturb.enabled && isDoNotDisturbActive(preferences)) return false;

    return true;
  },

  /**
   * Group notifications by category
   */
  groupByCategory: (notifications: Notification[]): Record<string, Notification[]> => {
    return notifications.reduce(
      (groups, notification) => {
        const category = notification.category || 'default';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(notification);
        return groups;
      },
      {} as Record<string, Notification[]>,
    );
  },
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Helper functions for notification management
 */
function isDoNotDisturbActive(preferences: NotificationPreferences): boolean {
  if (!preferences.doNotDisturb.enabled) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const startTime = preferences.doNotDisturb.startTime.split(':').map(Number);
  const endTime = preferences.doNotDisturb.endTime.split(':').map(Number);
  const startTimeMinutes = startTime[0] * 60 + startTime[1];
  const endTimeMinutes = endTime[0] * 60 + endTime[1];

  const isWeekendDay = preferences.doNotDisturb.days.includes(currentDay);
  const isWeekday = !isWeekendDay;

  if (isWeekendDay) {
    return currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
  } else {
    return currentTime >= startTimeMinutes || currentTime <= endTimeMinutes;
  }
}

/**
 * Browser notification API wrapper
 */
export const browserNotifications = {
  /**
   * Request notification permission
   */
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Browser does not support notifications');
    }

    return await Notification.requestPermission();
  },

  /**
   * Show browser notification
   */
  show: (title: string, options: NotificationOptions = {}): Notification | null => {
    if (!('Notification' in window)) return null;
    if (Notification.permission !== 'granted') return null;

    return new Notification(title, {
      icon: '/favicon.ico',
      ...options,
    });
  },

  /**
   * Check if notifications are supported
   */
  isSupported: (): boolean => {
    return 'Notification' in window;
  },

  /**
   * Get permission status
   */
  getPermission: (): NotificationPermission => {
    return 'Notification' in window ? Notification.permission : 'denied';
  },
};

export default {
  useNotifications,
  useToast,
  notificationUtils,
  browserNotifications,
};
