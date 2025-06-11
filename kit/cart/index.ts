import { router } from "react-query-kit";
import { Axios } from "~/lib/axios";

const cart = router("cart", {
  all: router.query({
    fetcher: async () => {
      return {
        status: true,
        message: "berhasil",
        data: {
          id: 1,
          user_id: 4,
          created_at: "2025-06-02T03:33:49.000000Z",
          updated_at: "2025-06-02T03:33:49.000000Z",
          deleted_at: null,
          items: [
            {
              id: 2,
              cart_id: 1,
              product_variant_id: 3,
              bundle_id: null,
              qty: 4,
              created_at: "2025-06-02T03:44:10.000000Z",
              updated_at: "2025-06-03T07:31:04.000000Z",
              deleted_at: null,
              product_variant: {
                id: 3,
                product_id: 2,
                sku: "NEVADA-2-Regular-318",
                uid: "57478182-0168-4e06-92a6-281b1ed181f9",
                price: 50000,
                stock: 6,
                created_at: "2025-06-02T03:33:49.000000Z",
                updated_at: "2025-06-07T05:45:47.000000Z",
                deleted_at: null,
                cover_image:
                  "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                product_name: "Baju Kemeja Kotak-Kotak",
                barcode_image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAAeAQMAAADjK7L0AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADdJREFUOI1j+Mx/mNmG397e+IPNgfPMBh94/vAbGB84//nz4c88h//Y8J/5wDCqZFTJqJKRpgQAAOMBDUxpxk8AAAAASUVORK5CYII=",
                options: [
                  {
                    id: 1,
                    variant_id: 1,
                    value: "Regular",
                    created_at: "2025-06-02T03:33:49.000000Z",
                    updated_at: "2025-06-02T03:33:49.000000Z",
                    pivot: {
                      product_variant_id: 3,
                      variant_item_id: 1,
                    },
                  },
                ],
                product: {
                  id: 2,
                  category_id: 2,
                  name: "Celana Chino",
                  brand: "Nevada",
                  description: "Celana Chino",
                  created_at: "2025-06-02T03:33:49.000000Z",
                  updated_at: "2025-06-07T05:45:46.000000Z",
                  deleted_at: null,
                  image:
                    "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                  price: 50000,
                  product_variants: [
                    {
                      id: 3,
                      product_id: 2,
                      sku: "NEVADA-2-Regular-318",
                      uid: "57478182-0168-4e06-92a6-281b1ed181f9",
                      price: 50000,
                      stock: 6,
                      created_at: "2025-06-02T03:33:49.000000Z",
                      updated_at: "2025-06-07T05:45:47.000000Z",
                      deleted_at: null,
                      cover_image:
                        "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                      product_name: "Baju Kemeja Kotak-Kotak",
                      barcode_image:
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAAeAQMAAADjK7L0AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADdJREFUOI1j+Mx/mNmG397e+IPNgfPMBh94/vAbGB84//nz4c88h//Y8J/5wDCqZFTJqJKRpgQAAOMBDUxpxk8AAAAASUVORK5CYII=",
                      images: [
                        {
                          id: 5,
                          product_variant_id: 3,
                          filename: "23e4b0f5-f5d0-4f1e-921a-d3c0f0b2cf98.jpg",
                          url: "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                          path: null,
                          created_at: "2025-06-02T03:33:49.000000Z",
                          updated_at: "2025-06-02T03:33:49.000000Z",
                        },
                      ],
                    },
                  ],
                },
              },
              bundle: null,
            },
            {
              id: 3,
              cart_id: 1,
              product_variant_id: 2,
              bundle_id: null,
              qty: 2,
              created_at: "2025-06-08T12:42:01.000000Z",
              updated_at: "2025-06-10T01:58:49.000000Z",
              deleted_at: null,
              product_variant: {
                id: 2,
                product_id: 1,
                sku: "BTK-1-L-Biru-476",
                uid: "88a8ff3e-6bfa-4d2f-b447-d8e8330c6ebf",
                price: 50000,
                stock: 2,
                created_at: "2025-06-02T03:33:49.000000Z",
                updated_at: "2025-06-10T03:57:04.000000Z",
                deleted_at: null,
                cover_image:
                  "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                product_name: "Baju Kemeja Kotak-Kotak",
                barcode_image:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAAAeAQMAAAAly3FkAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADBJREFUKJFj+Mx/2N6GhxlIHDjw5zPz5zN/Phjw8wBZhw34mT/bMIzKj8qPyg9aeQBAasU6vScdVwAAAABJRU5ErkJggg==",
                options: [
                  {
                    id: 3,
                    variant_id: 2,
                    value: "L",
                    created_at: "2025-06-02T03:33:49.000000Z",
                    updated_at: "2025-06-02T03:33:49.000000Z",
                    pivot: {
                      product_variant_id: 2,
                      variant_item_id: 3,
                    },
                  },
                  {
                    id: 5,
                    variant_id: 3,
                    value: "Biru",
                    created_at: "2025-06-02T03:33:49.000000Z",
                    updated_at: "2025-06-02T03:33:49.000000Z",
                    pivot: {
                      product_variant_id: 2,
                      variant_item_id: 5,
                    },
                  },
                ],
                product: {
                  id: 1,
                  category_id: 1,
                  name: "Baju Kemeja Kotak-Kotak",
                  brand: "BTK",
                  description: "Baju Kemeja Kotak-Kotak",
                  created_at: "2025-06-02T03:33:49.000000Z",
                  updated_at: "2025-06-07T05:46:04.000000Z",
                  deleted_at: null,
                  image:
                    "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                  price: 50000,
                  product_variants: [
                    {
                      id: 1,
                      product_id: 1,
                      sku: "BTK-1-M-Merah-582",
                      uid: "b5b0a5e1-8af8-4af8-bc35-49b4815cd0e9",
                      price: 50000,
                      stock: 4,
                      created_at: "2025-06-02T03:33:49.000000Z",
                      updated_at: "2025-06-10T04:44:38.000000Z",
                      deleted_at: null,
                      cover_image:
                        "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                      product_name: "Baju Kemeja Kotak-Kotak",
                      barcode_image:
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAAeAQMAAADjK7L0AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADdJREFUOI1j+Mx/2J75zJ8PBvw8fz4z29vwMB+2tzlw/vPnw/zneZht+M98YBhVMqpkVMlIUwIA3WjeMDlLlhUAAAAASUVORK5CYII=",
                      images: [
                        {
                          id: 1,
                          product_variant_id: 1,
                          filename:
                            "Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                          url: "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                          path: null,
                          created_at: "2025-06-02T03:33:49.000000Z",
                          updated_at: "2025-06-02T03:33:49.000000Z",
                        },
                        {
                          id: 2,
                          product_variant_id: 1,
                          filename:
                            "A8f17528fefbe444abd980ae15daaf5eaS.jpeg_720x720q50.jpg",
                          url: "https://s.alicdn.com/@sc04/kf/A8f17528fefbe444abd980ae15daaf5eaS.jpeg_720x720q50.jpg",
                          path: null,
                          created_at: "2025-06-02T03:33:49.000000Z",
                          updated_at: "2025-06-02T03:33:49.000000Z",
                        },
                        {
                          id: 3,
                          product_variant_id: 1,
                          filename:
                            "A1c5a80c8e18e45469ef6a2be5c399108y.jpeg_720x720q50.jpg",
                          url: "https://s.alicdn.com/@sc04/kf/A1c5a80c8e18e45469ef6a2be5c399108y.jpeg_720x720q50.jpg",
                          path: null,
                          created_at: "2025-06-02T03:33:49.000000Z",
                          updated_at: "2025-06-02T03:33:49.000000Z",
                        },
                      ],
                    },
                    {
                      id: 2,
                      product_id: 1,
                      sku: "BTK-1-L-Biru-476",
                      uid: "88a8ff3e-6bfa-4d2f-b447-d8e8330c6ebf",
                      price: 50000,
                      stock: 2,
                      created_at: "2025-06-02T03:33:49.000000Z",
                      updated_at: "2025-06-10T03:57:04.000000Z",
                      deleted_at: null,
                      cover_image:
                        "https://s.alicdn.com/@sc04/kf/Ab8270562318a489987a252022199829de.jpeg_720x720q50.jpg",
                      product_name: "Baju Kemeja Kotak-Kotak",
                      barcode_image:
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAAAeAQMAAAAly3FkAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADBJREFUKJFj+Mx/2N6GhxlIHDjw5zPz5zN/Phjw8wBZhw34mT/bMIzKj8qPyg9aeQBAasU6vScdVwAAAABJRU5ErkJggg==",
                    },
                  ],
                },
              },
              bundle: null,
            },
          ],
        },
      };
    },
  }),
  add: router.mutation({
    mutationFn: async (variables: {
      data: {
        id: string | number;
        qty: number;
        type: string /*bundle or variant*/;
      };
    }) => {
      return {} as { message: string };
    },
  }),
  remove: router.mutation({
    mutationFn: async (variables: {
      data: {
        id: string | number;
        qty: number;
        type: string /*bundle or variant*/;
      };
    }) => {
      return {} as { message: string };
    },
  }),
});

export { cart };
