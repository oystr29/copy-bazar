import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { Sheet, useSheetRef } from "~/components/ui/sheet";
import { k } from "~/kit";
import { color } from "~/lib/color";
import { Button } from "~/components/ui/button";
import * as Linking from "expo-linking";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "~/lib/sonner";
import { Skeleton } from "~/components/ui/skeleton";

export default function Screen() {
  const { data } = k.event.all.useQuery();
  const bottomSheetModalRef = useSheetRef();
  const { paddingTop } = useHeader();
  const [id] = useState(-1);
  const snap = useRef(-1);
  const client = useQueryClient();
  const { data: event, isLoading } = k.event.single.useQuery({
    variables: { id },
    enabled: id > 0,
  });
  const join = k.event.join.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.invalidateQueries({ queryKey: k.event.all.getKey() });
    },
  });
  return (
    <>
      <Header title="Event" containerClassName="bg-mainBg" />
      <Sheet
        onChange={(v) => {
          snap.current = v;
        }}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView>
          <View className="px-3 py-5 flex items-center justify-center">
            <Text className="mb-4 text-xl font-semibold">
              Perlihatkan QR Code ini ke Kasir Toko {event?.data.event.uid}
            </Text>
            <Button
              onPress={() => {
                if (!event?.data.redirect_url) return;
                Linking.openURL(event?.data.redirect_url);
              }}
            >
              <Text className="text-white">
                {event?.data.event.is_joined ? "Main" : "Join"}
              </Text>
            </Button>
          </View>
        </BottomSheetView>
      </Sheet>

      <ScrollView style={{ flex: 1, paddingTop }} className="px-4 bg-mainBg ">
        <FlashList
          estimatedItemSize={179}
          data={data?.data}
          ListEmptyComponent={
            isLoading ? (
              <>
                <Loading />
                <Loading />
                <Loading />
              </>
            ) : (
              <Text>Tidak Ada Event</Text>
            )
          }
          renderItem={({ item }) => {
            const isAllowed =
              item.users && item.users.length > 0
                ? item.users[0].pivot.is_allowed
                : true;
            const isjoined =
              item.is_joined &&
              item.users &&
              item.users.length > 0 &&
              isAllowed;
            return (
              <View className="bg-white flex flex-row shadow-lg mb-2">
                <View className="w-20 h-auto p-3 flex items-center justify-center bg-primary/80  relative flex-col">
                  <MaterialCommunityIcons
                    name="gamepad-variant-outline"
                    size={32}
                    color={`hsl(${color().background})`}
                  />
                  <Text
                    numberOfLines={1}
                    className="text-xs font-semibold text-white truncate"
                  >
                    {item.uid}
                  </Text>
                </View>
                <View className="flex-1 p-3">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text className="text-sm">{item.description}</Text>
                  <Text className="text-xs mb-4">{item.type}</Text>
                  {!!isjoined && (
                    <Button
                      onPress={() => {
                        if (item.is_joined) {
                          Linking.openURL(item.redirect_url);
                          return;
                        }
                      }}
                      disabled={join.isPending}
                    >
                      <Text className="text-sm text-white">Main</Text>
                    </Button>
                  )}
                  {!item.is_joined && (
                    <Button
                      onPress={() => {
                        join.mutate({ id: item.id });
                      }}
                      variant={"outline"}
                      disabled={join.isPending}
                    >
                      {join.isPending ? (
                        <ActivityIndicator color={"black"} />
                      ) : (
                        <Text className="text-sm text-black">Join</Text>
                      )}
                    </Button>
                  )}
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
        <MaterialCommunityIcons
          name="gamepad-variant-outline"
          size={32}
          color={`hsl(${color().background})`}
        />
        <Skeleton className={"w-14 h-4"} />
      </View>
      <View className="flex-1 p-3">
        <Skeleton className={"w-60 h-10"} />
        <Skeleton className={"w-20 h-5"} />
        <Skeleton className={"w-10 h-4"} />
        <Skeleton className={"w-52 h-8"} />
      </View>
    </View>
  );
};
