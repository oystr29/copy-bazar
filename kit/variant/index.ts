import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";

const variant = router("variant", {
  all: router.query({
    fetcher: async (variables: {
      product_id: string;
      params?: {
        variants: string[];
        options: string[];
      };
    }) => {
      const res = await Axios.get(`/variant/${variables.product_id}`, {
        params: variables.params,
      });

      return res.data as {
        message: string;
        data: {
          variants: {
            name: string;
            id: number;
            options: {
              id: string;
              is_active: boolean;
              value: string;
            }[];
          }[];
        };
      };
    },
  }),
  detail: router.query({
    fetcher: async (variables: {
      id: string | number;
      params: { variants: string[]; options: string[] };
    }) => {
      const res = await Axios.get(`/variant/${variables.id}/detail`, {
        params: variables.params,
      });

      return res.data as {
        message: string;
        data: {
          product: {
            id: number;
            name: string;
            description: string;
          };
          variant: {
            id?: number | null;
            sku: string;
            price: number;
            stock: number;
            images: {
              id: number;
              product_variant_id: number;
              url: string;
            }[];
          };
        };
      };
    },
  }),
});

export { variant };
