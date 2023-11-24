//productService.ts
import { Product, ProductInterface } from '../models/product'
import { createHttpError } from '../util/createHttpError'

interface IProductFilter {
  price?: {
    $gte?: number
    $lte?: number
  }
  category?: string // Add this line
}

export const getProducts = async (
  page = 1,
  limit = 3,
  minPrice: number,
  maxPrice: number,
  category?: string
) => {
  // to count products
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)
  let filterProduct: IProductFilter = {}

  if (page > totalPages) {
    page = totalPages
  }
  if (minPrice && maxPrice) {
    filterProduct.price = { $gte: minPrice, $lte: maxPrice }
  } else if (minPrice) {
    filterProduct.price = { $gte: minPrice }
  } else if (maxPrice) {
    filterProduct.price = { $lte: maxPrice }
  }

  if (category) {
    filterProduct.category = category
  }
  const skip = (page - 1) * limit

  const products: ProductInterface[] = await Product.find(filterProduct)
    .skip(skip)
    .populate('category')
    .limit(limit)

  return {
    products,
    totalPages,
    currentPage: page,
  }
}

export const findProductsBySlug = async (slug: string): Promise<ProductInterface> => {
  const product = await Product.findOne({ slug: slug })

  if (!product) {
    throw createHttpError(404, 'Product Not found')
  }
  return product
}

export const removeProductsBySlug = async (slug: string) => {
  const product = await Product.findOneAndDelete({ slug: slug })
  if (!product) {
    throw createHttpError(404, 'Product Not found')
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
