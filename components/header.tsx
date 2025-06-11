import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, Text, View } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "~/lib/color";
import { cn } from "~/lib/utils";

type HeaderProps = {
  title: string;
  className?: string;
  containerClassName?: string;
  headerRight?: () => JSX.Element;
};

const dim_width = Dimensions.get("window").width;
const width = dim_width - (dim_width * 25) / 100;

const Header = (props: HeaderProps) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  return (
    <View style={{}}>
      <View
        className={cn("bg-white mb-4", props.className)}
        style={{
          paddingTop: top + 32,
          paddingHorizontal: 16,
          paddingBottom: 8,
          shadowOffset: {
            width: 0,
            height: 20,
          },
          shadowOpacity: 0.16,
          shadowRadius: 1.51,
          elevation: 20,
          borderBottomRightRadius: 28,
          borderBottomLeftRadius: 28,
        }}
      >
        <View className="flex flex-row items-center justify-between mb-4">
          <BorderlessButton onPress={() => router.back()}>
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color={`hsl(${color().primary})`}
            />
          </BorderlessButton>
          <Text
            // style={{ width }}
            className="text-2xl font-semibold line-clamp-1"
            numberOfLines={1}
          >
            {props.title}
          </Text>
          {props.headerRight ? (
            props.headerRight()
          ) : (
            <View className="h-6 w-6" />
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

export { Header, HeaderProps };
