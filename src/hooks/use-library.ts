"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLibrary } from "@/services/api";

export function useLibrary() {
  return useQuery({
    queryKey: ["library"],
    queryFn: fetchLibrary,
  });
}
