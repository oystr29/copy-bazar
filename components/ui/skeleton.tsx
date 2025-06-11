import { cssInterop } from "nativewind";
import * as React from "react";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";

const duration = 1000;

const WebAnimatedView = cssInterop(Animated.View, { className: "style" });

const AnimatedView = Platform.OS ? WebAnimatedView : Animated.View;

function Skeleton({
  className,
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof Animated.View>) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <AnimatedView
      className={cn(
        "rounded-md h-5 w-20 bg-secondary dark:bg-muted",
        className,
      )}
      style={[animStyle, style]}
      {...props}
    />
  );
}

function SkeletonLoad({
  className,
  style,
  isLoading,
  ...props
}: React.ComponentPropsWithoutRef<typeof Animated.View> & {
  isLoading?: boolean;
  children?: React.ReactNode;
}) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  if (isLoading) {
    return (
      <AnimatedView
        {...props}
        children={undefined}
        className={cn(
          "rounded-md h-5 w-20 bg-secondary dark:bg-muted",
          className,
        )}
        style={[animStyle, style]}
      />
    );
  }

  return props.children;
}

function SkeletonLoading<T>({
  className,
  style,
  isLoading,
  data,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "children"> & {
  isLoading?: boolean;
  data?: T;
  children: (value: T) => React.ReactNode;
}): React.ReactNode {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
      -1,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  if (isLoading || !data) {
    return (
      <AnimatedView
        {...props}
        children={undefined}
        className={cn(
          "rounded-md h-5 w-20 bg-secondary dark:bg-muted",
          className,
        )}
        style={[animStyle, style]}
      />
    );
  }

  return props.children(data);
}

export { Skeleton, SkeletonLoad, SkeletonLoading };
