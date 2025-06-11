import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header, useHeader } from "~/components/layout/header";
import { Button } from "~/components/ui/button";
import { color } from "~/lib/color";

export default function Screen() {
  const { paddingTop } = useHeader();
  return (
    <>
      <Header title="Task Point" />
      <ScrollView style={{ flex: 1, paddingTop }} className="px-4">
        <View className="rounded-lg bg-zinc-100 py-5 px-8 flex flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-semibold">Point Anda</Text>
            <View className="flex flex-row items-center gap-1">
              <Text className="text-lg font-semibold">200,000 rb</Text>
              <Text className="text-gray-700 text-sm font-medium">
                = Rp 200,000
              </Text>
            </View>
          </View>
          <Button>
            <Text className="text-white">Gunakan Point</Text>
          </Button>
        </View>
        <View>
          <Text className="text-sm font-medium">Reward Harian</Text>
          <View className="rounded-lg bg-zinc-100 py-4 px-5">
            <View className="flex flex-row justify-between border-b pb-3 mb-2 border-b-zinc-200">
              <View className="basis-1/2">
                <Text className="text-lg font-semibold">
                  Selesaikan tugas hari ini dan dapatkan
                </Text>
                <View className="flex-row items-end">
                  <Text className="text-2xl font-semibold text-primary/80">
                    Rp 2000
                  </Text>
                  <Text className="text-xs text-primary/60">2000 (poin)</Text>
                </View>
              </View>
              <View className="rotate-[11deg] basis-1/2 flex flex-row justify-end">
                <Image
                  style={{ width: 77 / 2, height: 92 / 2 }}
                  source={require("../../assets/images/logoapp.png")}
                />
              </View>
            </View>
            <View className="flex flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-medium">
                  ketik 6 pencarian{" "}
                  <Text className="text-primary/80 font-semibold">
                    2000 Poin
                  </Text>{" "}
                </Text>
              </View>
              <Button className="w-28">
                <Text className="text-white">Cari</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
