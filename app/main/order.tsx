import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { k } from "~/kit";
import { cn, currency } from "~/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { Skeleton } from "~/components/ui/skeleton";
import Svg, { G, Path } from "react-native-svg";
import { color } from "~/lib/color";
import { ScrollView } from "react-native-gesture-handler";
import { useRefreshOnFocus } from "~/lib/query";

const Status = ({ status }: { status: string }) => {
  return (
    <View
      className={cn(
        "px-1 py-0.5 rounded-full border",
        status === "pending" && "border-orange-500",
        status === "expire" && "border-gray-500",
        status === "settlement" && "border-green-500",
      )}
    >
      <Text
        className={cn(
          "text-xs",
          status === "pending" && "text-orange-500",
          status === "expire" && "text-gray-500",
          status === "settlement" && "text-green-500",
        )}
      >
        {status === "pending" && "Belum Bayar"}
        {status === "expire" && "Kadaluara"}
        {status === "settlement" && "Sudah Bayar"}
      </Text>
    </View>
  );
};

const Loading = () => {
  return (
    <>
      <View className="px-4 py-4 border-b border-b-border active:bg-gray-200">
        <View className="flex flex-row gap-1 mb-2">
          <Skeleton className={"w-28 h-5"} />
          <Skeleton className={"w-14 h-4 rounded-full"} />
        </View>
        <View className="flex flex-row justify-end">
          <Skeleton className={"w-28 h-5"} />
        </View>
        <View className="flex flex-row gap-2 flex-wrap">
          {[1, 2].map((it) => (
            <View
              key={`items-${it}`}
              className="border border-border px-2 py-2 rounded-lg flex flex-row basis-1/2"
            >
              <View className="flex flex-row gap-1">
                <Skeleton className={"h-12 w-12"} />
                <Image
                  style={{
                    height: 48,
                    width: 48,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Skeleton className={"h-4 flex-1 mb-1"} />
                  <Skeleton className={"h-3.5 flex-1 mb-1 "} />
                  <Skeleton className={"h-3.5 flex-1 mb-1 "} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default function Screen() {
  const router = useRouter();
  const { paddingTop } = useHeader();
  const { data, isLoading, refetch } = k.order.all.useQuery();

  useRefreshOnFocus(refetch);

  return (
    <>
      
      <Header title="Pesanan" disableBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingTop }}
        className="bg-white"
      >
        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={154}
          data={data?.data}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Loading />
                <Loading />
                <Loading />
              </>
            ) : (
              <View className="flex flex-col items-center justify-center gap-8">
                <Svg width={64} height={64} viewBox="0 0 24 24">
                  <G fill="none" fillRule="evenodd">
                    <Path d="m12.594 23.258-.012.002-.071.035-.02.004-.014-.004-.071-.036q-.016-.004-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427q-.004-.016-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092q.019.005.029-.008l.004-.014-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014-.034.614q.001.018.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z" />
                    <Path
                      fill={`hsl(${color().primary})`}
                      d="M12.916 3.244a3 3 0 0 0-1.832 0L4.55 5.34a1 1 0 0 0-.556.45L1.757 9.654a1 1 0 0 0 .56 1.453l7.14 2.292a1 1 0 0 0 1.171-.451l.372-.642v2.317a1 1 0 0 1-1.306.952l-5.838-1.873v3.278a2 2 0 0 0 1.388 1.905l5.84 1.872a3 3 0 0 0 1.832 0l5.84-1.872a2 2 0 0 0 1.389-1.905l-.002-3.278-5.837 1.873A1 1 0 0 1 13 14.622v-2.317l.371.642a1 1 0 0 0 1.171.45l7.141-2.29a1 1 0 0 0 .56-1.454L20.006 5.79a1 1 0 0 0-.556-.45zm2.953 3.048L12 7.533 8.13 6.292l3.564-1.144a1 1 0 0 1 .611 0z"
                    />
                  </G>
                </Svg>
                <Text className="text-lg font-medium">
                  Wah, kamu belum punya pesanan
                </Text>
                <Text className="">Yuk, lihat-lihat dulu produk yang ada</Text>
                <Pressable
                  onPress={() => router.navigate("/main/home")}
                  className="border-primary px-4 py-2 rounded-lg bg-white active:bg-gray-200 border"
                >
                  <Text className="text-primary">Lihat Product</Text>
                </Pressable>
              </View>
            )
          }
          renderItem={({ item }) => {
            return (
              <Link
                href={{
                  pathname: "/order/[id]",
                  params: { id: item.id, title: item.order_number },
                }}
                asChild
              >
                <Pressable className="px-4 py-4 border-b border-b-border active:bg-gray-200">
                  <View className="flex flex-row gap-1 mb-2">
                    <Text>{item.order_number}</Text>
                    <Status status={item.status} />
                  </View>
                  <View className="flex flex-row justify-end">
                    <Text>
                      Total:{" "}
                      <Text className="font-semibold">
                        {currency(item.total_amount).value}
                      </Text>{" "}
                    </Text>
                  </View>
                  <View className="flex flex-row gap-1 flex-wrap">
                    {item.items.map((it) => (
                      <View
                        key={`items-${it.id}`}
                        className="px-0.5 rounded-lg flex flex-row"
                      >
                        <View className="flex flex-row gap-1 border border-border rounded-lg px-2 py-2">
                          <Image
                            style={{
                              height: 48,
                              width: 48,
                            }}
                            contentFit="contain"
                            source={it.product_variant.cover_image}
                          />
                          <View>
                            <Text
                              numberOfLines={1}
                              className="text-sm truncate"
                            >
                              {it.product_variant.product_name}
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                              {it.product_variant.options
                                .map((o) => o.value)
                                .join(", ")}
                            </Text>
                            <Text className="text-sm">
                              {it.qty} x {currency(it.price).value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </Pressable>
              </Link>
            );
          }}
        />
        <View className="h-64 w-full" />
      </ScrollView>
    </>
  );
}
