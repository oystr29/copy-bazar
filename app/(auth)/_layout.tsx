import { Stack } from "expo-router";
import { useEffect } from "react";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import * as Notifications from "expo-notifications";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Auth",
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false, title: 'Masuk' }} />
      <Stack.Screen name="register" options={{ headerShown: false, title: 'Daftar' }} />
    </Stack>
  );
}
