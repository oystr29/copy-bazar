import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Svg, { Ellipse, Path } from "react-native-svg";
import { color } from "~/lib/color";
import * as Notifications from "expo-notifications";
import { Href, Link } from "expo-router";
import { useAuth } from "~/context/auth";
import { k } from "~/kit";
import { SkeletonLoading } from "~/components/ui/skeleton";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import { registerForPushNotificationsAsync } from "~/lib/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "~/lib/sonner";
import Head from "expo-router/head";

const Circle1 = () => {
  return (
    <Svg style={{ borderRadius: 16 }} width={233} height={200} fill="none">
      <Ellipse
        cx={215.5}
        cy={-34.5}
        fill="#056708"
        fillOpacity={0.25}
        rx={215.5}
        ry={237.5}
      />
    </Svg>
  );
};

const Circle2 = () => {
  return (
    <Svg style={{ borderRadius: 16 }} width={149} height={117} fill="none">
      <Ellipse
        cx={44.5}
        cy={94}
        fill="#056708"
        fillOpacity={0.25}
        rx={104.5}
        ry={94}
      />
    </Svg>
  );
};

const Circle3 = () => {
  return (
    <Svg style={{ borderRadius: 16 }} width={154} height={130} fill="none">
      <Ellipse
        cx={136.5}
        fill="#056708"
        fillOpacity={0.25}
        rx={136.5}
        ry={130}
      />
    </Svg>
  );
};

const Circle4 = () => {
  return (
    <Svg style={{ borderRadius: 16 }} width={144} height={130} fill="none">
      <Path
        fill="#056708"
        fillOpacity={0.25}
        d="M143.5 36c0 51.915-45.286 94-103 94S-64 87.915-64 36s46.786-94 104.5-94c73-24 103 42.085 103 94Z"
      />
    </Svg>
  );
};

const Header = () => {
  const { data, isLoading } = k.user.profile.useQuery();
  return (
    <>
      <View
        className="bg-white p-4 mb-8"
        style={{
          shadowColor: "#bebebe",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 1,
          shadowRadius: 50,
          elevation: 24,
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
        }}
      >
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="text-gray-900 font-semibold text-2xl">Member</Text>
          {/* <Pressable className="border-primary border p-1.5 rounded-lg">
            <MaterialCommunityIcons size={24} name="bell-outline" />
          </Pressable> */}
        </View>
        <View className="px-5 py-3 bg-primary/25 relative overflow-hidden rounded-2xl">
          <View className="absolute top-0 -right-2 rounded-2xl">
            <Circle1 />
          </View>
          <View className="absolute bottom-0 left-0 rounded-2xl">
            <Circle2 />
          </View>
          <View className="absolute top-0 right-0 rounded-2xl">
            <Circle3 />
          </View>
          <View className="absolute top-0 left-0 rounded-2xl">
            <Circle4 />
          </View>
          <View className="w-full flex flex-row items-center justify-center mb-4">
            <Text className="text-white text-lg font-semibold">
              Kartu Member
            </Text>
          </View>
          <View className="flex flex-row items-center gap-4 z-20 relative mb-4">
            <SkeletonLoading data={data?.data.detail.image}>
              {(value) => (
                <Image
                  contentFit="cover"
                  contentPosition={"center"}
                  source={value}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 99999,
                    maxWidth: 92,
                    flex: 1,
                  }}
                />
              )}
            </SkeletonLoading>
            <View>
              <SkeletonLoading data={data?.data.name} className={"w-20 h-4"}>
                {(value) => (
                  <Text className="text-sm text-white font-medium">
                    Nama : {value}
                  </Text>
                )}
              </SkeletonLoading>
              <SkeletonLoading
                data={data?.data.member.no_member}
                className={"w-20 h-4"}
              >
                {(value) => (
                  <Text className="text-sm text-white font-medium">
                    No. Member : {value}
                  </Text>
                )}
              </SkeletonLoading>
              <SkeletonLoading
                data={data?.data.detail.phone_number}
                className={"w-20 h-4"}
              >
                {(value) => (
                  <Text className="text-sm text-white font-medium">
                    No HP : {value}
                  </Text>
                )}
              </SkeletonLoading>
            </View>
          </View>
          {/* <View className="flex flex-row justify-between items-end">
            <Text className="text-xs text-white">
              Berlaku sampai dengan 26 Juni 2025
            </Text>
            <View className="rounded-md bg-white">
              <Image
                style={{ width: 78, height: 78 }}
                source={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                }
              />
            </View>
          </View> */}
        </View>
      </View>
    </>
  );
};

