import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";
import { HeaderButton } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import {
  Animated,
  Easing,
  type GestureResponderEvent,
  Platform,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/80 web:hover:opacity-90 active:opacity-90",
        destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
        outline:
          "border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        "border-primary":
          "border border-primary  bg-transparent web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        secondary: "bg-secondary web:hover:opacity-80 active:opacity-80",
        ghost:
          "web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent",
        link: "web:underline-offset-4 web:hover:underline web:focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2 native:h-12 native:px-5 native:py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 native:h-14",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  "web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-destructive-foreground",
        outline: "group-active:text-accent-foreground",
        "border-primary": "group-active:text-accent-foreground",
        secondary:
          "text-secondary-foreground group-active:text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: "text-primary group-active:underline",
      },
      size: {
        default: "",
        sm: "",
        lg: "native:text-lg",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({
        variant,
        size,
        className: "web:pointer-events-none",
      })}
    >
      <Pressable
        className={cn(
          props.disabled && "opacity-50 web:pointer-events-none",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
});
Button.displayName = "Button";

// platform pressable

type HoverEffectProps = {
  color?: string;
  hoverOpacity?: number;
  activeOpacity?: number;
};

type AnimatePressableProps = Omit<
  PressableProps,
  "style" | "onPress" | "ref"
> & {
  href?: string;
  pressColor?: string;
  pressOpacity?: number;
  hoverEffect?: HoverEffectProps;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent,
  ) => void;
  children: React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE =
  Platform.OS === "android" && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const useNativeDriver = Platform.OS !== "web";

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */

const PlatformButton = React.forwardRef<
  React.ElementRef<typeof AnimatedPressable>,
  React.ComponentPropsWithoutRef<typeof AnimatedPressable> &
    AnimatePressableProps
>(
  (
    {
      disabled,
      onPress,
      onPressIn,
      onPressOut,
      android_ripple,
      pressColor,
      pressOpacity = 0.3,
      hoverEffect,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const { dark } = useTheme();
    const [opacity] = React.useState(() => new Animated.Value(1));

    const animateTo = (toValue: number, duration: number) => {
      if (ANDROID_SUPPORTS_RIPPLE) {
        return;
      }

      Animated.timing(opacity, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver,
      }).start();
    };

    const handlePress = (
      e:
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        | GestureResponderEvent,
    ) => {
      if (Platform.OS === "web" && rest.href !== null) {
        // ignore clicks with modifier keys
        const hasModifierKey =
          ("metaKey" in e && e.metaKey) ||
          ("altKey" in e && e.altKey) ||
          ("ctrlKey" in e && e.ctrlKey) ||
          ("shiftKey" in e && e.shiftKey);

        // only handle left clicks
        const isLeftClick =
          "button" in e ? e.button == null || e.button === 0 : true;

        // let browser handle "target=_blank" etc.
        const isSelfTarget =
          e.currentTarget && "target" in e.currentTarget
            ? [undefined, null, "", "self"].includes(e.currentTarget.target)
            : true;

        if (!hasModifierKey && isLeftClick && isSelfTarget) {
          e.preventDefault();
          // call `onPress` only when browser default is prevented
          // this prevents app from handling the click when a link is being opened
          onPress?.(e);
        }
      } else {
        onPress?.(e);
      }
    };

    const handlePressIn = (e: GestureResponderEvent) => {
      animateTo(pressOpacity, 0);
      onPressIn?.(e);
    };

    const handlePressOut = (e: GestureResponderEvent) => {
      animateTo(1, 200);
      onPressOut?.(e);
    };

    return (
      <AnimatedPressable
        {...rest}
        ref={ref}
        accessible
        role={Platform.OS === "web" && rest.href != null ? "link" : "button"}
        onPress={disabled ? undefined : handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={
          ANDROID_SUPPORTS_RIPPLE
            ? {
                color:
                  pressColor !== undefined
                    ? pressColor
                    : dark
                      ? "rgba(255, 255, 255, .32)"
                      : "rgba(0, 0, 0, .32)",
                ...android_ripple,
              }
            : undefined
        }
        style={[
          {
            cursor:
              Platform.OS === "web" || Platform.OS === "ios"
                ? // Pointer cursor on web
                  // Hover effect on iPad and visionOS
                  "pointer"
                : "auto",
            opacity: !ANDROID_SUPPORTS_RIPPLE ? opacity : 1,
          },
          style,
        ]}
      >
        <HoverEffect {...hoverEffect} />
        {children}
      </AnimatedPressable>
    );
  },
);

PlatformButton.displayName = "PlaformButton";

const css = String.raw;

const CLASS_NAME = `__react-navigation_elements_Pressable_hover`;

const CSS_TEXT = css`
  .${CLASS_NAME} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background-color: var(--overlay-color);
    opacity: 0;
    transition: opacity 0.15s;
  }

  a:hover > .${CLASS_NAME}, button:hover > .${CLASS_NAME} {
    opacity: var(--overlay-hover-opacity);
  }

  a:active > .${CLASS_NAME}, button:active > .${CLASS_NAME} {
    opacity: var(--overlay-active-opacity);
  }
`;

const HoverEffect = ({
  color,
  hoverOpacity = 0.08,
  activeOpacity = 0.16,
}: HoverEffectProps) => {
  if (Platform.OS !== "web" || color == null) {
    return null;
  }

  return (
    <>
      {/* @ts-ignore */}
      <style href={CLASS_NAME} precedence="elements">
        {CSS_TEXT}
      </style>
      <div
        className={CLASS_NAME}
        style={{
          // @ts-expect-error: CSS variables are not typed
          "--overlay-color": color,
          "--overlay-hover-opacity": hoverOpacity,
          "--overlay-active-opacity": activeOpacity,
        }}
      />
    </>
  );
};

export {
  Button,
  buttonTextVariants,
  buttonVariants,
  HeaderButton,
  PlatformButton,
};
export type { ButtonProps };
