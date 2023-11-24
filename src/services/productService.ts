//productService.ts
import { Product, ProductInterface } from '../models/product'
import { createHttpError } from '../util/createHttpError'

export const getProducts = async (page = 1, limit = 3) => {
  // to count products
  const count = await Product.countDocuments();
  const totalPages = Math.ceil(count / limit);

  if (page > totalPages) {
    page = totalPages;
  }
  const skip = (page - 1) * limit;

  const products: ProductInterface[] = await Product.find()
    .skip(skip)
    .populate("category")
    .limit(limit);

  return {
    products,
    totalPages,
    currentPage: page,
  };
};

export const findProductsBySlug = async (slug: string): Promise<ProductInterface> => {
  const product = await Product.findOne({ slug: slug });

  if (!product) {
    throw createHttpError(404, "Product Not found");
  }
  return product;
};

export const removeProductsBySlug = async (slug: string) => {
  const product = await Product.findOneAndDelete({ slug: slug });
  if (!product) {
    throw createHttpError(404, "Product Not found");
  }
  return product
}

export const updateProduct = async (
  slug: string,
  updatedProduct: ProductInterface
): Promise<ProductInterface> => {
  const product = await Product.findOneAndUpdate({ slug }, updatedProduct, {
    new: true,
  })

  if (!product) {
    const error = createHttpError(404, 'Product not found')
    throw error
  }

  return product
}