type Links = { text: string; icon: () => JSX.Element; href?: Href };
const links1: Links[] = [
  {
    text: "Edit Profil",
    href: "/user",
    icon: () => (
      <MaterialCommunityIcons
        name="account-details-outline"
        size={32}
        color={`hsl(${color().primary})`}
      />
    ),
  },
  {
    href: "/coupon",
    text: "Kupon",
    icon: () => (
      <MaterialCommunityIcons
        name="ticket-percent"
        size={32}
        color={`hsl(${color().primary})`}
      />
    ),
  },
  {
    href: "/event",
    text: "Event",
    icon: () => (
      <MaterialIcons name="event" size={32} color={`hsl(${color().primary})`} />
    ),
  },
];

export default function Search() {
  const { data, isLoading } = k.user.profile.useQuery();
  const { session: sesh, signOut } = useAuth();
  const setNotifData = useNotifStore((s) => s.setData);
  const expo_device_token = useNotifStore((s) => s.data.expoPushToken);
  const { data: permit } = useQuery({
    queryKey: ["notif"],
    queryFn: async () => {
      return await Notifications.getPermissionsAsync();
    },
  });

  const addDevice = k.user.addNotifDevice.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => toast.error(message),
  });

  const client = useQueryClient();
  const logout = k.auth.logout.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.refetchQueries({ queryKey: k.user.profile.getKey() });
      signOut();
    },
    onError: ({ message }) => toast.error(message),
  });
  return (
    <>
      <SafeAreaView style={{ flex: 1 }} className="bg-white">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: "#F9F9F9" }}
          className="bg-mainBg"
        >
          <Header />
          <View className="px-4">
            <View className="flex flex-row justify-center gap-10 mb-6">
              {links1.map((link) => {
                const Icon = link.icon;
                return (
                  <View key={link.text} className="flex items-center gap-1">
                    <Link href={link.href ?? "/main/home"} asChild>
                      <Pressable className="bg-white rounded-[10px] flex items-center justify-center w-24 h-24">
                        <View className="border rounded-[10px] border-primary w-20 h-20 flex items-center justify-center">
                          <Icon />
                        </View>
                      </Pressable>
                    </Link>
                    <Text className="text-sm">{link.text}</Text>
                  </View>
                );
              })}
            </View>
            <View className="flex flex-row justify-center gap-10 mt-4 px-4">
              {__DEV__ && (
                <View className="flex items-center justify-center">
                  <Pressable
                    onPress={() => {
                      console.log(sesh?.token);
                      console.log(expo_device_token);
                    }}
                    className="bg-white rounded-[10px] flex items-center justify-center w-24 h-24 active:bg-gray-100"
                  >
                    <View className="border rounded-[10px] border-primary w-20 h-20 flex items-center justify-center">
                      <MaterialCommunityIcons
                        name="clipboard-outline"
                        size={24}
                        color="black"
                      />
                    </View>
                  </Pressable>
                  <Text className="text-sm">Copy</Text>
                </View>
              )}

              {(!expo_device_token ||
                (!permit?.granted &&
                  !data?.data.detail.user.is_notifiable)) && (
                <View className="flex gap-1 items-center justify-center">
                  <View className="bg-white rounded-[10px] flex items-center justify-center w-24 h-24 ">
                    <Pressable
                      onPress={async () => {
                        const res = await registerForPushNotificationsAsync();
                        if (!res) return;
                        setNotifData({ expoPushToken: res });
                        addDevice.mutate({
                          data: {
                            device_push_token: res,
                            device_type: Platform.OS,
                          },
                        });
                      }}
                      className="border rounded-[10px] border-primary w-20 h-20 flex items-center justify-center active:bg-primary/30"
                    >
                      <MaterialIcons
                        name="notification-add"
                        size={24}
                        color={`${color().primary}`}
                      />
                    </Pressable>
                  </View>
                  <View className="flex flex-col justify-center items-center">
                    <Text className="text-sm">Aktifkan Notif</Text>
                  </View>
                </View>
              )}
              <View className="flex gap-1 items-center justify-center">
                <View className="bg-white rounded-[10px] flex items-center justify-center w-24 h-24 ">
                  <Pressable
                    disabled={logout.isPending}
                    onPress={() => {
                      logout.mutate();
                    }}
                    className="border rounded-[10px] border-destructive w-20 h-20 flex items-center justify-center active:bg-destructive/30"
                  >
                    {logout.isPending ? (
                      <ActivityIndicator
                        color={`${color().destructive}`}
                        size={24}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="logout"
                        size={24}
                        color={`hsl(${color().destructive})`}
                      />
                    )}
                  </Pressable>
                </View>
                <Text className="text-sm">Logout</Text>
              </View>
            </View>
          </View>
          <View className="h-40 w-full" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
