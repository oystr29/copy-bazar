import { ErrorBoundaryProps, Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Text, AppState, Platform } from "react-native";
import { ComponentProps, useEffect } from "react";
import { cn } from "~/lib/utils";
import { k } from "~/kit";
import { useAuth } from "~/context/auth";
import { onAppStateChange } from "~/lib/query";
import { PlatformButton } from "~/components/ui/button";
import { toast } from "~/lib/sonner";
import { BorderlessButton } from "react-native-gesture-handler";

type NameIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];
const Icon = ({ name, isActive }: { name: string; isActive: boolean }) => {
  let icon: { active: NameIcon; inactive: NameIcon } = {
    active: "home",
    inactive: "home-outline",
  };
  let text = "Beranda";

  if (name === "bundle") {
    icon = { active: "tshirt-crew", inactive: "tshirt-crew-outline" };
    text = "Bundle";
  }
  if (name === "member") {
    icon = { active: "account", inactive: "account-outline" };
    text = "Member";
  }
  if (name === "cart") {
    icon = { active: "cart", inactive: "cart-outline" };
    text = "Keranjang";
  }
  if (name === "order") {
    icon = { active: "tag", inactive: "tag-outline" };
    text = "Pesanan";
  }

  return (
    <>
      <MaterialCommunityIcons
        size={24}
        name={isActive ? icon.active : icon.inactive}
        color={isActive ? "hsl(122, 91%, 21%)" : "hsl(240 3.8% 46.1%)"}
      />
      <Text className={cn(isActive ? "text-primary" : "text-muted-foreground")}>
        {text}
      </Text>
    </>
  );
};

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const router = useRouter();
  return (
    <>
      <View style={style.tabbar} className="">
        {state.routes.map((route, i) => {
          const isFocused = state.index === i;
          return (
            <BorderlessButton
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              key={route.name}
              style={style.tabbarItem}
            >
              <Icon name={route.name} isActive={isFocused} />
            </BorderlessButton>
          );
        })}
        <BorderlessButton
          onPress={() => {
            router.navigate("/(stack)/cart");
          }}
          style={style.tabbarItem}
        >
          <Icon name={"cart"} isActive={false} />
        </BorderlessButton>
      </View>
    </>
  );
};

export default function MainLayout() {
  const sesh = useAuth();
  const { error } = k.user.profile.useQuery({
    staleTime: 0,
    enabled: !!sesh.session?.token,
  });

  useEffect(() => {
    if (error && sesh.session?.token) {
      console.error(error.message);
      sesh.signOut();
    }
  }, [error, sesh.session?.token, sesh]);

  useEffect(() => {
    const subs = AppState.addEventListener("change", onAppStateChange);

    return () => subs.remove();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "#05BFDB",
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      {/* <Tabs.Screen name="bundle" /> */}
      <Tabs.Screen name="member" />
      <Tabs.Screen name="order" />
      {/* <Tabs.Screen name="cart" /> */}
      {/* <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <>
      <View style={{ flex: 1 }} className="flex items-center justify-center">
        <Text className="text-destructive mb-4">
          {error.name} - {error.message} - {`${error.cause}`} - {error.stack} -
        </Text>
        <Text onPress={retry}>Coba Lagi?</Text>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  tabbar: {
    width: Platform.OS === "web" ? "100%" : undefined,
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: Platform.OS === "web" ? 0 : 24,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: "#000",
    shadowRadius: Platform.OS === "web" ? 10 : undefined,
    shadowOffset: { width: 0, height: Platform.OS === "web" ? 5 : 10 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
