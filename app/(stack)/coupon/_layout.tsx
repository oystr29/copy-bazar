import { Slot } from "expo-router";
import { Text, View } from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { k } from "~/kit";
import { currency } from "~/lib/utils";

export default function MaterialTopTabsLayout() {
  const { paddingTop } = useHeader();
  const { data } = k.user.profile.useQuery();
  return (
    <>
      
      <Header title="Kupon" />
      <View style={{ flex: 1, paddingTop }} className="">
        <View className="px-4">
          <View className="rounded-lg px-3 py-1 bg-gray-100 mb-4">
            <Text className="text-sm mb-1 text-black">Point Kamu</Text>
            <Text className="text-2xl font-semibold text-primary">
              {currency(data?.data.member.point).valueNoSymbol}
            </Text>
          </View>
        </View>
        <Slot />
      </View>
    </>
  );
}
