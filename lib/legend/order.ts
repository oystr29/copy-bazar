import { observable } from "@legendapp/state";
import { inferData, inferVariables } from "react-query-kit";
import { k } from "~/kit";

type Order = inferData<typeof k.order.preCheckout>["data"];
type Params = inferVariables<typeof k.order.preCheckout>;

const order$ = observable<{ data: Order; params: Params }>();

export { order$ };
