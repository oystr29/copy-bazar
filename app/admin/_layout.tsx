import { Stack } from "expo-router";

export default function Screen() {
  return (
    <>
      <Stack>
        <Stack.Screen name="home" options={{ title: "Admin" }} />
        <Stack.Screen
          name="scan"
          options={{ title: "Admin", headerShown: false }}
        />
      </Stack>
    </>
  );
}
