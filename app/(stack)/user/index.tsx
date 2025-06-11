import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { z } from "zod";
import { Header, useHeader } from "~/components/layout/header";
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
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { date4Y2M2D, dayjs } from "~/lib/date";
import { k } from "~/kit";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { toast } from "~/lib/sonner";

const formSchema = z
  .object({
    name: z.string().min(1, "Tolong Isi Nama"),
    email: z.string().min(1, "Tolong Isi Email"),
    phone_number: z.string().min(1, "Tolong Isi Nomor Telepon"),
    address: z.string().min(1, "Tolong Isi Alamat"),
    gender: z.string().min(1, "Tolong Pilih Gender"),
    birthdate: z.date(),
    job: z.string().min(1, "Tolong Isi Pekerjaan"),
  })
  .refine(
    ({ phone_number }) => {
      const pn = parsePhoneNumberWithError(phone_number, "ID");
      return pn?.isValid();
    },
    { message: "No. HP tidak sesuai", path: ["phone_number"] },
  );

type FormSchema = z.infer<typeof formSchema>;

const gender = [
  {
    label: "Laki-laki",
    value: "Laki-Laki",
  },
  {
    label: "Perempuan",
    value: "Perempuan",
  },
];
const birthdate = new Date();
export default function Screen() {
  const { paddingTop } = useHeader();
  const router = useRouter();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { data, isLoading } = k.user.profile.useQuery();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: data?.data.name ?? "",
      email: data?.data.email ?? "",
      phone_number: data?.data.detail.phone_number ?? "",
      address: data?.data.detail.address ?? "",
      gender: data?.data.detail.gender ?? "",
      birthdate: dayjs(data?.data.detail.birthdate ?? birthdate).toDate(),
      job: data?.data.detail.job ?? "",
    },
  });

  const client = useQueryClient();
  const edit = k.user.edit.useMutation({
    onSuccess: async ({ message }) => {
      toast.success(message);
      await client.refetchQueries({ queryKey: k.user.profile.getKey() });
      router.back();
    },
    onError: ({ message }) => {
      toast.error(message);
      console.error(message);
    },
  });

  return (
    <>
      <Header title="Edit Profil" />
      <KeyboardAwareScrollView
        style={{ paddingTop, flex: 1 }}
        bottomOffset={400}
        className=""
      >
        <Form {...form}>
          <View style={{ flex: 1 }} className=" px-4">
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
                    <Button
                      variant={"outline"}
                      className="bg-white items-start"
                      onPress={() => setDatePickerVisibility(true)}
                    >
                      <Text>{dayjs(field.value).format("DD MMMM YYYY")}</Text>
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

            <Button
              onPress={form.handleSubmit((data) => {
                edit.mutate({
                  data: { ...data, birthdate: date4Y2M2D(data.birthdate) },
                });
              })}
              disabled={edit.isPending}
            >
              {edit.isPending ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Text className="text-white">Edit</Text>
              )}
            </Button>
          </View>
        </Form>
      </KeyboardAwareScrollView>
    </>
  );
}
