"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBooks, fetchBookById } from "@/services/api";
import type { BookFilters } from "@/types";

export function useBooks(filters?: BookFilters) {
  return useQuery({
    queryKey: ["books", filters],
    queryFn: () => fetchBooks(filters),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => fetchBookById(id),
    enabled: !!id,
  });
}
