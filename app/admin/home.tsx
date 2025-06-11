import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "~/context/auth";
import { k } from "~/kit";
import { color } from "~/lib/color";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import { toast } from "~/lib/sonner";

export default function Screen() {
  const { session: sesh, signOut } = useAuth();
  const expo_device_token = useNotifStore((s) => s.data.expoPushToken);
  const logout = k.auth.logout.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      signOut();
    },
    onError: ({ message }) => toast.error(message),
  });
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              disabled={logout.isPending}
              onPress={() => {
                logout.mutate();
              }}
            >
              {logout.isPending ? (
                <ActivityIndicator
                  size={24}
                  color={`hsl(${color().destructive})`}
                />
              ) : (
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={`hsl(${color().destructive})`}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <ScrollView style={{ flex: 1 }} className="px-4 py-4">
        <Link asChild href={"/admin/scan"}>
          <Pressable className="rounded-lg px-4 shadow-lg py-4 bg-white active:bg-gray-100 flex-row items-center gap-2 mb-4">
            <MaterialIcons name="qr-code-scanner" size={28} color="black" />
            <Text className="text-xl ">Scan QR Pesanan</Text>
          </Pressable>
        </Link>
        {__DEV__ && (
          <Pressable
            onPress={() => {
              console.log(sesh?.token);
              console.log(expo_device_token);
            }}
            className="rounded-lg px-4 shadow-lg py-4 bg-white active:bg-gray-100 flex-row items-center gap-2"
          >
            <MaterialCommunityIcons
              name="clipboard-outline"
              size={28}
              color="black"
            />
            <Text className="text-xl ">Copy</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}
