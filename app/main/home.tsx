import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "~/lib/color";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useAuth } from "~/context/auth";
import { ProductList } from "~/components/layout/product";
import { k } from "~/kit";
import { SkeletonLoad } from "~/components/ui/skeleton";
import { cn, currency } from "~/lib/utils";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";
import { Button, HeaderButton } from "~/components/ui/button";
import { maxWidth } from "~/lib/contants";
import { toast } from "~/lib/sonner";

const width =
  maxWidth > Dimensions.get("window").width
    ? Dimensions.get("window").width
    : maxWidth;

const isWeb = Platform.OS === "web";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Event = () => {
  const router = useRouter();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const { data, isLoading } = k.event.all.useQuery();
  const { session: sesh } = useAuth();
  const { isError } = k.user.profile.useQuery({
    enabled: !!sesh,
  });

  const notAuth = !sesh || isError;

  const client = useQueryClient();
  const join = k.event.join.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.refetchQueries({ queryKey: k.event.all.getKey() });
    },
    onError: ({ message }) => toast.error(message),
  });

  return (
    <View>
      <View className="flex flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-semibold text-black/80">Event</Text>
        {Platform.OS === "web" ? (
          <Link href={"/event"} asChild>
            <AnimatedPressable>
              <ChevronRight color={"#000000"} size={24} />
            </AnimatedPressable>
          </Link>
        ) : (
          <Link href={"/event"} asChild>
            <HeaderButton>
              <ChevronRight color={"#000000"} size={24} />
            </HeaderButton>
          </Link>
        )}
      </View>
      <SkeletonLoad
        isLoading={isLoading}
        className={"bg-gray-200"}
        style={{ width: width - 32, height: 114 }}
      >
        <Carousel
          ref={ref}
          width={width - 16}
          height={114}
          data={data?.data ?? []}
          onProgressChange={progress}
          renderItem={({ item }) => {
            const isAllowed =
              item.users && item.users.length > 0
                ? item.users[0].pivot.is_allowed
                : true;
            return (
              <View
                key={`event-${item.id}`}
                className={cn(
                  "rounded-lg flex flex-col items-center justify-center gap-1 mr-4 relative bg-primary py-4 px-3",
                  !isAllowed && "opacity-60",
                )}
              >
                {isAllowed && !notAuth && (
                  <Pressable
                    onPress={() => {
                      if (!isAllowed) return;
                      if (item.is_joined) {
                        if (Platform.OS === "web") {
                          Linking.openURL(item.redirect_url);
                        } else if (
                          Platform.OS === "ios" ||
                          Platform.OS === "android"
                        ) {
                          router.navigate({
                            pathname: "/game",
                            params: {
                              title: item.name,
                              url: item.redirect_url,
                            },
                          });
                        }
                        return;
                      }

                      join.mutate({ id: item.id });
                    }}
                    className={cn(
                      "px-2 py-1 border border-white rounded-full absolute top-1 left-1 flex items-center justify-center flex-row gap-1",
                      item.is_joined
                        ? "bg-white web:hover:bg-white/80"
                        : "bg-primary web:hover:bg-primary/80",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-xs",
                        item.is_joined ? "text-primary" : "text-white",
                      )}
                    >
                      {item.is_joined ? "Klik untuk main" : "Klik Untuk Join"}
                    </Text>
                    {join.isPending && (
                      <ActivityIndicator size={10} color={"white"} />
                    )}
                  </Pressable>
                )}
                <MaterialCommunityIcons
                  name="gamepad-variant-outline"
                  size={32}
                  color={`hsl(${color().background})`}
                />
                <Text
                  numberOfLines={1}
                  className="text-base font-semibold text-white truncate"
                >
                  {item.name}
                </Text>
                <Text numberOfLines={1} className="text-xs text-white truncate">
                  {item.description}
                </Text>
              </View>
            );
          }}
        />
      </SkeletonLoad>
    </View>
  );
};

const Product = () => {
  const { data, isLoading, error } = k.product.all.useQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <>
      <View className="my-4">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-semibold text-black/80">Product</Text>
          {Platform.OS === "web" ? (
            <Link href={"/product"} asChild>
              <Pressable>
                <ChevronRight
                  color={"#000000"}
                  size={24}
                  style={{ padding: 0, marginTop: 1 }}
                />
              </Pressable>
            </Link>
          ) : (
            <Link href={"/product"} asChild>
              <HeaderButton>
                <ChevronRight
                  color={"#000000"}
                  size={24}
                  style={{ padding: 0, marginTop: 1 }}
                />
              </HeaderButton>
            </Link>
          )}
        </View>

        <ProductList data={data?.data} isLoading={isLoading} />
      </View>
    </>
  );
};

const Wallet = () => {
  const { session: sesh } = useAuth();
  const { data, isLoading, isError } = k.user.profile.useQuery({
    enabled: !!sesh?.token,
  });

  const notAuth = !sesh || isError;

  return (
    <>
      <View
        className="bg-white rounded-lg p-4 mb-8"
        style={{
          shadowColor: "#bebebe",
          shadowOffset: {
            width: 0,
            height: isWeb ? 6 : 12,
          },
          shadowOpacity: 1,
          shadowRadius: isWeb ? 10 : 50,
          elevation: isWeb ? 10 : 24,
        }}
      >
        <View className="flex flex-row justify-between items-center mb-4">
          <Image
            style={{ width: 87, height: 47 }}
            source={require("../../assets/images/logo.png")}
          />
        </View>

        <View className="bg-primary/25 rounded-2xl py-2.5 px-5">
          <SkeletonLoad isLoading={isLoading} className={"h-6 w-40"}>
            <Text className="text-black font-bold mb-2 text-lg">
              {data?.data.name}
            </Text>
          </SkeletonLoad>

          <View className="flex flex-row justify-between mb-10 flex-wrap gap-2">
            <View>
              <Text className="text-base font-light">
                {notAuth ? "Masuk/Join Member Yuk!" : "Total Point"}
              </Text>
              <View className="relative">
                <SkeletonLoad isLoading={isLoading} className={"h-7 w-16"}>
                  <Text className="text-black/90 text-2xl">
                    {currency(data?.data.member?.point! ?? 0).valueNoSymbol}
                  </Text>
                </SkeletonLoad>
              </View>
            </View>
            <Link asChild href={"/coupon"}>
              <Pressable className="bg-white py-2 px-2.5 flex flex-row items-center gap-2 rounded-lg">
                <Image
                  style={{ width: 27, height: 26 }}
                  source={require("../../assets/images/logo-app.png")}
                />
                <Text className="text-xl text-primary">
                  {notAuth ? "Login" : "Kupon"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  className="text-primary fill-primary"
                  color={`hsl(122, 91%, 21%)`}
                />
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
};

export default function Feed() {
  return (
    <>
      <Stack.Screen options={{ title: "Beranda" }} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          className="px-4 pt-4 bg-mainBg"
        >
          <Wallet />
          {/* <TestAnimated /> */}
          <Event />
          <View className="h-40 w-full"></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const TestAnimated = () => {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: "violet",
        }}
      />
      <Button onPress={handlePress}>
        <Text>Hohoho</Text>
      </Button>
    </View>
  );
};
