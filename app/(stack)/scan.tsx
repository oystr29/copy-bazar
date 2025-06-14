import { ActivityIndicator, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { MaterialIcons } from "@expo/vector-icons";
import { k } from "~/kit";
import Svg, { Circle, ClipPath, Defs, G, Path, Use } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { toast } from "~/lib/sonner";
import Head from "expo-router/head";

export default function Screen() {
  const [isScanned, setIsScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const scan = k.order.scan.useMutation({
    onSuccess: async ({ message, data }) => {
      toast.success(message);
      router.push({
        pathname: "/order/[id]",
        params: { id: data.order.id, title: data.order.order_number },
      });
    },
    onError: ({ message }) => {
      toast.error(message);
      setIsScanned(false);
    },
  });

  useEffect(() => {
    return () => {
      setIsScanned(false);
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        className="px-4 gap-3"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Camera />
        <Text className="text-lg font-semibold">
          Scanner membutuhkan akses kamera
        </Text>
        <Button variant={"border-primary"} onPress={requestPermission}>
          <Text className="text-primary">Izinkan Kamera</Text>
        </Button>
      </View>
    );
  }
  return (
    <>
      
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CameraView
          style={{ flex: 1 }}
          facing={"back"}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(e) => {
            console.log(JSON.stringify(e));
            if (isScanned || scan.isPending) return;
            scan.mutate({
              id: e.data,
            });
            setIsScanned(true);
          }}
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              paddingTop: top + 32,
              paddingHorizontal: 8,
              paddingBottom: 8,
            }}
          >
            <HeaderBackButton
              onPress={() => router.back()}
              backImage={() => (
                <MaterialIcons
                  name="arrow-back-ios-new"
                  size={24}
                  color={`white`}
                />
              )}
              // style={{ padding: 4 }}
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View className="relative flex items-center justify-center">
              <View className="absolute">
                <Scan />
                {/* <MaterialCommunityIcons
                  name="scan-helper"
                  size={250}
                  color="white"
                /> */}
              </View>
              {scan.isPending && (
                <ActivityIndicator size={"large"} color={"white"} />
              )}
            </View>
          </View>
        </CameraView>
      </View>
    </>
  );
}

