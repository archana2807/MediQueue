"use client";

import { useMutation } from "@tanstack/react-query";
import { checkout } from "@/services/api";

export function useCheckout() {
  return useMutation({
    mutationFn: checkout,
  });
}
