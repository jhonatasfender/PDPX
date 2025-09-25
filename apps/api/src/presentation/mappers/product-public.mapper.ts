type PublicImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  position: number;
};
type PublicItemInput = {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    description: string;
    stock: number;
    isActive: boolean;
  };
  images: PublicImage[];
  price?: { currency: string; amountCents: number } | null;
};

export class ProductPublicMapper {
  public static toPublicCatalog(item: PublicItemInput) {
    return {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      brand: item.product.brand,
      sku: item.product.sku,
      description: item.product.description,
      images: item.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        position: img.position,
      })),
      price: item.price
        ? { currency: item.price.currency, amountCents: item.price.amountCents }
        : { currency: "BRL", amountCents: 0 },
      stock: item.product.stock,
      isActive: item.product.isActive,
    };
  }
}
