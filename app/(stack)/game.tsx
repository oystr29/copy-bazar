import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";
import { HeaderButton } from "~/components/ui/button";
import * as Linking from "expo-linking";

export default function Screen() {
  const { url, title } = useLocalSearchParams<{ title: string; url: string }>();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title,
          headerRight: () => {
            return (
              <HeaderButton
                onPress={() => {
                  Linking.openURL(url);
                }}
              >
                <MaterialCommunityIcons name="web" size={24} color="black" />
              </HeaderButton>
            );
          },
        }}
      />
      <WebView style={{ flex: 1 }} source={{ uri: url }} />
    </>
  );
}
