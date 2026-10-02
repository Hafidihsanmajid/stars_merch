import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import { api } from '@/lib/api';
import { MOCK_PRODUCTS } from '@/lib/mockData';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.getProductBySlug(slug);
    if (res.success && res.data) {
      const product = res.data;
      return {
        title: `${product.name} | Stars Merch`,
        description: product.description.substring(0, 160),
        openGraph: {
          title: `${product.name} | Stars Merch Official`,
          description: product.description.substring(0, 160),
          images: product.images[0]?.image_url ? [product.images[0].image_url] : [],
        },
      };
    }
  } catch {
    // fallback
  }

  return {
    title: 'Detail Produk | Stars Merch',
    description: 'Beli pakaian streetwear official Stars Merch dengan kualitas 100% heavyweight cotton.',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product;
  try {
    const res = await api.getProductBySlug(slug);
    if (res.success && res.data) {
      product = res.data;
    }
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="flex-1 w-full bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Grid: Gallery on Left, Product Info on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Gallery (Col 1-7 on desktop) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              isFeatured={product.is_featured}
            />
          </div>

          {/* Info & Purchase Controls (Col 8-12 on desktop) */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related Products Showcase */}
        <RelatedProducts
          products={MOCK_PRODUCTS}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}
