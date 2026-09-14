import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationItem } from '../types';

export const NOTIFICATION_CHANNEL_ID = 'pride_festival_alerts';

/**
 * Initializes Android notification channels with high priority, vibration, and festive sound.
 */
export async function initializeNotificationChannels(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await LocalNotifications.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Pride Festival Announcements',
      description: 'Important festival announcements, aarti timing updates, and alerts',
      importance: 5, // High importance (shows popup heads-up banner on screen and plays sound)
      visibility: 1, // Visible on lockscreen
      sound: undefined, // Default system notification chime
      vibration: true,
      lights: true,
      lightColor: '#FF9933' // Saffron festive glow
    });
  } catch (err) {
    console.warn('Could not create Android notification channel:', err);
  }
}

/**
 * Requests notification permissions across both native Android and Web browsers
 */
export async function requestAllNotificationPermissions(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Request Local Notifications Permission (for Android 13+ POST_NOTIFICATIONS)
      const localPerm = await LocalNotifications.requestPermissions();
      return localPerm.display === 'granted';
    } catch (err) {
      console.warn('Error requesting native notification permissions:', err);
      return false;
    }
  }

  // Web Browser HTML5 Notification fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      } catch (err) {
        console.warn('Browser permission error:', err);
      }
    }
  }

  return false;
}

/**
 * Fires a native phone notification directly into the Android Status Bar / Notification Shade
 * (Works 100% natively on Android without requiring server/cloud/Firebase setup!)
 */
export async function triggerNativePhoneNotification(item: NotificationItem): Promise<void> {
  // 1. If running as native Android APK
  if (Capacitor.isNativePlatform()) {
    try {
      // Check permissions
      const permCheck = await LocalNotifications.checkPermissions();
      if (permCheck.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return;
      }

      // Generate a stable 32-bit positive integer ID for the notification
      const notifId = Math.abs(
        item.id.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      ) % 2147483647;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title: item.title,
            body: item.message,
            channelId: NOTIFICATION_CHANNEL_ID,
            smallIcon: 'ic_launcher_round',
            largeIcon: 'ic_launcher',
            schedule: { at: new Date(Date.now() + 100) }, // Fire immediately (100ms)
            extra: {
              sectionId: item.linkSectionId || 'home',
              type: item.type
            }
          }
        ]
      });
      return;
    } catch (err) {
      console.warn('Could not dispatch native LocalNotification:', err);
    }
  }

  // 2. Web Browser HTML5 Notification fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(item.title, {
          body: item.message,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: item.id
        });
      } catch (err) {
        console.warn('Could not dispatch browser Notification:', err);
      }
    }
  }
}
