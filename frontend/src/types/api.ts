// API Specification types matching ARCHITECTURE.md for Stars Merch

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: ApiErrorDetail;
}

// Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  products_count?: number;
  is_active?: boolean;
}

// Product Image
export interface ProductImage {
  id: number;
  product_id?: number;
  image_url: string;
  alt_text?: string | null;
  is_primary: boolean;
  sort_order?: number;
}

// Product Variant
export interface ProductVariant {
  id: number;
  product_id?: number;
  size: string;
  color_name: string;
  color_hex: string;
  sku: string;
  additional_price?: number;
  price: number;
  stock: number;
}

export interface VariantColorOption {
  name: string;
  hex: string;
}

// Product summary for list view & featured
export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  base_price: number;
  primary_image: string;
  available_sizes: string[];
  available_colors: VariantColorOption[];
  total_stock: number;
  is_featured: boolean;
}

// Full Product detail view
export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  is_featured?: boolean;
}

// Cart Item stored in client state
export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  size: string;
  color: string;
  colorHex?: string;
  price: number;
  quantity: number;
  image: string;
  maxStock?: number;
}

// Cart Validation
export interface CartValidateItemPayload {
  variant_id: number;
  quantity: number;
}

export interface CartValidateRequest {
  items: CartValidateItemPayload[];
}

export interface ValidatedCartItem {
  variant_id: number;
  product_name: string;
  variant_info: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  available_stock: number;
  in_stock: boolean;
}

export interface CartValidateResponse {
  is_valid: boolean;
  items: ValidatedCartItem[];
  subtotal: number;
  estimated_shipping: number;
  grand_total: number;
}

// Checkout
export type PaymentMethod = 'bank_transfer_bca' | 'bank_transfer_mandiri' | 'cod';

export interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  payment_method: PaymentMethod;
  notes?: string;
  items: CartValidateItemPayload[];
}

export interface PaymentInstructions {
  bank_name: string;
  account_number: string;
  account_holder: string;
  unique_code?: number;
  transfer_amount: number;
  deadline: string;
}

export interface CheckoutResult {
  order_number: string;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  order_status: 'unprocessed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_instructions?: PaymentInstructions;
}

// Order Status & Confirmation
export interface OrderDetail {
  order_number: string;
  created_at: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    postal_code: string;
  };
  items: {
    product_name: string;
    variant_info: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
  pricing: {
    subtotal: number;
    shipping_cost: number;
    total_amount: number;
  };
  payment_method: PaymentMethod;
  payment_status: string;
  order_status: string;
  notes?: string;
}
