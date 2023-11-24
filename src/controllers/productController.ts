//productController.ts
import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import { validationResult } from 'express-validator'

import { Product, ProductInterface } from '../models/product'
import { createHttpError } from '../util/createHttpError'
import {
  findProductsBySlug,
  getProducts,
  removeProductsBySlug,
  updateProduct,
} from '../services/productService'

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
    const name = req.body.name
    const slug = req.params.slug
    if (name) req.body.slug = slugify(name)

    const updatedProduct = { ...req.body, image: req.file?.path }

    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const product = await updateProduct(slug, updatedProduct)

    res.send({ message: 'product is updated', payload: product })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, price, category } = req.body

    const productExist = await Product.exists({ name: name })
    if (productExist) {
      const error = createHttpError(409, 'Product already exists with this name')
      throw error
    }
    // Validation checks using express-validator
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const newProduct: ProductInterface = new Product({
      name: name,
      slug: slugify(name),
      description: description,
      quantity: quantity,
      price: price,
      category: category,
      image: req.file?.path,
    })
    await newProduct.save()
    res.status(201).send({ message: 'product is created' })
  } catch (error) {
    next(error)
  }
}
