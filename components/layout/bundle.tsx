import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { shortRp } from "~/lib/utils";

const packetData = [
  {
    title: "Kaos Couple Boy and Girl Reguler Fit",
    rating: 4.9,
    stock: 15,
    price: 90000,
    source: require("../../assets/images/packet1.webp"),
  },
  {
    title: "Kaos Couple Boy and Girl Reguler Fit",
    rating: 4.9,
    stock: 15,
    price: 90000,
    source: require("../../assets/images/packet1.webp"),
  },
  {
    title: "Kaos Couple Boy and Girl Reguler Fit",
    rating: 4.9,
    stock: 15,
    price: 90000,
    source: require("../../assets/images/packet1.webp"),
  },
  {
    title: "Kaos Couple Boy and Girl Reguler Fit",
    rating: 4.9,
    stock: 15,
    price: 90000,
    source: require("../../assets/images/packet1.webp"),
  },
];

type Bundle = (typeof packetData)[number];

const BundleItem = ({ item, index }: { item: Bundle; index: number }) => {
  return (
    <View
      style={{
        marginLeft: index % 2 !== 0 ? 5 : undefined,
        marginRight: index % 2 === 0 ? 5 : undefined,
      }}
      className="rounded-2xl p-2 border border-primary mb-5 relative"
    >
      <View
        style={{ borderBottomRightRadius: 8, borderTopRightRadius: 8 }}
        className="w-11 h-5 rounded-l-lg bg-white flex flex-row items-center justify-center absolute left-0 top-1/2 z-30"
      >
        <AntDesign name="star" size={10} color="#FFB200" />
        <Text className="text-xs font-medium">{item.rating}</Text>
      </View>
      <View className="relative">
        <Pressable className="bg-white rounded-lg p-2 absolute z-20 right-2 top-2">
          <MaterialCommunityIcons
            name="cards-heart-outline"
            size={14}
            color="black"
          />
        </Pressable>
        <Image
          source={item.source}
          style={{ height: 134, borderRadius: 15, marginBottom: 6 }}
          contentFit="cover"
          contentPosition={"top"}
        />
      </View>
      <Text className="font-medium mb-2">{item.title}</Text>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center justify-between gap-1">
          <Svg width={10} height={11} fill="none">
            <Path
              stroke="#056708"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 6.417c0 .759 1.343 1.375 3 1.375s3-.616 3-1.375c0-.76-1.343-1.375-3-1.375s-3 .615-3 1.375Z"
            />
            <Path
              stroke="#056708"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 6.417V8.25c0 .759 1.343 1.375 3 1.375s3-.616 3-1.375V6.417M.5 2.75c0 .491.572.945 1.5 1.19a6.198 6.198 0 0 0 3 0c.928-.245 1.5-.699 1.5-1.19S5.928 1.805 5 1.56a6.198 6.198 0 0 0-3 0c-.928.245-1.5.699-1.5 1.19Z"
            />
            <Path
              stroke="#056708"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M.5 2.75v4.583c0 .407.386.665 1 .917"
            />
            <Path
              stroke="#056708"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M.5 5.042c0 .407.386.664 1 .916"
            />
          </Svg>
          <Text className="text-[8px] text-gray-600">
            {item.stock} stock tersedia
          </Text>
        </View>
        <View className="rounded px-2 py-1 bg-primary/25">
          <Text className="font-medium">{shortRp(item.price)}</Text>
        </View>
      </View>
    </View>
  );
};

const BundleList = () => {
  return (
    <>
      <FlashList
        data={packetData}
        estimatedItemSize={100}
        numColumns={2}
        horizontal={false}
        renderItem={(props) => {
          return <BundleItem {...props} />;
        }}
      />
    </>
  );
};

export { BundleList, BundleItem };
