import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { k } from "~/kit";
import { cn, couponTitle, currency, shortRp } from "~/lib/utils";
import { inferData } from "react-query-kit";
import { color } from "~/lib/color";
import { Skeleton, SkeletonLoad } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { useQueryClient } from "@tanstack/react-query";
import { Header, useHeader } from "~/components/layout/header";
import { Sheet, useSheetRef } from "~/components/ui/sheet";
import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { relativeDate } from "~/lib/date";
import { maxWidth } from "~/lib/contants";
import { toast } from "~/lib/sonner";

const width = Dimensions.get("window").width;

const variant$ = observable<{ variants: string[]; options: string[] }>({
  variants: [],
  options: [],
});

type Variant = inferData<typeof k.variant.detail>["data"]["variant"];

const qty$ = observable(1);
const Counter = ({ variant }: { variant?: Variant }) => {
  const qty = use$(qty$);
  return (
    <>
      <View className="flex flex-row items-center gap-5 mr-3">
        <Pressable
          className="bg-secondary active:bg-gray-200 rounded-lg p-0.5"
          onPress={() => {
            if (qty <= 1) return;
            qty$.set((v) => v - 1);
          }}
        >
          <MaterialCommunityIcons name="minus" size={24} color="black" />
        </Pressable>
        <Text>{qty}</Text>
        <Pressable
          className="bg-secondary active:bg-gray-200 rounded-lg p-0.5"
          onPress={() => {
            if (qty === variant?.stock) return;
            qty$.set((v) => v + 1);
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="black" />
        </Pressable>
      </View>
    </>
  );
};

const VariantList = ({ product_id }: { product_id: string }) => {
  const qty = use$(qty$);
  const [variants, setVariants] =
    useState<inferData<typeof k.variant.all>["data"]["variants"]>();
  const [variant, setVariant] = useState<Variant>();
  const params = use$(variant$);
  const { data: detail, isLoading } = k.variant.detail.useQuery({
    variables: { id: product_id, params },
  });

  const { data } = k.variant.all.useQuery({
    variables: { product_id, params },
  });

  useEffect(() => {
    if (data) {
      setVariants(data.data.variants);
    }
    if (detail) {
      setVariant(detail.data.variant);
      if (detail.data.variant.stock < 1) {
        qty$.set(0);
        return;
      }
      if (qty > detail.data.variant.stock) {
        qty$.set(detail.data.variant.stock);
        return;
      }
      if (detail.data.variant.stock > 0) {
        qty$.set(1);
        return;
      }
    }
  }, [data, detail]);

  useEffect(() => {
    return () => {
      setVariants(undefined);
      setVariant(undefined);
      variant$.set({ variants: [], options: [] });
    };
  }, []);

  return (
    <View>
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1">
          <Text className="text-xl font-semibold mb-2">Varian</Text>
          {isLoading && <ActivityIndicator />}
        </View>
        <Counter variant={variant} />
      </View>
      <View className="mb-4">
        {variants?.map((variant) => {
          return (
            <View key={`variant-${variant.id}`}>
              <Text className="text-lg font-medium mb-2">{variant.name}</Text>
              <View className="flex flex-wrap flex-row gap-2 mb-2">
                {variant.options.map((option) => {
                  const isSelected = params.options.includes(option.value);
                  return (
                    <Pressable
                      key={`option-${variant.id}-${option.id}`}
                      disabled={!option.is_active || isLoading}
                      onPress={() => {
                        const id = params.variants.indexOf(variant.name);
                        const idOpt = params.options.indexOf(option.value);
                        if (id !== -1 && idOpt !== -1) {
                          variant$.variants.set((v) =>
                            v.filter((vv) => vv !== variant.name),
                          );
                          variant$.options.set((v) =>
                            v.filter((vv) => vv !== option.value),
                          );
                        } else if (id !== -1 && params.variants.length !== 0) {
                          variant$.variants[id].set(variant.name);
                          variant$.options[id].set(option.value);
                        } else if (id === -1 && params.variants.length !== 0) {
                          variant$.variants.set((e) => [...e, variant.name]);
                          variant$.options.set((old) => [...old, option.value]);
                        } else {
                          variant$.variants.set(() => [variant.name]);
                          variant$.options.set(() => [option.value]);
                        }
                      }}
                      className={cn(
                        "rounded-lg px-1 py-0.5 border min-w-14 flex items-center justify-center active:bg-gray-200 disabled:opacity-50 bg-white disabled:text-gray-600 group aria-disabled:opacity-50 aria-disabled:cursor-not-allowed",
                        isSelected && "bg-primary/80 border-primary/80",
                      )}
                    >
                      <Text
                        className={cn(
                          "text-lg",
                          // !option.is_active && "text-gray-600",
                          isSelected && "text-white",
                        )}
                      >
                        {option.value}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

type Coupon = inferData<typeof k.coupon.all>["data"][0];

const CartCheckout = ({ product_id }: { product_id: string }) => {
  const bottomSheetModalRef = useSheetRef();
  const snap = useRef(-1);
  const params = use$(variant$);
  const router = useRouter();
  const qty = use$(qty$);
  const [coupon, setCoupon] = useState<Coupon>();
  const { data: detail } = k.variant.detail.useQuery({
    variables: { id: product_id, params },
  });
  const { data: coupons, isLoading } = k.coupon.all.useQuery();
  const client = useQueryClient();
  const addCart = k.cart.add.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.refetchQueries({ queryKey: k.cart.all.getKey() });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

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
        <View className="px-2 mb-1 flex gap-1 flex-row items-center">
          <Text className="text-muted-foreground text-sm">Stock:</Text>
          <SkeletonLoad isLoading={!detail} className={"h-4 w-4"}>
            <Text className="text-muted-foreground text-sm">
              {detail?.data.variant.stock}
            </Text>
          </SkeletonLoad>
        </View>
        <View className="px-2">
          {detail?.data.variant.id && (
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl">
                {`${currency(detail?.data.variant.price).value} x ${qty} `}
              </Text>
              <Text className="text-xl font-semibold">
                {`= ${currency(detail?.data.variant.price * qty).value}`}
              </Text>
            </View>
          )}
          {!detail?.data.variant.id && (
            <Text className="text-sm">Tolong Pilih Variant Dulu</Text>
          )}
        </View>
        <View className="flex flex-row px-2 py-1 gap-2">
          <Button
            disabled={!detail?.data.variant.id}
            variant={"secondary"}
            onPress={() => {
              if (!detail?.data.variant.id) return;
              addCart.mutate({
                data: {
                  type: "variant",
                  qty,
                  id: detail?.data.variant.id,
                },
              });
            }}
            className="flex flex-row justify-center items-center gap-2"
          >
            {addCart.isPending ? (
              <ActivityIndicator size={22} />
            ) : (
              <MaterialCommunityIcons
                name="cart-plus"
                size={22}
                color="black"
              />
            )}
          </Button>
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
            className={cn(
              "border border-border bg-gray-100 active:bg-gray-200 px-4 py-3 mb-2  rounded-lg flex-1",
              coupon && "border-primary bg-primary/10 active:bg-primary/30",
            )}
          >
            <Text
              numberOfLines={1}
              className={cn(
                "text-gray-400 font-medium truncate",
                coupon && "text-primary",
              )}
            >
              {coupon
                ? `${coupon.code} - ${couponTitle(coupon)}`
                : "Pilih Kupon"}
            </Text>
          </Pressable>

          <Button
            disabled={!detail?.data.variant.id || preCheckout.isPending}
            onPress={() => {
              if (!detail?.data.variant.id) return;
              preCheckout.mutate({
                order: [
                  {
                    type: "variant",
                    qty,
                    id: detail?.data.variant.id,
                  },
                ],
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
              <ActivityIndicator size={22} />
            ) : (
              <Ionicons name="bag-check-outline" size={22} color="white" />
            )}

            <Text className="text-white font-medium">Beli</Text>
          </Button>
        </View>
      </View>
    </>
  );
};

export default function Screen() {
  const { paddingTop } = useHeader();
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const posX = useSharedValue<number>(0);

  const { data, isLoading } = k.product.single.useQuery({ variables: { id } });

  const images = data?.data.product_variants.flatMap((v) => v.images);

  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === "web")
      return { transform: `translateX(${posX.value}px)` };

    if (Platform.OS === "ios")
      return { transform: [{ translateX: posX.value }] };

    return {
      translateX: posX.value,
    };
  });

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  useEffect(() => {
    return () => {
      qty$.set(1);
    };
  }, []);

  return (
    <>
      
      <Header title={data?.data.name ?? title} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingTop }}
        className="px-4 bg-white"
      >
        <View className="mb-4">
          {!images ? (
            <>
              <View
                style={{ width: width - 32, height: width / 2 }}
                className={
                  "border border-border rounded-lg overflow-x-hidden z-10 relative flex items-center justify-center"
                }
              >
                <Skeleton
                  style={{ width: width - 64, height: width / 2 - 8 }}
                />
              </View>
              <View className="flex flex-row justify-center  w-full mt-4">
                <View className="p-2 rounded-lg flex flex-row items-center justify-center gap-4">
                  <Skeleton className={"w-10 h-10"} />
                  <Skeleton className={"w-10 h-10"} />
                  <Skeleton className={"w-10 h-10"} />
                  <Skeleton className={"w-10 h-10"} />
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="border border-primary rounded-lg overflow-x-hidden z-10 relative">
                <Carousel
                  ref={ref}
                  width={maxWidth - 32}
                  height={maxWidth / 2}
                  data={images}
                  loop={false}
                  onProgressChange={(_, i) => {
                    progress.value = i;
                    if (i >= 0 && i <= images.length - 1) {
                      posX.value = withSpring(54 * i, { duration: 500 });
                    }
                  }}
                  containerStyle={{
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: `${color().primary}`,
                    overflowX: "hidden",
                    position: "relative",
                  }}
                  renderItem={({ item }) => {
                    return (
                      <View className="rounded-lg flex flex-row relative z-0 mx-4">
                        <Image
                          style={{
                            height: maxWidth / 2,
                            width: "100%",
                            flex: 1,
                            borderRadius: 8,
                          }}
                          contentFit="contain"
                          source={item.url}
                        />
                      </View>
                    );
                  }}
                />
              </View>
              <View className="flex flex-row justify-center  w-full mt-4">
                <View className="p-2 rounded-lg  flex flex-row items-center justify-center gap-4 bg-background">
                  <Animated.View
                    style={[
                      {
                        position: "absolute",
                        backgroundColor: "transparent",
                        zIndex: 10,
                        left: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        // transform: `translateX(${0}px)`,
                        borderColor: "#000",
                        height: 42,
                        width: 42,
                      },
                      animatedStyle,
                    ]}
                  />

                  {images.map((img, i) => {
                    return (
                      <PreviewItem
                        count={images.length}
                        key={`img-${img.id}`}
                        index={i}
                        img={img}
                        animValue={progress}
                        onPress={() => onPressPagination(i)}
                      />
                    );
                  })}
                </View>
              </View>
            </>
          )}
        </View>
        <View className="flex flex-row items-center justify-between mb-6">
          {isLoading ? (
            <>
              <Skeleton className={"h-8 w-56"} />
              <Skeleton className={"h-12 w-12"} />
            </>
          ) : (
            <>
              <Text className="text-2xl font-bold">{data?.data.name}</Text>
              <Text className="text-xl font-semibold">
                {shortRp(data?.data.price ?? 0)}
              </Text>
            </>
          )}
        </View>
        <View className="mb-6">
          <Text className="text-xl font-semibold mb-2">Deskripsi</Text>
          {isLoading ? (
            <Skeleton className={"h-5 w-40"} />
          ) : (
            <Text className="text-sm font-semibold text-muted-foreground">
              {data?.data.description}
            </Text>
          )}
        </View>
        <VariantList product_id={id} />
        <View className="h-40 w-full"></View>
      </ScrollView>
      <CartCheckout product_id={id} />
    </>
  );
}

type PreviewItemProps = {
  index: number;
  count: number;
  animValue: SharedValue<number>;
  onPress: () => void;
  img: inferData<
    typeof k.product.single
  >["data"]["product_variants"][0]["images"][0];
};

const PreviewItem = ({ onPress, img }: PreviewItemProps) => {
  return (
    <Pressable onPress={onPress}>
      <View style={{ borderRadius: 8, position: "relative" }}>
        <Image
          source={img.url}
          contentFit="contain"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
          }}
        />
      </View>
    </Pressable>
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
