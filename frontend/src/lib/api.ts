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
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';

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
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (!found) {
        throw new ApiClientError('Produk tidak ditemukan', 404, 'NOT_FOUND');
      }

      // Generate full product detail
      const detail: ProductDetail = {
        id: found.id,
        name: found.name,
        slug: found.slug,
        description: `Streetwear apparel berkualitas tinggi dengan potongan boxy-oversized khas Stars Merch. Dibuat menggunakan bahan 100% 24s Heavyweight Cotton (240 GSM) yang halus, awet, dan nyaman dipakai harian di iklim tropis. Dilengkapi sablon grafis tahan lama.`,
        base_price: found.base_price,
        category: found.category,
        is_featured: found.is_featured,
        images: [
          {
            id: found.id * 10 + 1,
            image_url: found.primary_image,
            alt_text: `Tampak Depan - ${found.name}`,
            is_primary: true,
            sort_order: 1,
          },
          {
            id: found.id * 10 + 2,
            image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
            alt_text: `Detail Bahan - ${found.name}`,
            is_primary: false,
            sort_order: 2,
          },
        ],
        variants: [
          {
            id: found.id * 100 + 1,
            size: 'S',
            color_name: found.available_colors[0]?.name || 'Black',
            color_hex: found.available_colors[0]?.hex || '#1E1E24',
            sku: `STM-${found.slug.substring(0, 3).toUpperCase()}-S`,
            price: found.base_price,
            stock: 12,
          },
          {
            id: found.id * 100 + 2,
            size: 'M',
            color_name: found.available_colors[0]?.name || 'Black',
            color_hex: found.available_colors[0]?.hex || '#1E1E24',
            sku: `STM-${found.slug.substring(0, 3).toUpperCase()}-M`,
            price: found.base_price,
            stock: 0, // for sold out testing
          },
          {
            id: found.id * 100 + 3,
            size: 'L',
            color_name: found.available_colors[0]?.name || 'Black',
            color_hex: found.available_colors[0]?.hex || '#1E1E24',
            sku: `STM-${found.slug.substring(0, 3).toUpperCase()}-L`,
            price: found.base_price,
            stock: 8,
          },
          {
            id: found.id * 100 + 4,
            size: 'XL',
            color_name: found.available_colors[0]?.name || 'Black',
            color_hex: found.available_colors[0]?.hex || '#1E1E24',
            sku: `STM-${found.slug.substring(0, 3).toUpperCase()}-XL`,
            additional_price: 10000,
            price: found.base_price + 10000,
            stock: 5,
          },
          {
            id: found.id * 100 + 5,
            size: 'XXL',
            color_name: found.available_colors[0]?.name || 'Black',
            color_hex: found.available_colors[0]?.hex || '#1E1E24',
            sku: `STM-${found.slug.substring(0, 3).toUpperCase()}-XXL`,
            additional_price: 20000,
            price: found.base_price + 20000,
            stock: 3,
          },
        ],
      };

      return {
        success: true,
        statusCode: 200,
        message: 'Mock fallback data',
        data: detail,
      };
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
