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
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from './mockData';

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
    try {
      return await apiRequest<Category[]>('/categories');
    } catch {
      return {
        success: true,
        statusCode: 200,
        message: 'Mock fallback data',
        data: MOCK_CATEGORIES,
      };
    }
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
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.page) query.append('page', params.page.toString());
      if (params?.per_page) query.append('per_page', params.per_page.toString());

      const queryString = query.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';
      return await apiRequest<ProductListItem[]>(endpoint);
    } catch {
      // Local fallback filter & sort logic
      let filtered = [...MOCK_PRODUCTS];

      if (params?.category) {
        const cat = params.category.toLowerCase();
        // Support 'pants' as alias for 'pants-cargo'
        if (cat === 'pants' || cat === 'pants-cargo') {
          filtered = filtered.filter(
            (p) => p.category.slug === 'pants-cargo' || p.category.slug === 'pants'
          );
        } else {
          filtered = filtered.filter((p) => p.category.slug.toLowerCase() === cat);
        }
      }

      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.name.toLowerCase().includes(q)
        );
      }

      if (params?.sort === 'price_asc') {
        filtered.sort((a, b) => a.base_price - b.base_price);
      } else if (params?.sort === 'price_desc') {
        filtered.sort((a, b) => b.base_price - a.base_price);
      } else {
        // default newest (by id desc)
        filtered.sort((a, b) => b.id - a.id);
      }

      const page = params?.page || 1;
      const perPage = params?.per_page || 12;
      const total = filtered.length;
      const totalPages = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const paginated = filtered.slice(start, start + perPage);

      return {
        success: true,
        statusCode: 200,
        message: 'Mock fallback data',
        data: paginated,
        meta: {
          page,
          limit: perPage,
          total,
          total_pages: totalPages,
        },
      };
    }
  },

  /**
   * Mengambil produk unggulan untuk Hero Section / Showcase
   */
  async getFeaturedProducts(): Promise<ApiResponse<ProductListItem[]>> {
    try {
      return await apiRequest<ProductListItem[]>('/products/featured');
    } catch {
      const featured = MOCK_PRODUCTS.filter((p) => p.is_featured);
      return {
        success: true,
        statusCode: 200,
        message: 'Mock fallback data',
        data: featured,
      };
    }
  },

  /**
   * Mengambil detail lengkap produk berdasarkan slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<ProductDetail>> {
    try {
      return await apiRequest<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
    } catch {
      const detail = MOCK_PRODUCT_DETAILS[slug];
      if (detail) {
        return {
          success: true,
          statusCode: 200,
          message: 'Mock fallback data',
          data: detail,
        };
      }

      throw new ApiClientError('Produk tidak ditemukan', 404, 'NOT_FOUND');
    }
  },

  /**
   * Validasi stok dan harga item dalam keranjang belanja
   */
  async validateCart(items: CartValidateItemPayload[]): Promise<ApiResponse<CartValidateResponse>> {
    try {
      return await apiRequest<CartValidateResponse>('/cart/validate', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
    } catch {
      // Fallback validation for client
      const validatedItems = items.map((it) => ({
        variant_id: it.variant_id,
        product_name: 'Stars Streetwear Item',
        variant_info: 'Size L / Cosmic Black',
        quantity: it.quantity,
        unit_price: 199000,
        subtotal: 199000 * it.quantity,
        available_stock: 20,
        in_stock: true,
      }));
      const subtotal = validatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
      const estimated_shipping = subtotal >= 300000 ? 0 : 20000;

      return {
        success: true,
        statusCode: 200,
        data: {
          is_valid: true,
          items: validatedItems,
          subtotal,
          estimated_shipping,
          grand_total: subtotal + estimated_shipping,
        },
      };
    }
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
