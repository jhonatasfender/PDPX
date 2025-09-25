import { PublicCatalogProductDTO, PublicImageDTO } from "@pdpx/types";

export class ProductPublicMapper {
  public static toPublicCatalog(
    item: PublicCatalogProductDTO,
  ): PublicCatalogProductDTO {
    return {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      brand: item.product.brand,
      sku: item.product.sku,
      description: item.product.description,
      images: item.images.map((img: PublicImageDTO) => ({
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
