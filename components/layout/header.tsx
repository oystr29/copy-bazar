import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "~/lib/color";
import { cn } from "~/lib/utils";
import { HeaderBackButton } from "@react-navigation/elements";
import { useRef, useState } from "react";

type HeaderProps = {
  title: string;
  className?: string;
  headerRight?: () => JSX.Element;
  disableBack?: boolean;
  containerClassName?: string;
};

const headerHeight = 92;

const isWeb = Platform.OS === "web";

const useHeader = () => {
  const { top } = useSafeAreaInsets();
  const [height] = useState(top === 0 ? headerHeight : headerHeight + top - 4);

  return { height: height, paddingTop: height + 16 };
};

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const ref = useRef<View>(null);
  return (
    <View
      ref={ref}
      className={cn("absolute w-full z-10", props.containerClassName)}
    >
      <View
        className={cn(
          "bg-white flex flex-row items-center justify-center",
          isWeb && "bg-mainBg",
          props.className,
        )}
        style={{
          paddingTop: isWeb ? top + 10 : top,
          flex: 1,
          height: top === 0 ? headerHeight : headerHeight + top - 4,
          paddingHorizontal: 8,
          // paddingBottom: 8,
          shadowOffset: {
            width: 0,
            height: isWeb ? 0 : 20,
          },
          shadowOpacity: isWeb ? 0 : 0.16,
          shadowRadius: 1.51,
          elevation: isWeb ? 0 : 20,
          borderBottomRightRadius: isWeb ? 0 : 28,
          borderBottomLeftRadius: isWeb ? 0 : 28,
        }}
      >
        <View
          style={{ flex: 1 }}
          className="flex flex-row items-center justify-between mb-4"
        >
          {!props.disableBack ? (
            <HeaderBackButton
              onPress={() => router.back()}
              backImage={() => (
                <MaterialIcons
                  name="arrow-back-ios-new"
                  size={24}
                  color={`hsl(${color().primary})`}
                />
              )}
              // style={{ padding: 4 }}
            />
          ) : (
            <View className="h-10 w-10" />
          )}
          <Text className="text-2xl font-semibold">{props.title}</Text>
          {props.headerRight ? (
            props.headerRight()
          ) : (
            <View className="h-10 w-10" />
          )}
        </View>
        {/* <Pressable className="flex flex-row items-center justify-center gap-1 bg-[#F6F6F6] h-12 rounded-2xl mb-3.5">
        <AntDesign name="search1" size={20} color="hsl(122, 91%, 21%)" />
        <Text className="text-[#171717]/25">Search the entire product</Text>
      </Pressable> */}
      </View>
    </View>
  );
};

export { Header, HeaderProps, useHeader };
