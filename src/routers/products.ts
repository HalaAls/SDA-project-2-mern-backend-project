import { Router } from 'express'

import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from '../controllers/productController'

const router = Router()

// GET : /products -> return all products
router.get('/', getAllProducts)

// GET : /products/:slug -> return single product by slug
router.get('/:slug', getProductBySlug)

// DELETE : /products/:slug -> delete single product by slug
router.delete('/:slug', deleteProductBySlug)

// PUT : /products/:slug -> update product by slug
router.put('/:slug', updateProductBySlug)

// POST : /products -> create a new product
router.post('/', createProduct)

export default router
