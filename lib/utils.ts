import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  formatCurrency,
  getSupportedCurrencies,
} from "react-native-format-currency";
import { inferData } from "react-query-kit";
import { k } from "~/kit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortRp(amount: number) {
  if (amount >= 1000000) {
  } else if (amount >= 1000 && amount < 1000000) {
    return `Rp ${Math.round(amount / 1000)}K`;
  }

  return `Rp ${amount}`;
}

export function currency(
  amount?: number | string | null,
  option?: { isRB?: boolean },
) {
  if (!amount)
    return {
      value: "",
      valueNoSymbol: "",
      symbol: "",
    };
  const [value, valueNoSymbol, symbol] = formatCurrency({
    amount: (typeof amount === "string" ? Number(amount) : amount) ?? 0,
    code: "IDR",
  });

  return {
    value,
    valueNoSymbol,
    symbol,
  };
}

// coupon
const couponType: Record<string, string> = {
  discount: "Diskon",
  cashback: "Cashback",
};

function discountTitle(value: string, type: string) {
  if (type === "percentage") return `${Number(value)}%`;

  if (type === "fixed") return currency(Number(value)).value;

  return "";
}

export function couponTitle(item: inferData<typeof k.coupon.all>["data"][0]) {
  const { type, discount_type, discount_value, max_discount_value } = item;
  const max = max_discount_value
    ? `s/d ${currency(Number(max_discount_value)).value}`
    : "";
  return `${couponType[type]} ${discountTitle(discount_value, discount_type)} ${max}`;
}
// end of coupon
