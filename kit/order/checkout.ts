import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";

type Order = {
  items: {
    type: string;
    item: {
      id: number;
      product_id: number;
      sku: string;
      uid: string;
      price: number;
      stock: number;
      product_name: string;
      cover_image: string;
      options: {
        id: number;
        variant_id: number;
        value: string;
        variant: {
          id: number;
          name: string;
        };
      }[];
    };
    qty: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
};

type AdditionalItem = {
  id: number;
  title: string;
  value: string;
  position: number;
  type: string;
  is_active: number;
  is_fixed: number;
};

type AdditionalCost = {
  item: AdditionalItem;
  up_price: number;
};

type AdditionalDisc = {
  item: AdditionalItem;
  disc_price: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  member: {
    id: number;
    user_id: number;
    name: string;
    no_member: string;
    point: number;
    balance: number;
  };
};

const checkout = {
  preCheckoutQuery: router.query({
    fetcher: async (variables: {
      order?: { id: number | string; type: string; qty: number }[];
      discounts?: {
        coupons?: {
          apply?: boolean;
          code?: string;
        };
      };
    }) => {
      const res = await Axios.post(`/order/pre-checkout`, variables);

      const data = res.data as {
        message: string;
        data: {
          user: User;
          total: number;
          order: Order;
          additional_cost: AdditionalCost[];
          additional_disc: AdditionalDisc[];
        };
      };

      return { ...data, params: variables };
    },
  }),
  preCheckout: router.mutation({
    mutationFn: async (variables: {
      order: { id: number | string; type: string; qty: number }[];
      discounts?: {
        coupons?: {
          apply?: boolean;
          code?: string;
        };
      };
    }) => {
      const res = await Axios.post(`/order/pre-checkout`, variables);

      const data = res.data as {
        message: string;
        data: {
          user: User;
          total: number;
          order: Order;
          additional_cost: AdditionalCost[];
          additional_disc: AdditionalDisc[];
        };
      };

      return { ...data, params: variables };
    },
  }),
  checkout: router.mutation({
    mutationFn: async (variables: {
      order: { id: number | string; type: string; qty: number }[];
    }) => {
      const res = await Axios.post(`/order/checkout`, variables);

      return res.data as {
        message: string;
        data: {
          user: User;
          payment: {
            token: string;
            redirect_url: string;
          };
          order: {
            id: number;
            user_id: number;
            order_number: string;
            total_amount: number;
            raw_total: number;
            status: string;
          };
        };
      };
    },
  }),
};

export { checkout };
