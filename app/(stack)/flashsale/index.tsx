import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Href, Link, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Button } from "~/components/ui/button";
import { color } from "~/lib/color";

const Header = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  return (
    <View
      className="bg-white mb-4"
      style={{
        paddingTop: top * 2,
        paddingHorizontal: 16,
        paddingBottom: 8,
        shadowOffset: {
          width: 0,
          height: 20,
        },
        shadowOpacity: 0.16,
        shadowRadius: 1.51,
        elevation: 20,
        borderBottomRightRadius: 28,
        borderBottomLeftRadius: 28,
      }}
    >
      <View className="flex flex-row items-center justify-between mb-4">
        <BorderlessButton onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={24}
            color={`hsl(${color().primary})`}
          />
        </BorderlessButton>
        <Text className="text-2xl font-semibold">FlashSale</Text>
        <Button size={"icon"} variant={"border-primary"}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={24}
            color={`hsl(${color().primary})`}
          />
        </Button>
      </View>
      <Pressable className="flex flex-row items-center justify-center gap-1 bg-[#F6F6F6] h-12 rounded-2xl mb-3.5">
        <AntDesign name="search1" size={20} color="hsl(122, 91%, 21%)" />
        <Text className="text-[#171717]/25">Search the entire product</Text>
      </Pressable>
    </View>
  );
};

const dataWoman: { href?: Href; discount: number; img: any; text: string }[] = [
  {
    href: "/main/home",
    discount: 30,
    img: require("../../../assets/images/woman1.webp"),
    text: "Pakaian Wanita",
  },
  {
    discount: 20,
    img: require("../../../assets/images/woman1.webp"),
    text: "Sepatu Wanita",
  },
  {
    discount: 50,
    img: require("../../../assets/images/woman1.webp"),
    text: "Fashion Muslim",
  },
  {
    discount: 30,
    img: require("../../../assets/images/woman1.webp"),
    text: "Tas Wanita",
  },
];

export default function Screen() {
  return (
    <>
      <Header />
      <ScrollView style={{ flex: 1 }} className="px-4">
        <View className="bg-white mt-5 shadow-lg rounded-lg py-4 px-2">
          <View className="flex flex-row items-center justify-center mb-5">
            <Text className="font-medium">Flash Sale Produk Wanita</Text>
          </View>
          <FlashList
            data={dataWoman}
            estimatedItemSize={100}
            numColumns={2}
            horizontal={false}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    margin: 5,
                    // height: 167,
                  }}
                  className="relative rounded-2xl border border-primary/60 flex flex-col justify-center items-center gap-4 px-4 pt-4 pb-2"
                >
                  <View className="absolute top-0 left-3 z-10 flex flex-col items-center justify-center w-[32px] h-[32px]">
                    <View className="absolute top-0 left-0">
                      <Svg
                        width={32}
                        height={41}
                        fill="none"
                        className="absolute top-0 left-0"
                      >
                        <Path
                          fill="#FF3737"
                          d="M0 2a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v36.026c0 1.643-1.872 2.585-3.192 1.606l-11.153-8.275a2 2 0 0 0-2.335-.034L3.144 39.809C1.818 40.733 0 39.784 0 38.169V2Z"
                        />
                      </Svg>
                    </View>
                    <Text className="text-base font-bold text-white">30%</Text>
                  </View>

                  <Image
                    contentFit="cover"
                    source={item.img}
                    style={{ height: 134, width: "100%" }}
                  />
                  <Text>{item.text}</Text>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}
