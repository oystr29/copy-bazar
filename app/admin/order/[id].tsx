import { Stack, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { Button } from "~/components/ui/button";
import { k } from "~/kit";
import * as Linking from "expo-linking";
import { FlashList } from "@shopify/flash-list";
import { currency } from "~/lib/utils";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { paymentStatus } from "~/lib/payment";
import { Sheet, useSheetRef } from "~/components/ui/sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Skeleton, SkeletonLoad } from "~/components/ui/skeleton";
import { color } from "~/lib/color";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { toast } from "~/lib/sonner";

const Loading = () => {
  return (
    <>
      <View className="bg-white border border-border p-3 flex flex-row gap-2 mb-4 rounded-lg">
        <View
          style={{ flex: 1, height: 93, maxWidth: 98 }}
          className="flex flex-row  rounded-lg items-center justify-center"
        >
          <Skeleton
            style={{
              height: 93,
              width: "100%",
              maxWidth: 98,
              flex: 1,
            }}
          />
        </View>
        <View style={{ flex: 1 }} className="flex flex-col justify-between">
          <View>
            <Skeleton className={"h-6 flex-1 mb-2"} />
            {/* <Text className="text-muted-foreground text-sm">
                      {item.product_variant.options
                        .map((v) => `${v.value}`)
                        .join(", ")}
                    </Text> */}
            <Skeleton className={"h-5 flex-1"} />
          </View>
          <View className="flex flex-row justify-between">
            <Skeleton className={"h-5 w-24"} />
            <Skeleton className={"h-5 w-16"} />
          </View>
        </View>
      </View>
    </>
  );
};

export default function Screen() {
  const { showActionSheetWithOptions: show } = useActionSheet();
  const { paddingTop } = useHeader();
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const client = useQueryClient();
  const bottomSheetModalRef = useSheetRef();
  const { data, isLoading } = k.order.scanQuery.useQuery({
    variables: { id: title },
  });

  const pickup = k.order.pickup.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.refetchQueries({
        queryKey: k.order.scanQuery.getKey({ id: title }),
      });
    },
    onError: ({ message }) => toast.error(message),
  });

  const snap = useRef(-1);

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetModalRef) {
        if (snap.current === -1) return false;
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Sheet
        onChange={(v) => {
          snap.current = v;
        }}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView>
          <View className="px-3 py-5 flex items-center justify-center">
            <Text className="mb-6 text-xl font-semibold">
              Perlihatkan QR Code ini ke Kasir Toko
            </Text>
            {/* <Image style={{ width: 300, height: 300 }} source={data?.data.qr} /> */}
            <Button className="w-full mt-6">
              <Text>Download QR</Text>
            </Button>
          </View>
        </BottomSheetView>
      </Sheet>
      <Header title={`${title}`} />
      <ScrollView style={{ flex: 1, paddingTop }} className="px-4 bg-white ">
        <View className="bg-white border border-border p-3 flex flex-col gap-2 mb-4 rounded-lg">
          {isLoading ? (
            <Skeleton className={"w-20 h-5"} />
          ) : (
            <Text className="font-semibold">{data?.data.order.user.name}</Text>
          )}

          {isLoading ? (
            <Skeleton className={"w-16 h-4"} />
          ) : (
            <Text className="">{data?.data.order.user.email}</Text>
          )}
        </View>
        <FlashList
          estimatedItemSize={126}
          data={data?.data.order.items}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Loading />
              </>
            ) : null
          }
          renderItem={({ item }) => {
            return (
              <View className="bg-white border border-border p-3  gap-2 mb-4 rounded-lg">
                <View className="flex flex-row mb-2">
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
                      source={item.product_variant.cover_image}
                    />
                  </View>
                  <View
                    style={{ flex: 1 }}
                    className="flex flex-col justify-between"
                  >
                    <View>
                      <Text className="text-lg font-medium">
                        {item.product_variant.product_name}
                      </Text>
                      <Text>{currency(item.price).value}</Text>
                    </View>
                    <View className="flex flex-row justify-between">
                      <Text>Total {item.qty} Produk</Text>
                      <Text className="font-semibold">
                        {currency(item.price).value}
                      </Text>
                    </View>
                    <View className="flex flex-col justify-center mb-2">
                      <Text className="mb-2">Barcode</Text>
                      <Image
                        style={{ flex: 1, height: 20 }}
                        source={item.product_variant.barcode_image}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
        <View className="bg-white border rounded-lg border-border p-3 flex flex-col gap-2 mb-4">
          {isLoading ? (
            <Skeleton className={"w-28 h-6"} />
          ) : (
            <Text className="font-semibold text-lg">Rincian</Text>
          )}

          <View className="flex flex-row justify-between mb-1">
            {isLoading ? (
              <Skeleton className={"w-28 h-5"} />
            ) : (
              <Text>Metode Pembayaran</Text>
            )}
            {isLoading ? (
              <Skeleton className={"w-16 h-5"} />
            ) : (
              <Text>{data?.data.order.payments.payment_method}</Text>
            )}
          </View>
          <View className="flex flex-row justify-between mb-1">
            {isLoading ? (
              <Skeleton className={"w-10 h-5"} />
            ) : (
              <Text>Status</Text>
            )}
            {isLoading ? (
              <Skeleton className={"w-20 h-5"} />
            ) : (
              <Text
                className={
                  paymentStatus(data?.data.order.payments.status).color
                }
              >
                {paymentStatus(data?.data.order.payments.status).text}
              </Text>
            )}
          </View>
          <View className="flex flex-row justify-between mb-1">
            {isLoading ? (
              <Skeleton className={"w-10 h-5"} />
            ) : (
              <Text>Status Pengambilan</Text>
            )}
            {isLoading ? (
              <Skeleton className={"w-20 h-5"} />
            ) : (
              <Text>{data?.data.order.is_picked ? "Sudah" : "Belum"}</Text>
            )}
          </View>
          <View className="flex flex-row justify-between mt-4">
            <SkeletonLoad className={"w-28 h-5"} isLoading={isLoading}>
              <Text className="font-medium">Total Pembayaran</Text>
            </SkeletonLoad>

            <SkeletonLoad className={"w-20 h-5"} isLoading={isLoading}>
              <Text className="font-semibold">
                {currency(data?.data.order.payments.amount).value}
              </Text>
            </SkeletonLoad>
          </View>
        </View>
        <View className="h-40"></View>
      </ScrollView>
      <View
        className="pb-1 pt-3 px-4 flex flex-row gap-2 items-center justify-center"
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
          disabled={!!data?.data.order.is_picked}
          onPress={() => {
            const options = ["Ubah Status", "Batal"];
            show(
              {
                title: `Ubah status ${title} menjadi sudah diambil?`,
                options,
                cancelButtonIndex: 1,
                tintColor: `hsl(${color().primary})`,
                cancelButtonTintColor: `hsl(${color()["muted-foreground"]})`,
              },
              (index) => {
                switch (index) {
                  case 0:
                    pickup.mutate({ id });
                    break;
                  case 1:
                }
              },
            );
          }}
          className="flex-1 flex flex-row items-center justify-center gap-3"
        >
          {pickup.isPending ? (
            <ActivityIndicator size={16} color={"white"} />
          ) : (
            <Fontisto
              name={
                !data?.data.order.is_picked
                  ? "checkbox-passive"
                  : "checkbox-active"
              }
              size={16}
              color="white"
            />
          )}
          <Text className="text-white font-semibold">
            {!data?.data.order.is_picked
              ? "Ubah Status Pengambilan"
              : "Pesanan Udah Diambil"}
          </Text>
        </Button>
      </View>
    </>
  );
}
