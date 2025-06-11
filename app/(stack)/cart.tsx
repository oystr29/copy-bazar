import { FlashList } from "@shopify/flash-list";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { k } from "~/kit";
import { cn, couponTitle, currency } from "~/lib/utils";
import { Image } from "expo-image";
import { inferData } from "react-query-kit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDebouncedCallback } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Skeleton } from "~/components/ui/skeleton";
import Svg, { Circle, Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { color } from "~/lib/color";
import { Checkbox } from "~/components/ui/checkbox";
import { atom } from "jotai";
import { useImmerAtom } from "jotai-immer";
import { Button } from "~/components/ui/button";
import { Header, useHeader } from "~/components/layout/header";
import { useRefreshOnFocus } from "~/lib/query";
import { Sheet, useSheetRef } from "~/components/ui/sheet";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { relativeDate } from "~/lib/date";
import { Label } from "~/components/ui/label";
import { toast } from "~/lib/sonner";

const orderParamAtom = atom<inferData<typeof k.cart.all>["data"]["items"]>([]);

const RightAction = ({ variant_id }: { variant_id: number }) => {
  const [, setOrderParam] = useImmerAtom(orderParamAtom);
  const client = useQueryClient();
  const del = k.cart.remove.useMutation({
    onSuccess: async () => {
      setOrderParam((draft) => {
        return draft.filter((v) => v.product_variant_id !== variant_id);
      });
      await client.invalidateQueries({ queryKey: k.cart.all.getKey() });
    },
    onError: async ({ message }) => toast.error(message),
  });
  return (
    <Pressable
      style={{ height: 84, width: 84 }}
      onPress={() => {
        del.mutate({
          data: {
            qty: 99999999,
            id: variant_id,
            type: "variant",
          },
        });
      }}
      className="flex flex-col items-center bg-destructive justify-center ml-4 rounded-lg"
    >
      {del.isPending ? (
        <ActivityIndicator size={24} />
      ) : (
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color={`hsl(${color()["destructive-foreground"]})`}
        />
      )}
    </Pressable>
  );
};

const CartItem = ({
  item,
}: {
  item: inferData<typeof k.cart.all>["data"]["items"][0];
}) => {
  const [orderParam, setOrderParam] = useImmerAtom(orderParamAtom);
  const [checked, setChecked] = useState(false);
  const [qty, setQty] = useState(item.qty);
  const client = useQueryClient();
  const addCart = k.cart.add.useMutation({
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: k.cart.all.getKey() });
      setOrderParam((draft) => {
        const v = draft.find((dd) => dd.id === item.id);
        if (v) {
          v.qty = qty;
        }
      });
    },
    onError: async ({ message }) => toast.error(message),
  });

  const onCheckedChange = useCallback((e: boolean) => {
    setChecked(e);
    if (e) {
      setOrderParam((draft) => {
        draft.push(item);
      });
    } else {
      setOrderParam((draft) => {
        return draft.filter(
          (d) => d.product_variant_id !== item.product_variant_id,
        );
      });
    }
  }, []);

  const debounce = useDebouncedCallback((amount: number) => {
    // if (amount < 1 || amount > item.product_variant.stock) return;
    addCart.mutate({
      data: {
        qty: amount,
        id: item.product_variant_id,
        type: "variant",
      },
    });
  }, 2000);

  useEffect(() => {
    const i = orderParam.findIndex((e) => e.id === item.id);
    setChecked(i > -1);
  }, [orderParam]);

  return (
    <Swipeable
      renderRightActions={() => (
        <RightAction variant_id={item.product_variant_id} />
      )}
      rightThreshold={40}
      friction={2}
    >
      <View className="bg-white rounded-lg py-2 px-2 mb-4 shadow-lg">
        <View className="flex flex-row gap-2">
          <View style={{ flex: 1 }} className="flex flex-row gap-2">
            <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
            <Pressable
              onPress={() => onCheckedChange(!checked)}
              style={{ flex: 1, height: 100, maxWidth: 90 }}
              className="border flex flex-row border-primary rounded-lg items-center justify-center"
            >
              <Image
                style={{
                  height: 84,
                  width: "100%",
                  maxWidth: 74,
                  flex: 1,
                }}
                contentFit="contain"
                source={item.product_variant.product.image}
              />
            </Pressable>
          </View>
          <View style={{ flex: 1 }} className="flex flex-col justify-between">
            <View>
              <Text>{item.product_variant.product.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {item.product_variant.options.map((o) => o.value).join(", ")}
              </Text>
            </View>
            <Text className="font-semibold">
              {currency(item.product_variant.price).value}
            </Text>
          </View>
          <View className="flex flex-col justify-end">
            <View className="flex flex-row items-center gap-5">
              <View className="h-4 w-4">
                {addCart.isPending && <ActivityIndicator size={16} />}
              </View>

              <Pressable
                disabled={addCart.isPending}
                className="bg-secondary active:bg-gray-200 rounded-lg p-0.5"
                onPress={() => {
                  if (qty === 1) return;
                  setQty((v) => v - 1);
                  const amount = item.qty - qty;
                  debounce(-amount);
                }}
              >
                <MaterialCommunityIcons name="minus" size={24} color="black" />
              </Pressable>
              <Text>{qty}</Text>
              <Pressable
                className="bg-secondary active:bg-gray-200 rounded-lg p-0.5"
                onPress={() => {
                  if (qty === item.product_variant.stock) return;
                  setQty((v) => v + 1);
                  const amount = qty - item.qty;
                  debounce(amount);
                }}
              >
                <MaterialCommunityIcons name="plus" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

type Coupon = inferData<typeof k.coupon.all>["data"][0];
const CheckoutBottom = () => {
  const bottomSheetModalRef = useSheetRef();
  const router = useRouter();
  const snap = useRef(-1);
  const [orderParam] = useImmerAtom(orderParamAtom);
  const [coupon, setCoupon] = useState<Coupon>();

  const total = useMemo(() => {
    return orderParam.reduce((a, b) => a + b.qty * b.product_variant.price, 0);
  }, [orderParam]);

  const { data: coupons, isLoading } = k.coupon.all.useQuery();
  const preCheckout = k.order.preCheckout.useMutation({
    onSuccess: async ({ params }) => {
      router.push({
        pathname: "/order/pre-checkout",
        params: { query: JSON.stringify(params) },
      });
    },
    onError: ({ message }) => toast.error(message),
  });

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
        ref={bottomSheetModalRef}
        snapPoints={["100%", "50%"]}
        onChange={(v) => {
          snap.current = v;
        }}
      >
        <BottomSheetFlashList
          estimatedItemSize={84}
          data={coupons?.data}
          extraData={coupon}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
          keyExtractor={(item) => `${item.id}`}
          ListEmptyComponent={
            isLoading ? (
              <>
                <LoadingCoupons />
                <LoadingCoupons />
                <LoadingCoupons />
              </>
            ) : (
              <View className="">
                <Text>Kamu belum punya kupon</Text>
              </View>
            )
          }
          renderItem={({ item, extraData }) => {
            const exData = extraData as Coupon | undefined;
            const isSelected = exData?.code === item.code;
            const date = relativeDate(item.start_date, item.expiry_date);
            return (
              <Pressable
                onPress={() => {
                  bottomSheetModalRef.current?.dismiss();
                  if (!exData) {
                    setCoupon(item);
                    return;
                  }

                  setCoupon(exData?.code === item.code ? undefined : item);
                }}
                className={cn(
                  "bg-white flex flex-row shadow-lg mb-2 active:bg-gray-100",
                  isSelected && "border border-primary",
                )}
              >
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
                <View className="items-center justify-center mr-4">
                  {exData?.code === item.code && (
                    <MaterialIcons
                      name="check-circle-outline"
                      size={24}
                      color={`hsl(${color().primary})`}
                    />
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </Sheet>
      <View
        className="pb-1 pt-3"
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
        <View className="px-2 py-1">
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
            className={cn(
              "border border-border bg-gray-100 active:bg-gray-200 px-4 py-3 mb-2  rounded-lg",
              coupon && "border-primary bg-primary/10 active:bg-primary/30",
            )}
          >
            <Text
              className={cn(
                "text-gray-400 font-medium",
                coupon && "text-primary",
              )}
            >
              {coupon
                ? `${coupon.code} - ${couponTitle(coupon)}`
                : "Pilih Kupon"}
            </Text>
          </Pressable>
          <Text className="text-lg font-medium mb-2">
            Total:{" "}
            <Text className="text-primary font-semibold">
              {currency(total).value}
            </Text>{" "}
          </Text>
          <View className="flex flex-row gap-2">
            <Button
              disabled={orderParam.length === 0}
              onPress={() => {
                preCheckout.mutate({
                  order: orderParam.map((v) => ({
                    id: v.product_variant_id,
                    qty: v.qty,
                    type: "variant",
                  })),
                  discounts: {
                    coupons: {
                      apply: !!coupon,
                      code: coupon?.code ?? "",
                    },
                  },
                });
              }}
              className="flex-1 flex flex-row justify-center items-center gap-2"
            >
              {preCheckout.isPending ? (
                <ActivityIndicator color={"white"} size={22} />
              ) : (
                <Ionicons name="bag-check-outline" size={22} color="white" />
              )}

              <Text className="text-white font-medium">Checkout</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default function Screen() {
  const [checkedall, setCheckedAll] = useState(false);
  const { data, isLoading, refetch } = k.cart.all.useQuery();
  const [orderParam, setOrderParam] = useImmerAtom(orderParamAtom);
  const { paddingTop } = useHeader();
  const router = useRouter();

  const onCheckedChange = useCallback(
    (e: boolean) => {
      setCheckedAll(e);
      if (e) {
        setOrderParam((d) => {
          if (data?.data.items) return data.data.items;
          return d;
        });
        return;
      }

      setOrderParam((d) => {
        d = [];
        return d;
      });
    },
    [data?.data.items, setOrderParam],
  );

  useRefreshOnFocus(refetch);

  useEffect(() => {
    setCheckedAll(orderParam.length === data?.data.items.length);
  }, [data?.data.items.length, orderParam.length]);

  useEffect(() => {
    return () => {
      setOrderParam((d) => {
        d.length = 0;
      });
    };
  }, []);
  return (
    <>
      <Header title="Keranjang" />
      <ScrollView
        style={{ flex: 1, paddingTop }}
        className="px-4 pb-10 bg-white"
      >
        <View className="flex flex-row items-center gap-2 ">
          <Checkbox
            aria-labelledby="checkall"
            checked={checkedall}
            onCheckedChange={onCheckedChange}
          />
          <Label
            nativeID="checkall"
            onPress={() => onCheckedChange(!checkedall)}
          >
            Pilih Semua
          </Label>
        </View>
        <FlashList
          data={data?.data.items}
          keyExtractor={(item) => `${item.id}`}
          estimatedItemSize={100}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Loading />
                <Loading />
                <Loading />
              </>
            ) : (
              <View className="flex flex-col items-center justify-center gap-8">
                <Svg width={64} height={64}>
                  <Path
                    fill="#b2c1c0"
                    d="M53.1 38.6h-7.5v3.8h7.5c1 0 1.9.8 1.9 1.9s-.8 1.9-1.9 1.9H6.3c-1 0-1.9.8-1.9 1.9 0 1 .8 1.9 1.9 1.9h46.9c3.1 0 5.6-2.5 5.6-5.6 0-3.3-2.6-5.8-5.7-5.8m1.4-12.9-3.7-.3c0-.1 2.3-13.8 2.8-16.6.3-1.6.9-6.1 6.6-6.1v3.8c-2.3 0-2.6.9-2.8 2.6-.6 2.8-2.9 16.4-2.9 16.6"
                  />
                  <Path
                    fill="#056708"
                    d="M54.7 12.3H4c-1.9 0-2.2 1.8-1.9 2.8l5.7 25.4c.3 1 1.3 1.8 2.4 1.8H50c1 0 2-.8 2.2-1.9l4.2-26.3c.1-.9-.7-1.8-1.7-1.8M6.9 20.8l-1-3.8c-.1-.5.2-.9.7-.9h7.1c.5 0 1 .4 1 .9l.4 3.8c.1.5-.3.9-.8.9H8c-.5 0-1-.4-1.1-.9m3.2 9.3c-.5 0-1-.4-1.2-.9l-.7-2.9c-.1-.5.2-.9.7-.9h5.7c.5 0 1 .4 1 .9l.3 2.8c.1.5-.3.9-.8.9.1.1-5 .1-5 .1m6 8.5h-3.9c-.5 0-1-.4-1.2-.9l-.7-2.9c-.1-.5.2-.9.7-.9h4.5c.5 0 1 .4 1 .9l.3 2.8c.2.5-.2 1-.7 1m11.5-1c0 .5-.4.9-.9.9h-4.9c-.5 0-1-.4-1-.9l-.3-2.8c-.1-.5.3-.9.8-.9h5.4c.5 0 .9.4.9.9zm0-8.4c0 .5-.4.9-.9.9h-5.8c-.5 0-1-.4-1-.9l-.3-2.8c-.1-.5.3-.9.8-.9h6.3c.5 0 .9.4.9.9zm0-8.4c0 .5-.4.9-.9.9H20c-.5 0-1-.4-1-.9l-.5-3.8c-.1-.5.3-.9.8-.9h7.3c.5 0 .9.4.9.9.1 0 .1 3.8.1 3.8m10.2 16.8c-.1.5-.5.9-1 .9h-4.4c-.5 0-.9-.4-.9-.9v-2.8c0-.5.4-.9.9-.9h4.9c.5 0 .9.4.8.9zm.9-8.4c-.1.5-.5.9-1 .9h-5.3c-.5 0-.9-.4-.9-.9v-2.8c0-.5.4-.9.9-.9h5.8c.5 0 .9.4.8.9zm.9-8.4c-.1.5-.5.9-1 .9h-6.2c-.5 0-.9-.4-.9-.9V17c0-.5.4-.9.9-.9h6.8c.5 0 .9.4.8.9zm8.7 16.8c-.1.5-.6.9-1.1.9h-4.8c-.5 0-.9-.4-.8-.9l.3-2.8c.1-.5.5-.9 1-.9H48c.5 0 .9.4.8.9zm1.3-8.4c-.1.5-.6.9-1.1.9h-5.3c-.5 0-.9-.4-.8-.9l.3-2.8c.1-.5.5-.9 1-.9h5.5c.5 0 .9.4.8.9zm1.3-8.4c-.1.5-.6.9-1.1.9h-5.7c-.5 0-.9-.4-.8-.9l.4-3.8c.1-.5.5-.9 1-.9h5.9c.5 0 .9.4.8.9z"
                  />
                  <Circle cx={12.3} cy={56.4} r={5.6} fill="#62727a" />
                  <Circle cx={12.3} cy={56.4} r={2.8} fill="#fff" />
                  <Circle cx={46.1} cy={56.4} r={5.6} fill="#62727a" />
                  <Path
                    fill="#fff"
                    d="M48.9 56.4c0 1.6-1.3 2.8-2.8 2.8-1.6 0-2.8-1.3-2.8-2.8 0-1.6 1.3-2.8 2.8-2.8s2.8 1.2 2.8 2.8"
                  />
                  <Path
                    fill="#62727a"
                    d="M61.1 2h-2.8v5.6h2.8c.5 0 .9-.4.9-.9V2.9c0-.5-.4-.9-.9-.9"
                  />
                  <Path
                    fill="#056708"
                    d="M12.3 48.9c-4.1 0-7.5 3.4-7.5 7.5h15c0-4.2-3.3-7.5-7.5-7.5m33.8 0c-4.1 0-7.5 3.4-7.5 7.5h15c0-4.2-3.4-7.5-7.5-7.5"
                  />
                </Svg>
                <Text className="text-lg font-medium">
                  Wah, keranjang belanjamu masih kosong
                </Text>
                <Text className="">Yuk, lihat-lihat dulu produk yang ada</Text>
                <Pressable
                  onPress={() => router.back()}
                  className="border-primary px-4 py-2 rounded-lg bg-white active:bg-gray-200 border"
                >
                  <Text className="text-primary">Lihat Product</Text>
                </Pressable>
              </View>
            )
          }
          renderItem={({ item }) => {
            return <CartItem item={item} />;
          }}
        />
      </ScrollView>
      <CheckoutBottom />
    </>
  );
}

const Loading = () => {
  return (
    <View className="bg-white rounded-lg py-2 px-2 mb-4 shadow-lg">
      <View className="flex flex-row gap-6">
        <View
          style={{ height: 100, width: 90, maxWidth: 90 }}
          className="border flex flex-row border-primary rounded-lg items-center justify-center"
        >
          <Skeleton style={{ height: 84, width: 74, maxWidth: 74, flex: 1 }} />
        </View>
        <View style={{}} className="flex flex-col justify-between">
          <View>
            <Skeleton className={"h-4 w-36 mb-2"} />
            <Skeleton className={"h-4 w-20 "} />
          </View>
          <Skeleton className={"h-4 w-1/3"} />
        </View>
        <View className="flex flex-col justify-end">
          <View className="flex flex-row items-center gap-5">
            <Skeleton className={"h-5 w-20"} />
          </View>
        </View>
      </View>
    </View>
  );
};

const LoadingCoupons = () => {
  return (
    <View className="bg-white flex flex-row shadow-lg mb-2">
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
