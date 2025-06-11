import { Platform } from "react-native";
import { create } from "zustand";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

type State = {
  data: {
    expoPushToken?: string;
    notification?: Notifications.Notification;
    notificationListener?: Notifications.Subscription;
    responseListener?: Notifications.Subscription;
  };
};
interface SessionState extends State {
  sendPushNotification: (expoPushToken?: string) => Promise<void>;
  registerForPushNotificationsAsync: (
    pressed?: boolean,
  ) => Promise<string | undefined>;
  setData: (data: State["data"]) => void;
  reset: () => void;
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

const useNotifStore = create<SessionState>()((set) => ({
  data: {
    expoPushToken: undefined,
  },
  sendPushNotification: async (expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Notifikasi ",
      body: "Halo halo 😆",
      data: { name: "oystr" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  },
  registerForPushNotificationsAsync: async (pressed?: boolean) => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus, granted } =
        await Notifications.getPermissionsAsync();
      // const statusStorage = await AsyncStorage.getItem("notif_permissions");
      let finalStatus = existingStatus;
      if (!granted /* && (!statusStorage || pressed) */) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        // await AsyncStorage.setItem("notif_permissions", status);
      }

      if (finalStatus !== "granted") {
        console.log(
          "Permission not granted to get push token for push notification!",
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        console.warn("project id not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        // console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        console.error(e);
      }
    } else {
      console.warn("must use physical device for push notifications");
    }
  },
  setData: (data) =>
    set((state) => ({
      data: {
        ...state.data,
        ...data,
      },
    })),
  reset: () => set({ data: undefined }),
}));

export { useNotifStore };
