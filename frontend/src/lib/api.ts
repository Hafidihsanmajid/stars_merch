import {
  ApiResponse,
  ApiErrorResponse,
  Category,
  ProductListItem,
  ProductDetail,
  CartValidateItemPayload,
  CartValidateResponse,
  CheckoutPayload,
  CheckoutResult,
  OrderDetail,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  details?: Record<string, string[]>;

  constructor(message: string, statusCode: number, code?: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;
    const errorMessage = errorData?.error?.message || response.statusText || 'Terjadi kesalahan pada server';
    const errorCode = errorData?.error?.code || `HTTP_${response.status}`;
    const errorDetails = errorData?.error?.details;

    throw new ApiClientError(errorMessage, response.status, errorCode, errorDetails);
  }

  return data as ApiResponse<T>;
}

export const api = {
  /**
   * Mengambil semua kategori aktif
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiRequest<Category[]>('/categories');
  },

  /**
   * Mengambil daftar katalog produk dengan filter, sort, dan pagination
   */
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<ProductListItem[]>> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return apiRequest<ProductListItem[]>(endpoint);
  },

  /**
   * Mengambil produk unggulan untuk Hero Section / Showcase
   */
  async getFeaturedProducts(): Promise<ApiResponse<ProductListItem[]>> {
    return apiRequest<ProductListItem[]>('/products/featured');
  },

  /**
   * Mengambil detail lengkap produk berdasarkan slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<ProductDetail>> {
    return apiRequest<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
  },

  /**
   * Validasi stok dan harga item dalam keranjang belanja
   */
  async validateCart(items: CartValidateItemPayload[]): Promise<ApiResponse<CartValidateResponse>> {
    return apiRequest<CartValidateResponse>('/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  /**
   * Mengirim data checkout pesanan
   */
  async checkout(payload: CheckoutPayload): Promise<ApiResponse<CheckoutResult>> {
    return apiRequest<CheckoutResult>('/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Mengambil status dan detail pesanan publik untuk halaman konfirmasi / pelacakan
   */
  async getOrder(orderNumber: string, email: string): Promise<ApiResponse<OrderDetail>> {
    const query = new URLSearchParams({ email });
    return apiRequest<OrderDetail>(`/orders/${encodeURIComponent(orderNumber)}?${query.toString()}`);
  },
};
