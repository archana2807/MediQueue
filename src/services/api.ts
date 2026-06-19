import type { Book, Category, PaginatedResponse, BookFilters, LibraryBook, PurchaseHistory, Review } from "@/types";

const API_BASE = "/api";

export async function fetchBooks(filters?: BookFilters): Promise<PaginatedResponse<Book>> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.category) params.set("category", filters.category);
    if (filters.language) params.set("language", filters.language);
    if (filters.subject) params.set("subject", filters.subject);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.priceRange) {
      params.set("priceMin", filters.priceRange[0].toString());
      params.set("priceMax", filters.priceRange[1].toString());
    }
  }
  const res = await fetch(`${API_BASE}/books?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`${API_BASE}/books/${id}`);
  if (!res.ok) throw new Error("Book not found");
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchLibrary(): Promise<{
  books: LibraryBook[];
  purchaseHistory: PurchaseHistory[];
}> {
  const res = await fetch(`${API_BASE}/library`);
  if (!res.ok) throw new Error("Failed to fetch library");
  return res.json();
}

export async function checkout(data: {
  items: { bookId: string; title: string; price: number; coverImage: string; quantity: number }[];
  couponCode?: string;
  paymentMethod: string;
}): Promise<{
  success: boolean;
  orderId: string;
  total: number;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Checkout failed");
  return res.json();
}
