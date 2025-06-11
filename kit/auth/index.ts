import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";
import { Session } from "./schema";

const auth = router("auth", {
  login: router.mutation({
    mutationFn: async (variables: {
      data: {
        email: string;
        password: string;
        device_push_token: string;
        device_type?: string;
      };
    }) => {
      const res = await Axios.post("/login", variables.data);

      const data = (await res.data) as {
        message: string;
        data: Session;
      };

      return data;
    },
  }),
  register: router.mutation({
    mutationFn: async (variables: {
      data: {
        email: string;
        password: string;
        phone_number: string;
        name: string;
        address: string;
        gender: string;
        job: string;
        birthdate: string;
      };
    }) => {
      const res = await Axios.post("/register", variables.data);

      return res.data as { message: string };
    },
  }),
  logout: router.mutation({
    mutationFn: async () => {
      const res = await Axios.post("/logout");

      return res.data as { message: string };
    },
  }),
});

export { auth };
