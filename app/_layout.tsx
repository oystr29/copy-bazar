import "../global.css";
import "react-day-picker/src/style.css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { DefaultTheme, Theme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { maxWidth, NAV_THEME } from "~/lib/contants";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Image, Platform, View } from "react-native";
import { Provider } from "~/context/auth";
import * as Notifications from "expo-notifications";
import { storage } from "~/lib/storage";
import { Session } from "~/kit/auth/schema";
import { setAxiosAuth } from "~/lib/axios";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import * as SplashScreen from "expo-splash-screen";
import { Toaster } from "~/lib/sonner";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchInterval: 60000, refetchOnMount: false },
  },
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [loadedUser, setLoadedUser] = useState<Session | null>(null);
  const setNotifData = useNotifStore((s) => s.setData);

  const registerForPushNotificationsAsync = useNotifStore(
    (s) => s.registerForPushNotificationsAsync,
  );

  const notificationListener = useNotifStore(
    (s) => s.data.notificationListener,
  );
  const responseListener = useNotifStore((s) => s.data.responseListener);

  const getUserFromStorage = async () => {
    const user = storage.getString("user");
    if (user) {
      const u = JSON.parse(user) as Session;
      setAxiosAuth(u.token);
      setLoadedUser(u);
    }
    setIsReady(true);
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    getUserFromStorage();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setNotifData({ expoPushToken: token ?? undefined }))
      .catch((_) => setNotifData({ expoPushToken: undefined }));

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

  if (!isReady)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ECEDEE",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../assets/images/adaptive-icon.png")}
        />
      </View>
    );

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <KeyboardProvider>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider value={LIGHT_THEME}>
                  <Provider userCredentials={loadedUser}>
                    {Platform.OS === "web" ? (
                      <View
                        className="bg-mainBg"
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            width: "100%",
                            maxWidth: maxWidth,
                          }}
                        >
                          <Stack
                            screenOptions={{
                              headerShown: false,
                            }}
                          />
                        </View>
                      </View>
                    ) : (
                      <Stack
                        screenOptions={{
                          headerShown: false,
                        }}
                      />
                    )}
                    <Toaster
                      richColors={Platform.OS === "web"}
                      theme="light"
                      closeButton
                      // @ts-ignore
                      position={
                        Platform.OS === "web" ? "top-right" : "top-center"
                      }
                    />
                  </Provider>
                  <StatusBar style="light" />
                </ThemeProvider>
              </QueryClientProvider>
            </KeyboardProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
        <PortalHost />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
