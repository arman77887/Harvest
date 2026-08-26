import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | { toNumber?: () => number }
): string {
  let numericValue = 0;

  if (typeof amount === "number") {
    numericValue = amount;
  } else if (typeof amount === "string") {
    numericValue = parseFloat(amount);
  } else if (
    amount &&
    typeof amount === "object" &&
    typeof amount.toNumber === "function"
  ) {
    numericValue = amount.toNumber();
  }

  if (isNaN(numericValue)) {
    numericValue = 0;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericValue);
}