const Camera = () => {
  return (
    <Svg width={64} height={64} viewBox="0 0 128 128">
      <Defs>
        <Path
          id="a"
          d="M113.53 27.22s-3.48-.41-8.94-1.04l-8.86-8.89s0-.01-.01-.01l-.03-.03c-.32-.33-.74-.57-1.21-.61L70.2 14.13c-.41-.04-.78.06-1.08.27l-9.85 6.55c-13.73-1.57-24.99-2.84-26.17-2.9-5.36-.3-7.83-.12-11.17 1.59-.91.35-5.44 3.12-8.02 4.94C2.98 32.97 3.24 43.83 3.24 52.61v35.62c0 5.96 1.81 13.33 8.44 13.33l93.26 10.61c2.18.22 4.11-.69 5.28-2.24 0 .05 13.1-14.63 13.1-14.63.89-.98 1.45-2.29 1.45-3.78v-49.7c-.01-7.48-3.84-14.03-11.24-14.6"
        />
      </Defs>
      <Use fill="#2f2f2f" href="#a" />
      <ClipPath id="b">
        <Use href="#a" />
      </ClipPath>
      <Path
        fill="#78a3ad"
        d="m106.25 114.94-70.7-10.44V30.98l70.7 10.43z"
        clipPath="url(#b)"
      />
      <Path
        fill="#78a3ad"
        d="M5.92 33.21s.16 6.96 5.65 9.15c5.49 2.2 14.46 2.75 23.98-5.49l64.43 6.95s2.87.43 6.56.27c5.62-.25 9.39-2.08 15.23-8.51l5.46-5.29-21.57-3.5-8.5-8.08-28.11-3.25-10.43 5.77-31.15-3.02L8.48 28.27z"
        clipPath="url(#b)"
      />
      <Path
        fill="#78a3ad"
        d="M16.46 37.77s-2.75 3.29-2.75 8.97v40.45s.18 9.9 2.75 15.02l-7.34.36S3.82 98.53 4 87.37V44.72l5.12-14.64 7.16-2.75z"
        clipPath="url(#b)"
      />
      <Path
        fill="#78a3ad"
        d="M24.15 37.77s-2.74 3.29-2.74 8.97v40.45s.18 9.9 2.74 15.02l-7.34.36s-5.31-4.04-5.12-15.2V44.72l5.12-14.64 7.16-2.75z"
        clipPath="url(#b)"
      />
      <Path
        fill="#2f2f2f"
        d="M105.58 114.84c-.3 0-.6-.02-.92-.05l-93.29-10.61h-.03C4.83 104.18.6 98.07.6 88.24V52C.59 43.34.58 31.47 12.3 22.47c2.38-1.68 7.34-4.79 8.68-5.31 3.36-1.73 6.2-2.09 12.26-1.76 1.06.06 8.66.9 25.36 2.81l9.05-6.01c.73-.51 1.86-.8 2.81-.7l24.28 2.51c1.02.1 1.99.57 2.75 1.32.04.04.08.07.11.11l8.19 8.22 8.03.93c8.07.63 13.55 7.55 13.55 17.21v49.7c0 2.06-.75 4.03-2.12 5.55l-.13-.11c-2.94 4.38-12.97 14.75-13.09 14.87-1.3 1.82-3.75 3.03-6.45 3.03M29.64 20.56c-2.82 0-4.4.34-6.5 1.42-.93.4-5 2.84-7.71 4.75C5.86 34.07 5.87 43.6 5.87 52v36.24c0 2.51.42 10.69 5.81 10.69l93.91 10.64c1.02 0 1.94-.45 2.52-1.22.08-.11.17-.21.26-.3.7-.74 8.1-9.03 12.99-14.5.35-.39.77-1.07.77-2.03v-49.7c0-5.2-2.3-11.46-8.8-11.97l-9.04-1.05c-.59-.07-1.14-.34-1.56-.76l-8.78-8.81-23.66-2.44-9.56 6.35c-.52.34-1.15.49-1.76.42-6.09-.7-24.62-2.82-26.01-2.89-1.25-.07-2.34-.11-3.32-.11"
      />
      <Path fill="#2f2f2f" d="m91.7 22.78-11.09 8.19 7.83 11.44 11.7-10.76z" />
      <Path fill="#fff" d="m60.95 29.78 14.08 1.45 6.28 7.67-27.67-3.1z" />
      <Path
        fill="#2f2f2f"
        d="M26.84 32.01c-.25-.9-.76-2.23-4.57-2.85-2.06-.34-4.92.06-6.41 1.62-.68.7-.77 1.88-.77 1.88s-.06 1.89.06 2.65c.12.7.78 1.37 1.39 1.74.9.55 2.02.9 3.11.99.68.05 1.36.05 2.03-.01 1.64-.14 3.38-.61 4.57-1.71.56-.52.65-1.75.65-1.75s.16-1.76-.06-2.56M3.24 51.88s14.26 5.73 19.39 3.53 1.47 13.91 1.47 13.91 2.2 13.18 2.92 21.23C27.76 98.61 24.1 103 24.1 103s-18.3 2.2-19.77-5.12-1.09-46-1.09-46m32.13-1.08 73.22 8.78-1.47 52.72-73.21-9.52-1.26-40.28z"
      />
      <Path
        fill="#78a3ad"
        d="M121.38 94.17c-4.88 5.47-12.33 13.14-13.02 13.88-.09.09-.18.19-.26.3-.58.78-1.5 1.22-2.52 1.22l-93.9-10.65c-1.7 0-3.56-.43-5.69-1.25-2.95-1.3-3.3-1.99-4.76-3.57 1.37 6.32 5.03 10.08 10.12 10.08h.03l93.29 10.61c.31.03.62.05.92.05 2.69 0 5.15-1.21 6.48-3.02.11-.12 10.15-10.24 13.3-14.56l.69-.89c1.16-1.59 1.34-2.79 1.34-4.85l-.04-4c-1.85 2.33-1.88 2.77-5.98 6.65"
      />
      <Defs>
        <Path
          id="c"
          d="M87.41 83.47c-1.93-17.93-18.03-30.9-35.96-28.98-6.15.66-11.7 3.02-16.27 6.52l-.03-.03-8.68 7.24c-5.89 6.64-9.08 15.61-8.06 25.13 1.92 17.93 18.02 30.9 35.95 28.98 3.4-.37 6.61-1.24 9.59-2.54l4.09-1.87.49-.33 6.53-4.9-.03-.03c8.58-6.72 13.63-17.55 12.38-29.19"
        />
      </Defs>
      <Use fill="#2f2f2f" href="#c" />
      <ClipPath id="d">
        <Use href="#c" />
      </ClipPath>
      <Path
        fill="#78a3ad"
        d="m50.46 79.03 26-19.4s-15.57-13-33.32-4.76L17.7 71.53z"
        clipPath="url(#d)"
      />
      <Path
        fill="#fff"
        d="m31.56 70.41 26-19.4s-15.56-13-33.32-4.76L-1.2 62.91z"
        clipPath="url(#d)"
      />
      <Path
        fill="#2f2f2f"
        d="M78.92 90.73c.5 17.19-12.75 31.62-30.46 32.15-17.72.53-32.21-12.33-32.72-29.52s12.43-32.28 30.16-32.8c17.73-.53 32.5 12.98 33.02 30.17"
      />
      <Path
        fill="#fff"
        d="M73.39 90.89c.42 14.23-11.13 26.12-25.8 26.56-14.67.43-26.91-10.75-27.33-24.98-.41-14.22 11.12-26.12 25.79-26.55 14.68-.44 26.92 10.75 27.34 24.97"
      />
      <Path
        fill="#40c0e7"
        d="M66.51 91.38c1.22 11.4-7.03 21.64-18.43 22.86-11.41 1.22-21.64-7.02-22.86-18.42s7.02-21.64 18.42-22.87c11.41-1.22 21.65 7.03 22.87 18.43"
      />
      <Path
        fill="#006ca2"
        d="M49.33 108.52c-10.02.3-18.37-7.52-18.66-17.45-.21-7.31 4-13.73 10.24-16.73C32.3 76.76 26.1 84.72 26.4 93.99c.31 10.94 9.52 19.54 20.53 19.21 10.02-.3 18.08-7.88 19.23-17.48a18.11 18.11 0 0 1-16.83 12.8"
      />
      <Circle
        cx={53.65}
        cy={86.37}
        r={8.15}
        fill="#006ca2"
        transform="rotate(-6.136 53.63 86.341)"
      />
      <Path
        fill="#fff"
        d="M40.29 104.92c-.94-.83-1.95-1.57-2.37-1.97-.97-.94-1.74-2.03-2.47-3.19-.62-.99-1.19-2.43-2.5-2.63-2-.32-2.6 1.89-2.13 3.41.32 1.02.79 2 1.33 2.92 1.05 1.8 7.72 8.14 9.28 3.86.36-1.01-.47-1.81-1.14-2.4m3.61 5.61c-.64-.5-.96-1.33-.36-2.35.53-.91 1.46-1.05 2.42-.77.95.29 1.55 1.54 1.26 2.47-.42 1.42-2.3 1.45-3.32.65"
      />
    </Svg>
  );
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

const Scan = () => {
  const strokeWidth = useSharedValue(0.22917);

  const animatedProps = useAnimatedProps(() => ({
    strokeWidth: strokeWidth.value,
  }));

  useEffect(() => {
    strokeWidth.value = withRepeat(
      withTiming(0.52917, { duration: 1000 }),
      -1, // infinite
      true, // reverse
    );
  }, []);

  return (
    <Svg width={250} height={250} viewBox="0 0 5.2917 5.2917">
      <AnimatedG
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        animatedProps={animatedProps}
        // strokeWidth={0.32917}
      >
        <AnimatedPath d="m5.0271 1.3229v-0.52916a0.52917 0.52917 0 0 0-0.52917-0.52917h-0.52916" />
        <AnimatedPath d="m3.9688 5.0271h0.52916a0.52917 0.52917 0 0 0 0.52917-0.52917v-0.52916" />
        <AnimatedPath d="m0.26458 3.9688v0.52916a0.52917 0.52917 0 0 0 0.52917 0.52917h0.52916" />
        <AnimatedPath d="m1.3229 0.26458h-0.52916a0.52917 0.52917 0 0 0-0.52917 0.52917v0.52916" />
      </AnimatedG>
    </Svg>
  );
};
