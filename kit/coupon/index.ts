import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";
import { Meta } from "../meta";

type Coupon = {
  id: number;
  code: string;
  description: string;
  type: string;
  discount_type: string;
  discount_value: string;
  max_discount_value: string | null;
  min_purchase_amount: string;
  start_date: string;
  expiry_date: string;
  usage_limit: number;
  per_user_limit: number;
  is_active: boolean;
  members_only: boolean;
  membership_tier: string;
  availability: string;
  created_at: string;
  updated_at: string;
  usages: number;
};

type Shop = {
  id: number;
  coupon_id: number;
  point_cost: number;
  validity_days: number;
  inventory: number;
  // membership_tier_required: null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

const coupon = router("coupon", {
  all: router.query({
    fetcher: async () => {
      const res = await Axios.get("/coupon");

      return res.data as {
        message: string;
        data: Coupon[];
        meta: Meta;
      };
    },
  }),
  shop: router.query({
    fetcher: async () => {
      const res = await Axios("/shop/coupons");

      return res.data as {
        message: string;
        data: (Coupon & { shop: Shop })[];
      };
    },
  }),
  buy: router.mutation({
    mutationFn: async (variables: { id: number | string }) => {
      const res = await Axios.post(`/shop/coupon/buy`, variables);

      return res.data as { message: string };
    },
  }),
});

export { coupon };
