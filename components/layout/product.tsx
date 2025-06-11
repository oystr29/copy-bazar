import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Platform, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { cn, shortRp } from "~/lib/utils";
import { inferData } from "react-query-kit";
import { k } from "~/kit";
import { Link } from "expo-router";
import { Skeleton } from "../ui/skeleton";

type Product = inferData<typeof k.product.all>["data"][number];

const isWeb = Platform.OS === "web";

const ProductItem = ({ item, index }: { item: Product; index: number }) => {
  return (
    <Link
      asChild
      href={{
        pathname: `/product/[id]`,
        params: { id: item.id, title: item.name },
      }}
    >
      <Pressable
        style={{
          marginLeft: index % 2 !== 0 ? 5 : undefined,
          marginRight: index % 2 === 0 ? 5 : undefined,
          flex: 1,
          // maxWidth: isWeb ? 184 : undefined,
          // minWidth: isWeb ? 184 : undefined,
        }}
        className={cn(
          "rounded-2xl p-2 border border-primary mb-5 relative active:bg-gray-200 web:hover:bg-gray-100",
        )}
      >
        <View className="relative">
          <View style={{ height: 134 }}>
            <Image
              source={item.image}
              style={{ height: 134, borderRadius: 15, marginBottom: 6 }}
              contentFit="contain"
              contentPosition={"top"}
            />
          </View>
        </View>
        <Text className="font-medium mb-2 truncate" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex flex-row items-center justify-between">
          {/* <View className="flex flex-row items-center justify-between gap-1">
            <Text className="text-[10px] text-gray-600"> 50 stock tersedia</Text>
          </View> */}
          <View className="rounded px-2 py-1 bg-primary/25">
            <Text className="font-medium">{shortRp(item.price)}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const ProductLoading = () => {
  return (
    <View
      style={{
        // marginLeft: index % 2 !== 0 ? 5 : undefined,
        // marginRight: index % 2 === 0 ? 5 : undefined,
        flex: 1,
        // margin: 5,
      }}
      className="rounded-2xl p-2 border mb-5 relative"
    >
      <View className="relative">
        <Pressable className="bg-white rounded-lg p-2 absolute z-20 right-2 top-2">
          <MaterialCommunityIcons
            name="cards-heart-outline"
            size={14}
            color="black"
          />
        </Pressable>
        <View style={{ height: 134, width: "100%" }}>
          <Skeleton className={"h-[134px] w-full rounded-[15px] mb-1.5"} />
        </View>
      </View>
      <Skeleton className={"h-4 w-full my-4"} />
      <View className="flex flex-row items-center justify-between gap-4">
        <Skeleton className={"h-4 w-full flex-1"} />
        <Skeleton className={"h-8 w-10 rounded"} />
      </View>
    </View>
  );
};

const ProductList = (props: { data?: Product[]; isLoading?: boolean }) => {
  return (
    <>
      <FlashList
        showsVerticalScrollIndicator={false}
        data={props.data}
        estimatedItemSize={202}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          props.isLoading ? (
            <>
              <View className="flex flex-row gap-4 flex-wrap">
                <ProductLoading />
                <ProductLoading />
              </View>
              <View className="flex flex-row gap-4 flex-wrap">
                <ProductLoading />
                <ProductLoading />
              </View>
            </>
          ) : (
            <Text>Kosong</Text>
          )
        }
        horizontal={false}
        renderItem={(props) => {
          return <ProductItem {...props} />;
        }}
      />
    </>
  );
};

export { ProductList, ProductItem };
