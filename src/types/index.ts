export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  subject: string;
  language: string;
  coverImage: string;
  previewPages: string[];
  isbn: string;
  pages: number;
  publisher: string;
  publishDate: string;
  isBestSeller: boolean;
  isNew: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bookCount: number;
  color: string;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface LibraryBook {
  id: string;
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  progress: number;
  lastRead: string;
  purchaseDate: string;
  price: number;
}

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  quantity: number;
}

export interface PurchaseHistory {
  id: string;
  bookId: string;
  title: string;
  coverImage: string;
  price: number;
  purchaseDate: string;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
}

export interface BookFilters {
  category?: string;
  priceRange?: [number, number];
  language?: string;
  subject?: string;
  sort?: "popular" | "latest" | "bestseller" | "price-low" | "price-high";
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CheckoutData {
  items: CartItem[];
  couponCode?: string;
  paymentMethod: string;
  total: number;
}
