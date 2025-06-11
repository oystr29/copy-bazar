import * as React from "react";
import {
  TextInput,
  StyleSheet,
  TextStyle,
  View,
  type TextInputProps,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        "web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-white px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground  web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 placeholder:text-muted-foreground",
        props.editable === false && "opacity-50 web:cursor-not-allowed",
        className,
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      {...props}
    />
  );
});

Input.displayName = "Input";

const MaterialInput = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps & {
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    label?: string;
    outlineColor?: string;
    outlineColorFocused?: string;
    isError?: boolean;
  }
>(
  (
    {
      label,
      value,
      onChangeText,
      containerStyle,
      inputStyle,
      labelStyle,
      outlineColor = "#71717A",
      outlineColorFocused = "#056708",
      isError,
      ...props
    },
    ref,
  ) => {
    const [defValue, setDefValue] = React.useState("");
    const inputRef = React.useRef<TextInput | null>(null);
    const [isFocused, setIsFocused] = React.useState(!!value);
    const labelPosition = useSharedValue(value ? 1 : 0);
    const outlineOpacity = useSharedValue(1);

    const handleFocus = () => {
      setIsFocused(true);
      labelPosition.value = 1;
      // outlineOpacity.value = 1;
    };

    const handleBlur = () => {
      const v = defValue ?? value;
      if (!v) {
        setIsFocused(false);
        labelPosition.value = 0;
        // outlineOpacity.value = 0;
      }
    };

    const animatedLabelStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withTiming(labelPosition.value ? -20 : 0, {
              duration: 200,
              easing: Easing.out(Easing.ease),
            }),
          },
          {
            scale: withTiming(labelPosition.value ? 0.8 : 1, {
              duration: 200,
              easing: Easing.out(Easing.ease),
            }),
          },
        ],
        left: withTiming(labelPosition.value ? 14 : 8, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        }),
      };
    });

    const animatedOutlineStyle = useAnimatedStyle(() => {
      let borderColor = "#71717A";
      if (isError) {
        borderColor = "#ff0000";
      } else if (isFocused) {
        borderColor = outlineColorFocused;
      }
      return {
        borderColor,
        opacity: withTiming(outlineOpacity.value, {
          duration: 150,
        }),
      };
    });
    return (
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <View style={[styles.container, containerStyle]}>
          <Animated.View style={[styles.outline, animatedOutlineStyle]} />

          <Animated.Text
            style={[
              styles.label,
              animatedLabelStyle,
              {
                color: isFocused ? outlineColorFocused : "#71717A",
                backgroundColor: "#fff",
              },
              labelStyle,
            ]}
          >
            {label}
          </Animated.Text>

          <TextInput
            {...props}
            ref={ref ?? inputRef}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={(text) => {
              if (onChangeText) onChangeText(text);
              if (!onChangeText) setDefValue(text);

              if (text && !labelPosition.value) {
                labelPosition.value = 1;
                outlineOpacity.value = 1;
              } else if (!text && !isFocused) {
                labelPosition.value = 0;
                // outlineOpacity.value = 1;
              }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

MaterialInput.displayName = "MaterialInput";
const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  outline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 1,
    zIndex: 0,
  },
  label: {
    position: "absolute",
    paddingHorizontal: 4,
    zIndex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    zIndex: 2,
    backgroundColor: "transparent",
  },
});

export { Input, MaterialInput };
