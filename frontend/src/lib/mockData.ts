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
