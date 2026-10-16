import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string) {
  // TODO: how to do this without hardcoding the currency symbols?
  const currencySymbols: Record<string, string> = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "KRW": "₩",
    "CNY": "¥",
    "INR": "₹",
    "BRL": "R$",
    "MXN": "MX$",
  };
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`
}

