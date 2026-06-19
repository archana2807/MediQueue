import { NextRequest, NextResponse } from "next/server";
import { books } from "@/data/books";
import type { BookFilters, PaginatedResponse, Book } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: BookFilters = {
    category: searchParams.get("category") || undefined,
    language: searchParams.get("language") || undefined,
    subject: searchParams.get("subject") || undefined,
    sort: (searchParams.get("sort") as BookFilters["sort"]) || "popular",
    search: searchParams.get("search") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "12"),
  };

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  if (priceMin || priceMax) {
    filters.priceRange = [
      parseInt(priceMin || "0"),
      parseInt(priceMax || "9999"),
    ];
  }

  let filtered = [...books];

  if (filters.category) {
    filtered = filtered.filter(
      (b) => b.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.language) {
    filtered = filtered.filter(
      (b) => b.language.toLowerCase() === filters.language!.toLowerCase()
    );
  }

  if (filters.subject) {
    filtered = filtered.filter(
      (b) => b.subject.toLowerCase().includes(filters.subject!.toLowerCase())
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(
      (b) => b.price >= filters.priceRange![0] && b.price <= filters.priceRange![1]
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(searchLower) ||
        b.author.toLowerCase().includes(searchLower) ||
        b.description.toLowerCase().includes(searchLower) ||
        b.tags.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  switch (filters.sort) {
    case "latest":
      filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      break;
    case "bestseller":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "price-low":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "popular":
    default:
      filtered.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
      break;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);

  const response: PaginatedResponse<Book> = {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages,
  };

  return NextResponse.json(response);
}
