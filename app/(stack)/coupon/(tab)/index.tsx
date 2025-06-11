import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { ScrollView, Text, View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { k } from "~/kit";
import { color } from "~/lib/color";
import { relativeDate } from "~/lib/date";
import { couponTitle, currency } from "~/lib/utils";

export default function Screen() {
  const { data, refetch, isRefetching, isLoading } = k.coupon.all.useQuery();
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        className="native:px-4 bg-mainBg web:pt-4"
      >
        <FlashList
          showsVerticalScrollIndicator={false}
          data={data?.data}
          estimatedItemSize={84}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Loading />
                <Loading />
                <Loading />
              </>
            ) : (
              <View className="">
                <Text>Kamu belum punya kupon</Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const date = relativeDate(item.start_date, item.expiry_date);
            return (
              <View className="bg-white flex flex-row mb-2">
                <View className="w-20 h-auto p-3 flex items-center justify-center bg-primary/80  relative flex-col">
                  <View className="h-4 w-3  bg-white rounded-r-full absolute left-0" />
                  <MaterialCommunityIcons
                    name="ticket-percent"
                    size={32}
                    color={`hsl(${color().background})`}
                  />
                  <Text
                    numberOfLines={1}
                    className="text-xs font-semibold text-white truncate"
                  >
                    {item.code}
                  </Text>
                </View>
                <View className="flex-1 p-3">
                  <Text className="text-lg font-semibold">
                    {couponTitle(item)}
                  </Text>
                  <Text className="text-sm">
                    Min. Beli {currency(Number(item.min_purchase_amount)).value}
                  </Text>
                  <Text className="text-xs">{date}</Text>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </>
  );
}

const Loading = () => {
  return (
    <View className="bg-white flex flex-row shadow-lg mb-2">
      <View className="w-20 h-auto p-3 flex items-center justify-center bg-primary/80  relative flex-col">
        <View className="h-4 w-3  bg-white rounded-r-full absolute left-0" />
        <MaterialCommunityIcons
          name="ticket-percent"
          size={32}
          color={`${color().background}`}
        />
        <Skeleton className={"w-11 h-3"} />
      </View>
      <View className="flex-1 p-3">
        <Skeleton className={"w-52 h-6 mb-1"} />
        <Skeleton className={"w-24 h-5 mb-1"} />
        <Skeleton className={"w-16 h-4 mb-1"} />
      </View>
    </View>
  );
};
