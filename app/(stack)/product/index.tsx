import { useEffect } from "react";
import { ScrollView } from "react-native";
import { Header, useHeader } from "~/components/layout/header";
import { ProductList } from "~/components/layout/product";
import { k } from "~/kit";
import { toast } from "~/lib/sonner";

export default function Screen() {
  const { paddingTop } = useHeader();
  const { data, isLoading, error } = k.product.all.useQuery();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <>
      
      <Header title="Produk" />
      <ScrollView style={{ flex: 1, paddingTop }} className="px-4 bg-white">
        <ProductList data={data?.data} isLoading={isLoading} />
      </ScrollView>
    </>
  );
}
