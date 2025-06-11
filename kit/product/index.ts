import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";
import { Meta } from "../meta";

type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  image: string;
  price: number;
};

type ProductVariant = {
  id: number;
  product_id: number;
  sku: string;
  uid: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
  options: ProductVariantOption[];
  images: ProductVariantImage[];
};

type ProductVariantOption = {
  id: number;
  variant_id: number;
  value: string;
  variant: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

type ProductVariantImage = {
  id: number;
  product_variant_id: number;
  filename: string;
  url: string;
  created_at: string;
  updated_at: string;
};

const product = router("product", {
  all: router.query({
    fetcher: async () => {
      const res = await Axios.get("/product");

      return res.data as { data: Product[]; meta: Meta };
    },
  }),
  single: router.query({
    fetcher: async (variables: { id: string }) => {
      const res = await Axios.get(`/product/${variables.id}`);

      return res.data as {
        data: Product & {
          product_variants: ProductVariant[];
        };
      };
    },
  }),
});

export { product };
