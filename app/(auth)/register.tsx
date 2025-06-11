import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { ControllerRenderProps, useForm } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Circle1, Circle2 } from "~/components/circle";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import parsePhoneNumber from "libphonenumber-js";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { date4Y2M2D, dayjs } from "~/lib/date";
import { Checkbox } from "~/components/ui/checkbox";
import { k } from "~/kit";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { toast } from "~/lib/sonner";
import { useRootContext } from "@rn-primitives/popover";

const formSchema = z
  .object({
    name: z.string().min(1, "Tolong Isi Nama"),
    email: z.string().min(1, "Tolong Isi Email"),
    phone_number: z.string().min(1, "Tolong Isi Nomor Telepon"),
    address: z.string().min(1, "Tolong Isi Alamat"),
    gender: z.string().min(1, "Tolong Pilih Gender"),
    birthdate: z.date(),
    job: z.string().min(1, "Tolong Isi Pekerjaan"),
    password: z.string().min(4, "Tolong Isi Password"),
    confirmation_password: z.string().min(4, "Tolong Isi Konfirmasi Password"),
  })
  .refine(
    ({ phone_number }) => {
      const pn = parsePhoneNumber(phone_number, "ID");
      return pn?.isValid();
    },
    { message: "No. HP tidak sesuai", path: ["phone_number"] },
  )
  .refine(
    ({ password, confirmation_password }) => password === confirmation_password,
    {
      message: "Password dan Konfirmasi Password tidak sama",
      path: ["confirmation_password"],
    },
  );

type FormSchema = z.infer<typeof formSchema>;

const gender = [
  {
    label: "Laki-Laki",
    value: "Laki-Laki",
  },
  {
    label: "Perempuan",
    value: "perempuan",
  },
];

const birthdate = new Date();
export default function Register() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: "",
      email: "",
      phone_number: "",
      address: "",
      gender: "",
      birthdate,
      job: "",
      password: "",
      confirmation_password: "",
    },
  });

  const register = k.auth.register.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(`${message}. Silahkan Login`);
      router.back();
    },
    onError: ({ message }) => toast.error(message),
  });

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          bottomOffset={400}
          showsVerticalScrollIndicator={false}
        >
          <View className="relative bg-[#056708] h-[300px] rounded-b-xl flex justify-end">
            <View className="absolute top-0 left-0">
              <Circle1 />
            </View>
            <View className="absolute top-0 left-0">
              <Circle2 />
            </View>
            <View className="mb-12 flex gap-7 ml-7">
              <Text className="text-3xl font-medium w-[187px] text-white">
                Buat Akun di{" "}
                <Text className="font-bold">Toko Bazzar Murah</Text>
              </Text>
              <Text className="text-white text-xs font-medium">
                Yuk buat akun dulu
              </Text>
            </View>
          </View>
          <Form {...form}>
            <View style={{ flex: 1 }} className="pt-10 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChangeText={field.onChange}
                        placeholder="Isi Nama Lengkap"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>No. HP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChangeText={field.onChange}
                        placeholder="Isi No. HP"
                        keyboardType="phone-pad"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChangeText={field.onChange}
                        placeholder="Isi Alamat"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="mb-1">Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-row gap-6"
                      >
                        {gender.map((v) => (
                          <View
                            key={v.value}
                            className="flex flex-row gap-2 items-center"
                          >
                            <RadioGroupItem
                              aria-labelledby={`label-for-${v.value}`}
                              value={v.value}
                            />
                            <Label
                              nativeID={`label-for-${v.value}`}
                              onPress={() => field.onChange(v.value)}
                            >
                              {v.label}
                            </Label>
                          </View>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => {
                  return (
                    <FormItem className="mb-4">
                      <FormLabel className="mb-2">Tanggal Lahir</FormLabel>
                      {Platform.OS === "web" && (
                        <>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="bg-white items-start"
                                >
                                  <Text>
                                    {dayjs(field.value).format("DD MMMM YYYY")}
                                  </Text>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <DatePicker field={field} />
                            </PopoverContent>
                          </Popover>
                        </>
                      )}
                      {(Platform.OS === "android" || Platform.OS === "ios") && (
                        <>
                          <Button
                            variant={"outline"}
                            className="bg-white items-start"
                            onPress={() => setDatePickerVisibility(true)}
                          >
                            <Text>
                              {dayjs(field.value).format("DD MMMM YYYY")}
                            </Text>
                          </Button>
                          <DateTimePickerModal
                            date={field.value}
                            isVisible={isDatePickerVisible}
                            mode="date"
                            maximumDate={birthdate}
                            onConfirm={(date) => {
                              console.log(date);
                              setDatePickerVisibility(false);
                              field.onChange(date);
                            }}
                            onCancel={() => setDatePickerVisibility(false)}
                          />
                        </>
                      )}
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Pekerjaan</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChangeText={field.onChange}
                        placeholder="Isi Pekerjaan"
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
                        secureTextEntry={!showPassword}
                        onChangeText={field.onChange}
                        placeholder="Isi Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmation_password"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        secureTextEntry={!showPassword}
                        onChangeText={field.onChange}
                        placeholder="Tulis Ulang Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <View className="flex-row gap-4 mb-4">
                <Checkbox
                  checked={showPassword}
                  onCheckedChange={setShowPassword}
                  aria-labelledby={"showpassword"}
                  id="showpassword"
                />
                <Label
                  nativeID="showpassword"
                  onPress={() => setShowPassword((o) => !o)}
                >
                  Lihat Password
                </Label>
              </View>

              <Button
                onPress={form.handleSubmit((data) => {
                  register.mutate({
                    data: { ...data, birthdate: date4Y2M2D(data.birthdate) },
                  });
                })}
              >
                {register.isPending ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <Text className="text-white">Daftar</Text>
                )}
              </Button>
            </View>
          </Form>
          <View className="flex items-center justify-center flex-row mt-5 gap-1">
            <Text>Sudah Punya Akun?</Text>
            <Pressable
              className="text-primary/60 font-semibold"
              onPress={() => router.back()}
            >
              <Text className="text-primary/60 font-semibold web:hover:underline">
                Masuk
              </Text>
            </Pressable>
          </View>
          <View className="h-20 w-full" />
        </KeyboardAwareScrollView>
        <KeyboardToolbar />
      </SafeAreaView>
    </>
  );
}

const DatePicker = ({
  field,
}: {
  field: ControllerRenderProps<FormSchema, "birthdate">;
}) => {
  const popoverCtx = useRootContext();
  return (
    <DayPicker
      captionLayout="dropdown"
      mode="single"
      selected={field.value}
      onSelect={(e) => {
        field.onChange(e);
        popoverCtx.onOpenChange(false);
      }}
    />
  );
};
