import { useRef } from "react";
import { Dimensions, View, Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";

const width = Dimensions.get("window").width;
const data = [
  {
    source: require("../../assets/images/flashsale1.webp"),
  },
  {
    source: require("../../assets/images/flashsale1.webp"),
  },
];

const Flashsale = () => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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

  return (
    <>
      <View className="flex flex-col items-center justify-center gap-4">
        <Carousel
          ref={ref}
          width={width - 16}
          height={114}
          data={data}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <View className="rounded-lg flex flex-row mx-4 relative">
              <View className="absolute top-0 left-5 z-10 flex flex-col items-center w-[43px]">
                <View className="absolute top-0 left-0">
                  <Svg
                    width={43}
                    height={56}
                    fill="none"
                    className="absolute top-0 left-0"
                  >
                    <Path
                      fill="#FF3737"
                      d="M0 2a2 2 0 0 1 2-2h39a2 2 0 0 1 2 2v51.764a2 2 0 0 1-2.894 1.789l-17.232-8.616a2 2 0 0 0-1.756-.016L2.861 55.634A2 2 0 0 1 0 53.83V2Z"
                    />
                  </Svg>
                </View>
                <Text className="text-xs font-medium text-white">Wanita</Text>
                <Text className="text-[8px] font-bold text-white">Up to</Text>
                <Text className="text-base font-bold text-white">40%</Text>
              </View>
              <Image
                style={{ height: 114, width: "100%", flex: 1, borderRadius: 8 }}
                source={item.source}
                className="rounded-lg object-cover"
              />
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{
            backgroundColor: "rgba(0,0,0,0.2)",
            width: 10,
            height: 6,
            borderRadius: 3,
          }}
          containerStyle={{ gap: 5, marginTop: 6 }}
          onPress={onPressPagination}
        />
      </View>
    </>
  );
};

export { Flashsale };
