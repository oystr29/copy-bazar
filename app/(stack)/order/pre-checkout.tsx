import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { inferData, inferVariables } from "react-query-kit";
import { useDebounce } from "use-debounce";
import { Header, useHeader } from "~/components/layout/header";
import { Button } from "~/components/ui/button";
import { k } from "~/kit";
import { toast } from "~/lib/sonner";
import { currency } from "~/lib/utils";

export default function Screen() {
  const { paddingTop } = useHeader();
  const searchParams = useLocalSearchParams<{ query: string }>();
  const params = JSON.parse(searchParams.query) as inferVariables<
    typeof k.order.preCheckout
  >;
  const [variables] = useState(params);
  const [debounceParams] = useDebounce(variables, 600);

  const router = useRouter();
  const [order, setOrder] =
    useState<inferData<typeof k.order.preCheckout>["data"]>();
  const { data } = k.order.preCheckoutQuery.useQuery({
    variables: debounceParams,
  });

  const checkout = k.order.checkout.useMutation({
    onSuccess: async ({ message, data }) => {
      toast.success(message);
      router.replace({
        pathname: "/order/[id]",
        params: { id: data.order.id, title: data.order.order_number },
      });
    },
    onError: ({ message }) => {
      toast.error(message);
      console.error(message, "ini error gan");
    },
  });
  useEffect(() => {
    if (data) {
      setOrder(data.data);
    }
  }, [data]);

  return (
    <>
      
      <Header title="Checkout" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop, flex: 1 }}
        className="px-4  bg-mainBg"
      >
        <View className="bg-white border border-border p-3 flex flex-col gap-2 mb-4 rounded-lg">
          <Text className="font-semibold">
            {order?.user.name ?? "Alexander GT"}
          </Text>
          <Text className="">
            {order?.user.email ?? "Email: heheh@gmail.com"}
          </Text>
        </View>
        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          data={order?.order.items}
          renderItem={({ item }) => {
            return (
              <View className="bg-white border border-border p-3 flex flex-row gap-2 mb-4 rounded-lg">
                <View
                  style={{ flex: 1, height: 93, maxWidth: 98 }}
                  className="flex flex-row  rounded-lg items-center justify-center"
                >
                  <Image
                    style={{
                      height: 93,
                      width: "100%",
                      maxWidth: 98,
                      flex: 1,
                    }}
                    contentFit="contain"
                    source={item.item.cover_image}
                  />
                </View>
                <View
                  style={{ flex: 1 }}
                  className="flex flex-col justify-between"
                >
                  <View>
                    <Text className="text-lg font-medium">
                      {item.item.product_name}
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                      {item.item.options
                        .map((v) => `${v.variant.name} ${v.value}`)
                        .join(", ")}
                    </Text>
                    <Text>{currency(item.price).value}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text>Total {item.qty} Produk</Text>
                    <Text className="font-semibold">
                      {currency(item.total).value}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
        {/* Rincian */}
        <View className="bg-white border rounded-lg border-border p-3 flex flex-col gap-2 mb-4">
          <Text className="font-semibold text-lg">Rincian Pembayaran</Text>
          <View className="flex flex-row justify-between mb-1">
            <Text>Subtotal untuk Produk</Text>
            <Text>{currency(order?.order.subtotal).value}</Text>
          </View>
          {order?.additional_cost.map((cost, i) => (
            <View
              key={`${cost.item.id}-${cost.item.value}-${i}`}
              className="flex flex-row justify-between mb-1"
            >
              <Text>{cost.item.title}</Text>
              <Text>{currency(cost.up_price).value}</Text>
            </View>
          ))}
          {order?.additional_disc.map((disc, i) => (
            <View
              key={`${disc.item.id}-${disc.item.value}-${i}`}
              className="flex flex-row justify-between mb-1"
            >
              <Text>{disc.item.title}</Text>
              <Text className="text-destructive">
                {currency(-disc.disc_price).value}
              </Text>
            </View>
          ))}
          <View className="flex flex-row justify-between mt-4">
            <Text className="font-medium">Total Pembayaran</Text>
            <Text className="font-semibold">
              {currency(order?.total).value}
            </Text>
          </View>
        </View>
        <View className="h-40 w-full" />
      </ScrollView>
      <View
        className="pb-1 pt-3 px-4"
        style={{
          backgroundColor: "white",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.16,
          elevation: 20,
        }}
      >
        <Button
          onPress={() => {
            if (!data?.params) return;
            checkout.mutate(variables);
          }}
          disabled={checkout.isPending}
          className="flex flex-row items-center gap-1"
        >
          {checkout.isPending && <ActivityIndicator color={"#ffffff"} />}
          <Text className="text-white font-semibold">Belanja Sekarang</Text>
        </Button>
      </View>
    </>
  );
}
