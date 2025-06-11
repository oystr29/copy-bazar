import { Link, LinkProps, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { BackHandler, Platform, ScrollView, Text, View } from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { Button } from "~/components/ui/button";
import { k } from "~/kit";
import * as Linking from "expo-linking";
import { FlashList } from "@shopify/flash-list";
import { currency } from "~/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { paymentStatus } from "~/lib/payment";
import { Sheet, useSheetRef } from "~/components/ui/sheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Skeleton, SkeletonLoad } from "~/components/ui/skeleton";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
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

const ButtonBottom = (props: {
  isLoading?: boolean;
  qr?: string | null;
  onOpenSheet?: () => void;
  onPayment?: () => void;
  onCheckPayment?: () => void;
  payment_url: string;
}) => {
  const { id } = useLocalSearchParams<{ id: string; title: string }>();
  if (props.isLoading) return <Skeleton className={"h-10 flex-1"} />;

  if (props.qr)
    return (
      <Button
        onPress={props.onOpenSheet}
        className="flex-1 flex flex-row items-center justify-center gap-1"
      >
        <Ionicons name="qr-code" size={16} color="white" />
        <Text className="text-white font-semibold">Lihat QR Code</Text>
      </Button>
    );

  return (
    <>
      {Platform.OS === "web" ? (
        <Button
          onPress={() => {
            Linking.openURL(props.payment_url);
          }}
          className="flex-1 flex flex-row items-center justify-center gap-0.5"
        >
          <Text className="text-white font-semibold">Bayar Sekarang</Text>
          <Ionicons name="arrow-redo" size={16} color="white" />
        </Button>
      ) : (
        <Link
          asChild
          href={{
            pathname: "/(stack)/order/payment",
            params: { id, url: props.payment_url },
          }}
        >
          <Button className="flex-1 flex flex-row items-center justify-center gap-0.5">
            <Text className="text-white font-semibold">Bayar Sekarang</Text>
            <Ionicons name="arrow-redo" size={16} color="white" />
          </Button>
        </Link>
      )}

      <Button
        onPress={props.onCheckPayment}
        variant={"outline"}
        className="flex-1 flex items-center justify-center active:bg-gray-300"
      >
        <Text className="text-black font-semibold ">Cek Pembayaran</Text>
      </Button>
    </>
  );
};

export default function Screen() {
  const { paddingTop } = useHeader();
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const client = useQueryClient();
  const bottomSheetModalRef = useSheetRef();
  const { data, isLoading } = k.order.single.useQuery({
    variables: { id },
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
            <Image style={{ width: 300, height: 300 }} source={data?.data.qr} />
            {Platform.OS !== "web" && (
              <Button
                className="w-full mt-6"
                onPress={async () => {
                  try {
                    const { status } =
                      await MediaLibrary.requestPermissionsAsync();
                    if (status !== "granted" && data !== undefined) return;

                    const fileUri = `${FileSystem.documentDirectory}${data?.data.order.order_number ?? "qr-order"}.jpg`;

                    const downloadeFile = await FileSystem.downloadAsync(
                      data?.data.qr ?? "",
                      fileUri,
                    );

                    const asset = await MediaLibrary.createAssetAsync(
                      downloadeFile.uri,
                    );
                    await MediaLibrary.createAlbumAsync(
                      "Download",
                      asset,
                      false,
                    );
                    toast.success("Berhasil Simpan QR");
                  } catch (_) {
                    toast.error("Terjadi kesalahan dalam menyimpan gambar");
                  }
                }}
              >
                <Text className="text-white">Download QR</Text>
              </Button>
            )}
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
                    {/* <Text className="text-muted-foreground text-sm">
                      {item.product_variant.options
                        .map((v) => `${v.value}`)
                        .join(", ")}
                    </Text> */}
                    <Text>{currency(item.price).value}</Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text>Total {item.qty} Produk</Text>
                    <Text className="font-semibold">
                      {currency(item.price).value}
                    </Text>
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
            <Text className="font-semibold text-lg">Rincian Pembayaran</Text>
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
        <ButtonBottom
          isLoading={isLoading}
          payment_url={data?.data.order.payments.payment_url ?? ""}
          qr={data?.data.qr}
          onOpenSheet={() => {
            bottomSheetModalRef.current?.present();
          }}
          /* onPayment={() => {
            if (!data?.data.order.payments.payment_url) return;
            Linking.openURL(data?.data.order.payments.payment_url);
          }} */
          onCheckPayment={async () => {
            await client.invalidateQueries({
              queryKey: k.order.single.getKey({ id }),
            });
            await client.refetchQueries({
              queryKey: k.order.all.getKey(),
            });
          }}
        />
      </View>
    </>
  );
}
