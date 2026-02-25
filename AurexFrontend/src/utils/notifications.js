import * as Notifications from 'expo-notifications';
import { Vibration, Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Please enable notifications to receive price alerts');
    return false;
  }
  return true;
}

/** Alarm-style alert: beep + vibration + blocking in-app alert. */
export function triggerAlarm(title, body) {
  // Play device notification sound (beep) so user hears it immediately
  Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  }).catch(() => {});

  // Triple buzz pattern – alarm-like
  const ALARM_PATTERN = [0, 500, 200, 500, 200, 500];
  if (Vibration.vibrate) Vibration.vibrate(ALARM_PATTERN);

  Alert.alert(title, body, [{ text: 'OK' }]);
}

export async function sendAlert(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}