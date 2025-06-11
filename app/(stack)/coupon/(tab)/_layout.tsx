import type {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  type ParamListBase,
  type TabNavigationState,
} from "@react-navigation/native";
import { usePathname, withLayoutContext } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { color } from "~/lib/color";
import { cn } from "~/lib/utils";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const title: Record<string, string> = {
  index: "Kupon Ku",
  shop: "Beli Kupon",
};

const Tabbar = ({ state, descriptors, navigation }: MaterialTopTabBarProps) => {
  const pathname = usePathname();
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const btnWidth = dimensions.width / state.routes.length;
  const tabPosX = useSharedValue(0);
  const routes = useMemo(() => {
    const v: Record<string, number> = {};
    state.routes.forEach((r, i) => {
      const { name } = r;

      v[name === "index" ? "/coupon" : `/coupon/${name}`] = i;
    });
    return v;
  }, [state.routes]);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (Platform.OS === "web")
      return { transform: `translateX(${tabPosX.value}px)` };

    return { transform: [{ translateX: withSpring(tabPosX.value) }] };
  });
  useEffect(() => {
    if (routes[pathname] !== undefined) {
      tabPosX.value = withSpring(btnWidth * routes[pathname], {
        duration: 1500,
      });
    }
  }, [pathname, tabPosX, btnWidth, routes]);
  return (
    <>
      <View
        onLayout={onTabbarLayout}
        className="bg-white flex flex-row justify-between items-center gap-4 px-4 relative mb-4"
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              backgroundColor: `red`,
              left: -3,
              borderRadius: 40,
              marginHorizontal: 12,
              height: dimensions.height,
              width: btnWidth - 20,
            },
            animatedStyle,
          ]}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            tabPosX.value = withSpring(btnWidth * index, { duration: 1500 });
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <Pressable
              onPress={onPress}
              key={route.name}
              className="active:bg-gray-200"
              style={{
                borderRadius: 99999,
                backgroundColor: "transparent",
                flex: 1,
                paddingVertical: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className={cn("text-gray-500", isFocused && "")}>
                {title[route.name]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

export default function MaterialTopTabsLayout() {
  return (
    <MaterialTopTabs
      tabBar={(props) => <Tabbar {...props} />}
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: `hsl(${color().primary})`,
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          backgroundColor: `hsl(${color().primary})`,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { flex: 1 },
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Kupon Ku" }} />
      <MaterialTopTabs.Screen name="shop" options={{ title: "Beli Kupon" }} />
    </MaterialTopTabs>
  );
}
