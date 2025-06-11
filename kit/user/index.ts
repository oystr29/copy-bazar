import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";

type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  member: {
    id: number;
    user_id: number;
    name: string;
    no_member: string;
    point: number | null;
    balance: number;
    tier: string;
    tier_expiry_date: string;
    monthly_transaction_total: number;
    last_transaction_date: null;
    created_at: string;
    updated_at: string;
    current_tier: string;
  };
  detail: {
    id: number;
    user_id: number;
    image: string;
    address: string;
    phone_number: string;
    gender: string;
    job: string;
    birthdate: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
      created_at: string;
      updated_at: string;
      is_notifiable: boolean;
    };
  };
};

const user = router("user", {
  profile: router.query({
    fetcher: async () => {
      const res = await Axios.get("/profile");

      return res.data as {
        message: string;
        data: User;
      };
    },
  }),
  edit: router.mutation({
    mutationFn: async (variables: {
      data: {
        name: string;
        birthdate: string;
        email: string;
        phone_number: string;
        job: string;
        address: string;
        gender: string;
      };
    }) => {
      const res = await Axios.post(`/profile/edit`, variables.data);
      return res.data as { message: string };
    },
  }),
  addNotifDevice: router.mutation({
    mutationFn: async (variables: {
      data: {
        device_push_token: string;
        device_type: string;
      };
    }) => {
      const res = await Axios.post("/profile/add-device", variables.data);

      return res.data as { message: string };
    },
  }),
});

export { user };
