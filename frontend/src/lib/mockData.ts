import { Category, ProductListItem, ProductDetail } from '@/types/api';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Oversized T-Shirts',
    slug: 'oversized-tees',
    description: 'Heavyweight cotton oversized tees with relaxed boxy fit',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    products_count: 3,
    is_active: true,
  },
  {
    id: 2,
    name: 'Hoodies & Sweaters',
    slug: 'hoodies-sweaters',
    description: 'Comfortable heavyweight fleece hoodies and streetwear crewnecks',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    products_count: 2,
    is_active: true,
  },
  {
    id: 3,
    name: 'Pants & Cargo',
    slug: 'pants-cargo',
    description: 'Utilitarian cargo pants and relaxed streetwear trousers',
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    products_count: 2,
    is_active: true,
  },
  {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Everyday streetwear caps, beanies, and tote bags',
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    products_count: 1,
    is_active: true,
  },
];

export const MOCK_PRODUCTS: ProductListItem[] = [
  // 1. Stars Cosmic Heavy Tee
  {
    id: 1,
    name: 'Stars Cosmic Heavy Tee',
    slug: 'stars-cosmic-heavy-tee',
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    base_price: 199000,
    primary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Cosmic Black', hex: '#1E1E24' },
      { name: 'Washed Grey', hex: '#707070' },
    ],
    total_stock: 45,
    is_featured: true,
  },
  // 2. Stars Acid-Wash Vintage Tee
  {
    id: 2,
    name: 'Stars Acid-Wash Vintage Tee',
    slug: 'stars-acid-wash-vintage-tee',
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    base_price: 189000,
    primary_image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Vintage Charcoal', hex: '#2F3542' },
      { name: 'Sand Beige', hex: '#D1C7BD' },
    ],
    total_stock: 67,
    is_featured: true,
  },
  // 3. Stars Cyberpunk Graphic Tee
  {
    id: 3,
    name: 'Stars Cyberpunk Graphic Tee',
    slug: 'stars-cyberpunk-graphic-tee',
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    base_price: 179000,
    primary_image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Pitch Black', hex: '#0A0A0C' },
      { name: 'Off White', hex: '#F5F5F0' },
    ],
    total_stock: 53,
    is_featured: false,
  },
  // 4. Stars Oversized Heavy Hoodie
  {
    id: 4,
    name: 'Stars Oversized Heavy Hoodie',
    slug: 'stars-oversized-heavy-hoodie',
    category: {
      id: 2,
      name: 'Hoodies & Sweaters',
      slug: 'hoodies-sweaters',
    },
    base_price: 349000,
    primary_image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['M', 'L', 'XL', 'XXL'],
    available_colors: [
      { name: 'Jet Black', hex: '#121212' },
      { name: 'Forest Green', hex: '#2D4A3E' },
    ],
    total_stock: 46,
    is_featured: true,
  },
  // 5. Stars Minimalist Boxy Crewneck
  {
    id: 5,
    name: 'Stars Minimalist Boxy Crewneck',
    slug: 'stars-minimalist-boxy-crewneck',
    category: {
      id: 2,
      name: 'Hoodies & Sweaters',
      slug: 'hoodies-sweaters',
    },
    base_price: 299000,
    primary_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Heather Grey', hex: '#9E9E9E' },
      { name: 'Midnight Navy', hex: '#1B263B' },
    ],
    total_stock: 65,
    is_featured: false,
  },
  // 6. Stars Tactical Multi-Pocket Cargo
  {
    id: 6,
    name: 'Stars Tactical Multi-Pocket Cargo',
    slug: 'stars-tactical-multi-pocket-cargo',
    category: {
      id: 3,
      name: 'Pants & Cargo',
      slug: 'pants-cargo',
    },
    base_price: 329000,
    primary_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Army Olive', hex: '#3B413A' },
      { name: 'Matte Black', hex: '#1A1A1A' },
    ],
    total_stock: 71,
    is_featured: true,
  },
  // 7. Stars Relaxed Fit Denim Pants
  {
    id: 7,
    name: 'Stars Relaxed Fit Denim Pants',
    slug: 'stars-relaxed-fit-denim-pants',
    category: {
      id: 3,
      name: 'Pants & Cargo',
      slug: 'pants-cargo',
    },
    base_price: 359000,
    primary_image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Vintage Light Wash', hex: '#7C92A6' },
      { name: 'Raw Indigo', hex: '#1F2937' },
    ],
    total_stock: 51,
    is_featured: false,
  },
  // 8. Stars Signature 6-Panel Dad Cap
  {
    id: 8,
    name: 'Stars Signature 6-Panel Dad Cap',
    slug: 'stars-signature-6-panel-dad-cap',
    category: {
      id: 4,
      name: 'Accessories',
      slug: 'accessories',
    },
    base_price: 129000,
    primary_image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    available_sizes: ['OS'],
    available_colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Khaki Tan', hex: '#C2B280' },
    ],
    total_stock: 45,
    is_featured: false,
  },
];

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  // 1. Stars Cosmic Heavy Tee
  'stars-cosmic-heavy-tee': {
    id: 1,
    name: 'Stars Cosmic Heavy Tee',
    slug: 'stars-cosmic-heavy-tee',
    description: 'T-shirt bergaya streetwear dengan potongan boxy-oversized menggunakan bahan 100% 24s Heavy Cotton (240 GSM). Dilengkapi grafis cosmic screen-printed berdaya tahan tinggi di bagian belakang. Menghadirkan siluet bahu turun (drop shoulder) yang memberikan kesan santai namun tetap kokoh dan berkarakter.',
    base_price: 199000,
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    is_featured: true,
    images: [
      {
        id: 101,
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Cosmic Heavy Tee',
        is_primary: true,
        sort_order: 1,
      },
      {
        id: 102,
        image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Belakang - Stars Cosmic Heavy Tee',
        is_primary: false,
        sort_order: 2,
      },
      {
        id: 103,
        image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Detail Kerah & Jahitan - Stars Cosmic Heavy Tee',
        is_primary: false,
        sort_order: 3,
      },
    ],
    variants: [
      { id: 101, size: 'S', color_name: 'Cosmic Black', color_hex: '#1E1E24', sku: 'STM-CSM-BLK-S', price: 199000, stock: 12 },
      { id: 102, size: 'M', color_name: 'Cosmic Black', color_hex: '#1E1E24', sku: 'STM-CSM-BLK-M', price: 199000, stock: 0 }, // Out of stock testing
      { id: 103, size: 'L', color_name: 'Cosmic Black', color_hex: '#1E1E24', sku: 'STM-CSM-BLK-L', price: 199000, stock: 8 },
      { id: 104, size: 'XL', color_name: 'Cosmic Black', color_hex: '#1E1E24', sku: 'STM-CSM-BLK-XL', additional_price: 10000, price: 209000, stock: 4 },
      { id: 105, size: 'S', color_name: 'Washed Grey', color_hex: '#707070', sku: 'STM-CSM-GRY-S', price: 199000, stock: 6 },
      { id: 106, size: 'M', color_name: 'Washed Grey', color_hex: '#707070', sku: 'STM-CSM-GRY-M', price: 199000, stock: 10 },
      { id: 107, size: 'L', color_name: 'Washed Grey', color_hex: '#707070', sku: 'STM-CSM-GRY-L', price: 199000, stock: 5 },
      { id: 108, size: 'XL', color_name: 'Washed Grey', color_hex: '#707070', sku: 'STM-CSM-GRY-XL', additional_price: 10000, price: 209000, stock: 2 },
    ],
  },

  // 2. Stars Acid-Wash Vintage Tee
  'stars-acid-wash-vintage-tee': {
    id: 2,
    name: 'Stars Acid-Wash Vintage Tee',
    slug: 'stars-acid-wash-vintage-tee',
    description: 'Kaos vintage acid-wash bertekstur unik dan lembut di kulit. Dibuat dengan teknik pencucian khusus menghasilkan gradasi warna autentik. Setiap potong kaos memiliki corak acid-wash yang tidak pernah persis sama, menjadikannya koleksi personal yang berharga.',
    base_price: 189000,
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    is_featured: true,
    images: [
      {
        id: 201,
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Acid-Wash Vintage Tee',
        is_primary: true,
        sort_order: 1,
      },
      {
        id: 202,
        image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Detail Bahan - Stars Acid-Wash Vintage Tee',
        is_primary: false,
        sort_order: 2,
      },
    ],
    variants: [
      { id: 109, size: 'S', color_name: 'Vintage Charcoal', color_hex: '#2F3542', sku: 'STM-ACD-CHR-S', price: 189000, stock: 15 },
      { id: 110, size: 'M', color_name: 'Vintage Charcoal', color_hex: '#2F3542', sku: 'STM-ACD-CHR-M', price: 189000, stock: 8 },
      { id: 111, size: 'L', color_name: 'Vintage Charcoal', color_hex: '#2F3542', sku: 'STM-ACD-CHR-L', price: 189000, stock: 12 },
      { id: 112, size: 'XL', color_name: 'Vintage Charcoal', color_hex: '#2F3542', sku: 'STM-ACD-CHR-XL', additional_price: 10000, price: 199000, stock: 5 },
      { id: 113, size: 'S', color_name: 'Sand Beige', color_hex: '#D1C7BD', sku: 'STM-ACD-SND-S', price: 189000, stock: 8 },
      { id: 114, size: 'M', color_name: 'Sand Beige', color_hex: '#D1C7BD', sku: 'STM-ACD-SND-M', price: 189000, stock: 10 },
      { id: 115, size: 'L', color_name: 'Sand Beige', color_hex: '#D1C7BD', sku: 'STM-ACD-SND-L', price: 189000, stock: 6 },
      { id: 116, size: 'XL', color_name: 'Sand Beige', color_hex: '#D1C7BD', sku: 'STM-ACD-SND-XL', additional_price: 10000, price: 199000, stock: 0 }, // Out of stock testing
    ],
  },

  // 3. Stars Cyberpunk Graphic Tee
  'stars-cyberpunk-graphic-tee': {
    id: 3,
    name: 'Stars Cyberpunk Graphic Tee',
    slug: 'stars-cyberpunk-graphic-tee',
    description: 'Kaos graphic neon print futuristik bergaya neo-Tokyo cyberpunk dengan potongan boxy drop-shoulder. Menggunakan sablon plastisol discharge berketahanan tinggi yang tidak kaku dan menyatu dengan serat kain.',
    base_price: 179000,
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    is_featured: false,
    images: [
      {
        id: 301,
        image_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Cyberpunk Graphic Tee',
        is_primary: true,
        sort_order: 1,
      },
      {
        id: 302,
        image_url: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Belakang - Stars Cyberpunk Graphic Tee',
        is_primary: false,
        sort_order: 2,
      },
    ],
    variants: [
      { id: 117, size: 'S', color_name: 'Pitch Black', color_hex: '#0A0A0C', sku: 'STM-CYB-BLK-S', price: 179000, stock: 10 },
      { id: 118, size: 'M', color_name: 'Pitch Black', color_hex: '#0A0A0C', sku: 'STM-CYB-BLK-M', price: 179000, stock: 14 },
      { id: 119, size: 'L', color_name: 'Pitch Black', color_hex: '#0A0A0C', sku: 'STM-CYB-BLK-L', price: 179000, stock: 9 },
      { id: 120, size: 'XL', color_name: 'Pitch Black', color_hex: '#0A0A0C', sku: 'STM-CYB-BLK-XL', additional_price: 10000, price: 189000, stock: 4 },
      { id: 121, size: 'S', color_name: 'Off White', color_hex: '#F5F5F0', sku: 'STM-CYB-WHT-S', price: 179000, stock: 5 },
      { id: 122, size: 'M', color_name: 'Off White', color_hex: '#F5F5F0', sku: 'STM-CYB-WHT-M', price: 179000, stock: 7 },
      { id: 123, size: 'L', color_name: 'Off White', color_hex: '#F5F5F0', sku: 'STM-CYB-WHT-L', price: 179000, stock: 6 },
      { id: 124, size: 'XL', color_name: 'Off White', color_hex: '#F5F5F0', sku: 'STM-CYB-WHT-XL', additional_price: 10000, price: 189000, stock: 2 },
    ],
  },

  // 4. Stars Oversized Heavy Hoodie
  'stars-oversized-heavy-hoodie': {
    id: 4,
    name: 'Stars Oversized Heavy Hoodie',
    slug: 'stars-oversized-heavy-hoodie',
    description: 'Hoodie oversized 330 GSM cotton fleece dengan double-layered hood dan saku kangguru yang luas. Hangat, tebal, dan mempertahankan bentuk boxy sempurna saat dikenakan.',
    base_price: 349000,
    category: {
      id: 2,
      name: 'Hoodies & Sweaters',
      slug: 'hoodies-sweaters',
    },
    is_featured: true,
    images: [
      {
        id: 401,
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Oversized Heavy Hoodie',
        is_primary: true,
        sort_order: 1,
      },
      {
        id: 402,
        image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Detail Bahan - Stars Oversized Heavy Hoodie',
        is_primary: false,
        sort_order: 2,
      },
    ],
    variants: [
      { id: 125, size: 'M', color_name: 'Jet Black', color_hex: '#121212', sku: 'STM-HOD-BLK-M', price: 349000, stock: 10 },
      { id: 126, size: 'L', color_name: 'Jet Black', color_hex: '#121212', sku: 'STM-HOD-BLK-L', price: 349000, stock: 12 },
      { id: 127, size: 'XL', color_name: 'Jet Black', color_hex: '#121212', sku: 'STM-HOD-BLK-XL', additional_price: 15000, price: 364000, stock: 6 },
      { id: 128, size: 'XXL', color_name: 'Jet Black', color_hex: '#121212', sku: 'STM-HOD-BLK-XXL', additional_price: 25000, price: 374000, stock: 3 },
      { id: 129, size: 'M', color_name: 'Forest Green', color_hex: '#2D4A3E', sku: 'STM-HOD-GRN-M', price: 349000, stock: 8 },
      { id: 130, size: 'L', color_name: 'Forest Green', color_hex: '#2D4A3E', sku: 'STM-HOD-GRN-L', price: 349000, stock: 7 },
      { id: 131, size: 'XL', color_name: 'Forest Green', color_hex: '#2D4A3E', sku: 'STM-HOD-GRN-XL', additional_price: 15000, price: 364000, stock: 4 },
      { id: 132, size: 'XXL', color_name: 'Forest Green', color_hex: '#2D4A3E', sku: 'STM-HOD-GRN-XXL', additional_price: 25000, price: 374000, stock: 0 }, // Out of stock testing
    ],
  },

  // 5. Stars Minimalist Boxy Crewneck
  'stars-minimalist-boxy-crewneck': {
    id: 5,
    name: 'Stars Minimalist Boxy Crewneck',
    slug: 'stars-minimalist-boxy-crewneck',
    description: 'Sweater crewneck berpotongan cropped-boxy dengan bordir logo Stars Merch subtle di bagian dada kiri. Terbuat dari premium french terry yang adem dan nyaman digunakan seharian.',
    base_price: 299000,
    category: {
      id: 2,
      name: 'Hoodies & Sweaters',
      slug: 'hoodies-sweaters',
    },
    is_featured: false,
    images: [
      {
        id: 501,
        image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Minimalist Boxy Crewneck',
        is_primary: true,
        sort_order: 1,
      },
    ],
    variants: [
      { id: 133, size: 'S', color_name: 'Heather Grey', color_hex: '#9E9E9E', sku: 'STM-CRW-GRY-S', price: 299000, stock: 8 },
      { id: 134, size: 'M', color_name: 'Heather Grey', color_hex: '#9E9E9E', sku: 'STM-CRW-GRY-M', price: 299000, stock: 15 },
      { id: 135, size: 'L', color_name: 'Heather Grey', color_hex: '#9E9E9E', sku: 'STM-CRW-GRY-L', price: 299000, stock: 10 },
      { id: 136, size: 'XL', color_name: 'Heather Grey', color_hex: '#9E9E9E', sku: 'STM-CRW-GRY-XL', additional_price: 15000, price: 314000, stock: 5 },
      { id: 137, size: 'S', color_name: 'Midnight Navy', color_hex: '#1B263B', sku: 'STM-CRW-NAV-S', price: 299000, stock: 6 },
      { id: 138, size: 'M', color_name: 'Midnight Navy', color_hex: '#1B263B', sku: 'STM-CRW-NAV-M', price: 299000, stock: 9 },
      { id: 139, size: 'L', color_name: 'Midnight Navy', color_hex: '#1B263B', sku: 'STM-CRW-NAV-L', price: 299000, stock: 8 },
      { id: 140, size: 'XL', color_name: 'Midnight Navy', color_hex: '#1B263B', sku: 'STM-CRW-NAV-XL', additional_price: 15000, price: 314000, stock: 4 },
    ],
  },

  // 6. Stars Tactical Multi-Pocket Cargo
  'stars-tactical-multi-pocket-cargo': {
    id: 6,
    name: 'Stars Tactical Multi-Pocket Cargo',
    slug: 'stars-tactical-multi-pocket-cargo',
    description: 'Celana cargo teknis dengan 6 kantong fungsional, bahan katun ripstop kokoh anti-sobek, serta tali serut adjustable di pergelangan kaki untuk fleksibilitas gaya jogger maupun straight fit.',
    base_price: 329000,
    category: {
      id: 3,
      name: 'Pants & Cargo',
      slug: 'pants-cargo',
    },
    is_featured: true,
    images: [
      {
        id: 601,
        image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Tactical Multi-Pocket Cargo',
        is_primary: true,
        sort_order: 1,
      },
    ],
    variants: [
      { id: 141, size: 'S', color_name: 'Army Olive', color_hex: '#3B413A', sku: 'STM-CRG-OLV-S', price: 329000, stock: 7 },
      { id: 142, size: 'M', color_name: 'Army Olive', color_hex: '#3B413A', sku: 'STM-CRG-OLV-M', price: 329000, stock: 11 },
      { id: 143, size: 'L', color_name: 'Army Olive', color_hex: '#3B413A', sku: 'STM-CRG-OLV-L', price: 329000, stock: 9 },
      { id: 144, size: 'XL', color_name: 'Army Olive', color_hex: '#3B413A', sku: 'STM-CRG-OLV-XL', additional_price: 15000, price: 344000, stock: 4 },
      { id: 145, size: 'S', color_name: 'Matte Black', color_hex: '#1A1A1A', sku: 'STM-CRG-BLK-S', price: 329000, stock: 10 },
      { id: 146, size: 'M', color_name: 'Matte Black', color_hex: '#1A1A1A', sku: 'STM-CRG-BLK-M', price: 329000, stock: 14 },
      { id: 147, size: 'L', color_name: 'Matte Black', color_hex: '#1A1A1A', sku: 'STM-CRG-BLK-L', price: 329000, stock: 12 },
      { id: 148, size: 'XL', color_name: 'Matte Black', color_hex: '#1A1A1A', sku: 'STM-CRG-BLK-XL', additional_price: 15000, price: 344000, stock: 5 },
    ],
  },

  // 7. Stars Relaxed Fit Denim Pants
  'stars-relaxed-fit-denim-pants': {
    id: 7,
    name: 'Stars Relaxed Fit Denim Pants',
    slug: 'stars-relaxed-fit-denim-pants',
    description: 'Celana jeans 13.5 oz non-stretch denim dengan potongan relaxed straight leg dan efek washing vintage autentik. Memberikan siluet streetwear klasik dengan kenyamanan maksimal.',
    base_price: 359000,
    category: {
      id: 3,
      name: 'Pants & Cargo',
      slug: 'pants-cargo',
    },
    is_featured: false,
    images: [
      {
        id: 701,
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Relaxed Fit Denim Pants',
        is_primary: true,
        sort_order: 1,
      },
    ],
    variants: [
      { id: 149, size: 'S', color_name: 'Vintage Light Wash', color_hex: '#7C92A6', sku: 'STM-DNM-LGT-S', price: 359000, stock: 5 },
      { id: 150, size: 'M', color_name: 'Vintage Light Wash', color_hex: '#7C92A6', sku: 'STM-DNM-LGT-M', price: 359000, stock: 8 },
      { id: 151, size: 'L', color_name: 'Vintage Light Wash', color_hex: '#7C92A6', sku: 'STM-DNM-LGT-L', price: 359000, stock: 7 },
      { id: 152, size: 'XL', color_name: 'Vintage Light Wash', color_hex: '#7C92A6', sku: 'STM-DNM-LGT-XL', additional_price: 15000, price: 374000, stock: 3 },
      { id: 153, size: 'S', color_name: 'Raw Indigo', color_hex: '#1F2937', sku: 'STM-DNM-IND-S', price: 359000, stock: 6 },
      { id: 154, size: 'M', color_name: 'Raw Indigo', color_hex: '#1F2937', sku: 'STM-DNM-IND-M', price: 359000, stock: 10 },
      { id: 155, size: 'L', color_name: 'Raw Indigo', color_hex: '#1F2937', sku: 'STM-DNM-IND-L', price: 359000, stock: 8 },
      { id: 156, size: 'XL', color_name: 'Raw Indigo', color_hex: '#1F2937', sku: 'STM-DNM-IND-XL', additional_price: 15000, price: 374000, stock: 4 },
    ],
  },

  // 8. Stars Signature 6-Panel Dad Cap
  'stars-signature-6-panel-dad-cap': {
    id: 8,
    name: 'Stars Signature 6-Panel Dad Cap',
    slug: 'stars-signature-6-panel-dad-cap',
    description: 'Topi baseball 6-panel dengan bahan katun twill berkualitas dan bordir Stars Merch 3D di bagian depan. Dilengkapi strap gesper logam di belakang untuk ukuran yang dapat disesuaikan.',
    base_price: 129000,
    category: {
      id: 4,
      name: 'Accessories',
      slug: 'accessories',
    },
    is_featured: false,
    images: [
      {
        id: 801,
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan - Stars Signature 6-Panel Dad Cap',
        is_primary: true,
        sort_order: 1,
      },
    ],
    variants: [
      { id: 157, size: 'OS', color_name: 'Obsidian Black', color_hex: '#111111', sku: 'STM-CAP-BLK-OS', price: 129000, stock: 25 },
      { id: 158, size: 'OS', color_name: 'Khaki Tan', color_hex: '#C2B280', sku: 'STM-CAP-KHK-OS', price: 129000, stock: 20 },
    ],
  },
};
