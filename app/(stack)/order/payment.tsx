import Constants from "expo-constants";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { WebView } from "react-native-webview";
import { registerForPushNotificationsAsync } from "~/lib/notifications";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import * as Notifications from "expo-notifications";

export default function Screen() {
  const { id, url } = useLocalSearchParams<{ id: string; url: string }>();
  const setNotifData = useNotifStore((s) => s.setData);
  const notif = useNotifStore((s) => s.data.notification);
  const notificationListener = useNotifStore(
    (s) => s.data.notificationListener,
  );
  const responseListener = useNotifStore((s) => s.data.responseListener);
  useEffect(() => {
    setNotifData({
      notificationListener: Notifications.addNotificationReceivedListener(
        (notification) => {
          setNotifData({ notification });
        },
      ),
    });

    setNotifData({
      responseListener: Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(response);
        },
      ),
    });

    return () => {
      notificationListener &&
        Notifications.removeNotificationSubscription(notificationListener);
      responseListener &&
        Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Pembayaran" }} />
      <WebView style={{ flex: 1 }} source={{ uri: url }} />
    </>
  );
}
