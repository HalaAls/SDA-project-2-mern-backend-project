import slugify from 'slugify'

import { sortItems } from '../helper/sortItems'
import { Product, IProduct } from '../models/product'
import { createHttpError } from '../util/createHttpError'
import { deleteImage } from '../helper/deleteImage'

export const getProducts = async (
  page = 1,
  limit = 3,
  minPrice = 0,
  maxPrice = Number.MAX_VALUE,
  sort: string,
  categoryId = '',
  search = ''
) => {
  // pagination
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit

  // search AND filter by price, by category
  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')
  let filterProduct = {
    $or: [{ name: { $regex: searchRegExpr } }, { description: { $regex: searchRegExpr } }],
    price: {
      $gte: minPrice,
      $lte: maxPrice,
    },
    category: categoryId || { $exists: true, $ne: null }, // Include category filter only if it's not empty
  }

  // sort by name, by date Added, by price
  const sortOption = sortItems(sort)

  const products: IProduct[] = await Product.find(filterProduct)
    .skip(skip)
    .populate('category')
    .limit(limit)
    // Add collation option for case-insensitive sorting
    .collation({
      locale: 'en',
      strength: 2,
    })
    .sort(sortOption)

  return {
    products,
    totalPages,
    currentPage: page,
  }
}

export const findProductsBySlug = async (slug: string): Promise<IProduct> => {
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

export const updateProduct = async (slug: string, updatedProduct: IProduct): Promise<IProduct> => {
  const product = await Product.findOneAndUpdate({ slug }, updatedProduct, {
    new: true,
  })

  if (!product) {
    const error = createHttpError(404, 'Product not found')
    throw error
  }

  return product
}

export const createNewProduct = async (image: string, productData: IProduct) => {
  const { name, description, quantity, price, category } = productData

  const productExist = await Product.exists({ name: name })

  if (productExist) {
    image && deleteImage(image, 'products')
    const error = createHttpError(409, 'Product already exists with this name')
    throw error
  }

  const newProduct: IProduct = new Product({
    name: name,
    slug: slugify(name),
    description: description,
    quantity: quantity,
    price: price,
    category: category,
    image: image,
  })

  await newProduct.save()
}
