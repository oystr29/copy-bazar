import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";
import Head from "expo-router/head";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { inferData } from "react-query-kit";
import { Skeleton } from "~/components/ui/skeleton";
import { k } from "~/kit";
import { color } from "~/lib/color";
import { relativeDate } from "~/lib/date";
import { toast } from "~/lib/sonner";
import { couponTitle, currency } from "~/lib/utils";

const Item = ({
  item,
}: {
  item: inferData<typeof k.coupon.shop>["data"][0];
}) => {
  const { showActionSheetWithOptions: show } = useActionSheet();
  const date = relativeDate(item.start_date, item.expiry_date);
  const client = useQueryClient();
  const buy = k.coupon.buy.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.invalidateQueries({ queryKey: k.coupon.shop.getKey() });
      await client.refetchQueries({ queryKey: k.coupon.all.getKey() });
      await client.refetchQueries({ queryKey: k.user.profile.getKey() });
    },
    onError: ({ message }) => toast.error(message),
  });
  return (
    <View className="bg-white flex flex-row  mb-2">
      <View className="w-20 h-auto p-3 flex items-center justify-center bg-primary/60  relative flex-col">
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
        <Text className="text-lg font-semibold">{couponTitle(item)}</Text>
        <Text className="text-sm">
          Min. Beli {currency(Number(item.min_purchase_amount)).value}
        </Text>
        <Text className="text-xs">{date}</Text>
        <Text className="text-xs">
          Harga:{" "}
          <Text className="text-primary">
            {item.shop.point_cost} point
          </Text>{" "}
        </Text>
      </View>
      <View className="flex flex-col items-center justify-center pr-4">
        {buy.isPending ? (
          <ActivityIndicator color={`${color().primary}`} />
        ) : (
          <Pressable
            onPress={() => {
              const options = ["Beli", "Batal"];
              show(
                {
                  title: `Mau Beli Kupon ${item.code}?`,
                  options,
                  cancelButtonIndex: 1,
                  tintColor: `hsl(${color().primary})`,
                  cancelButtonTintColor: `hsl(${color()["muted-foreground"]})`,
                },
                (index) => {
                  switch (index) {
                    case 0:
                      buy.mutate({ id: item.id });
                      break;
                    case 1:
                  }
                },
              );
            }}
            className="border-primary/60 border px-1.5 py-0.5"
            disabled={buy.isPending}
          >
            <Text className="text-sm text-primary/60">Beli</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default function Screen() {
  const { data, refetch, isRefetching, isLoading } = k.coupon.shop.useQuery();
  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        className="native:px-4 bg-mainBg web:pt-4"
      >
        <FlashList
          data={data?.data}
          estimatedItemSize={100}
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
          renderItem={({ item }) => <Item item={item} />}
        />
      </ScrollView>
    </>
  );
}

const Loading = () => {
  return (
    <View className="bg-white flex flex-row mb-2">
      <View className="w-20 h-auto p-3 flex items-center justify-center bg-primary/80  relative flex-col">
        <View className="h-4 w-3  bg-white rounded-r-full absolute left-0" />
        <MaterialCommunityIcons
          name="ticket-percent"
          size={32}
          color={`hsl(${color().background})`}
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
