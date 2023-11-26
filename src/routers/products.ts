//productsRouter.ts
import { Router } from 'express'

import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from '../controllers/productController'
import { uploadImageProduct } from '../middlewares/uploadFile'
import { productValidator } from '../validator/productValidator'

const router = Router()

// GET : /products -> return all products
router.get('/', getAllProducts)

// GET : /products/:slug -> return single product by slug
router.get('/:slug', getProductBySlug)

// DELETE : /products/:slug -> delete single product by slug
router.delete('/:slug', deleteProductBySlug)

// PUT : /products/:slug -> update product by slug
router.put(
  '/:slug',
  uploadImageProduct.single('image'),
  productValidator,
  updateProductBySlug
)

// POST : /products -> create a new product
router.post('/', uploadImageProduct.single('image'), productValidator, createProduct)

export default router
