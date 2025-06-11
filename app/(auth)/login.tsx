import { View, Text, ActivityIndicator, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Link } from "expo-router";
import { k } from "~/kit";
import { useAuth } from "~/context/auth";
import { Circle1, Circle2 } from "~/components/circle";
import { useNotifStore } from "~/lib/hooks/useNotifStore";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { toast } from "~/lib/sonner";
import { Image } from "expo-image";

const formSchema = z.object({
  email: z.string().min(1, "Tolong Isi Email").email("Bukan Format Email"),
  password: z.string().min(1, "Tolong Isi Password"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Screen() {
  const [showPass, setShowPass] = useState(false);
  const expo_device_token = useNotifStore((s) => s.data.expoPushToken);
  const { signIn } = useAuth();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      email: "",
      password: "",
    },
  });

  const login = k.auth.login.useMutation({
    onSuccess: async ({ message, data }) => {
      toast.success(message);
      signIn(data);
    },
    onError: ({ message }) => {
      toast.error(message);
      form.setError("email", { message: `${message}` });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView bottomOffset={400}>
        <View className="relative h-[300px] rounded-b-xl flex justify-end">
          <View className="bg-primary z-0 w-full absolute top-0 left-0 rounded-b-xl h-full" />
          <View className="absolute top-0 left-0 z-20">
            <Circle1 />
          </View>
          <View className="absolute top-0 left-0 z-10">
            <Circle2 />
          </View>
          <View className="mb-12 flex ml-7 z-30 relative">
            <View className="relative z-40 rounded-lg">
              <Link href={"/main/home"}>
                <Image
                  contentFit="contain"
                  style={{
                    borderRadius: 8,
                    width: 100,
                    height: 54,
                    zIndex: 40,
                    position: "relative",
                  }}
                  source={require("../../assets/images/logo.png")}
                />
              </Link>
            </View>
            <Text className="text-3xl mb-7 font-medium w-[187px] text-white">
              Selamat datang di{" "}
              <Text className="font-bold">Toko Bazzar Murah</Text>
            </Text>
            <Text className="text-white text-xs font-medium">
              Masuk ke dulu yuk!
            </Text>
          </View>
        </View>
        <Form {...form}>
          <View
            style={{ flex: 1 }}
            className={cn(
              "relative pt-28 px-4",
              Platform.OS === "web" && "pt-10",
            )}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChangeText={field.onChange}
                      placeholder="Isi Email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChangeText={field.onChange}
                      secureTextEntry={!showPass}
                      placeholder="Isi Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <View className="flex items-center flex-row gap-2 mb-4">
              <Checkbox
                aria-labelledby="show-pass"
                checked={showPass}
                onCheckedChange={setShowPass}
              />
              <Label
                nativeID="show-pass"
                onPress={() => setShowPass((o) => !o)}
              >
                Lihat Password
              </Label>
            </View>
            {/* <View className="flex flex-row justify-end mb-4">
              <Text className="text-sm font-medium text-primary/80">
                Lupa Password?
              </Text>
            </View> */}

            <Button
              onPress={form.handleSubmit((v) => {
                console.log(`expodevicetoken: ${expo_device_token}`);
                login.mutate({
                  data: {
                    ...v,
                    device_type: Platform.OS,
                    device_push_token: expo_device_token ?? "123456789",
                  },
                });
              })}
              className=""
              disabled={login.isPending}
            >
              {login.isPending ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Text className="text-white">Masuk</Text>
              )}
            </Button>
          </View>
        </Form>
        <View className="flex items-center justify-center flex-row mt-5">
          <Text>
            Belum Punya Akun?{" "}
            <Link
              href={"/register"}
              className="text-primary/60 font-semibold web:hover:underline"
            >
              Daftar
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
