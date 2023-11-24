import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Product, ProductInterface } from '../models/product'
import { createHttpError } from '../util/createHttpError'
import { findProductsBySlug, getProducts, removeProductsBySlug } from '../services/productService'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const minPrice = Number(req.query.minPrice) || 0
    const maxPrice = Number(req.query.maxPrice) || Number.MAX_VALUE
    const category = req.query.category as string
    const { products, totalPages, currentPage } = await getProducts(
      page,
      limit,
      minPrice,
      maxPrice,
      category
    )

    res.send({
      message: 'get all the products',
      payload: {
        products,
        totalPages,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const product = await findProductsBySlug(slug)
    res.send({
      message: 'get a single product',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const product = await removeProductsBySlug(slug)
    res.send({
      message: 'single product is deleted',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.name) req.body.slug = slugify(req.body.name)
    const product = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
    })

    if (!product) {
      const error = createHttpError(404, 'Product not found')
      throw error
    }

    res.send({ message: 'product is updated', payload: product })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, price, category } = req.body
    const image = req.file?.path

    const productExist = await Product.exists({ name: name })
    if (productExist) {
      const error = createHttpError(409, 'Product already exists with this name')
      throw error
    }

    const newProduct: ProductInterface = new Product({
      name: name,
      slug: slugify(name),
      description: description,
      quantity: quantity,
      price: price,
      category: category,
      image: image,
    })
    await newProduct.save()
    res.status(201).send({ message: 'product is created' })
  } catch (error) {
    next(error)
  }
}
