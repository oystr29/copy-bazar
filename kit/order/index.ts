import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";
import { checkout } from "./checkout";
import { Meta } from "../meta";

type Order = {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  raw_total: number;
  status: string;

  payments: {
    id: number;
    order_id: number;
    payment_method: number;
    payment_url: string;
    payment_token: string;
    amount: number;
    // transaction_id: null;
    status: string;
    // raw_response: null;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    id: number;
    order_id: number;
    product_variant_id: number;
    qty: number;
    price: number;
    product_variant: {
      id: number;
      product_id: number;
      sku: string;
      uid: string;
      price: number;
      stock: number;
      cover_image: string;
      product_name: string;
      barcode_image: string;
      options: { id: number; variant_id: number; value: string }[];
    };
  }[];
};

const order = router("router", {
  all: router.query({
    fetcher: async () => {
      const res = await Axios.get(`/order`);

      return res.data as {
        message: string;
        data: Order[];
      };
    },
  }),
  single: router.query({
    fetcher: async (variables: { id: string | number }) => {
      const res = await Axios.get(`/order/${variables.id}`);

      return res.data as {
        message: string;
        data: {
          order: Order;
          qr: string | null;
        };
        meta: Meta;
      };
    },
  }),
  scanQuery: router.query({
    fetcher: async (variables: { id: string }) => {
      const res = await Axios.post(`/order/scan`, variables);

      return res.data as {
        message: string;
        data: {
          order: Order & { is_picked: number };
        };
      };
    },
  }),
  scan: router.mutation({
    mutationFn: async (variables: { id: string }) => {
      const res = await Axios.post(`/order/scan`, variables);

      return res.data as {
        message: string;
        data: {
          order: Order;
        };
      };
    },
  }),
  pickup: router.mutation({
    mutationFn: async (variables: { id: string }) => {
      const res = await Axios.post(`/order/pickup`, variables);

      return res.data as {
        message: string;
      };
    },
  }),
  ...checkout,
});

export { order };
