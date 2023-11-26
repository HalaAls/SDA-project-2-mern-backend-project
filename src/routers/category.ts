import { Router } from 'express'
import {
  createNewCategory,
  deleteCategoryById,
  deleteCategoryBySlug,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  updateCategoryBySlug,
} from '../controllers/categoryController'
import { createCategoryValidator , updateCategoryValidator} from '../validator/categoryValidator'

const router = Router()

router.get('/', getAllCategories)
// router.get("/:id", getCategoryById);
router.get('/:slug', getCategoryBySlug)
//router.delete("/:id", deleteCategoryById);
router.delete('/:slug', deleteCategoryBySlug)
router.post('/', createCategoryValidator, createNewCategory)
//router.put("/:id", updateCategoryById);
router.put('/:slug',updateCategoryValidator,  updateCategoryBySlug)

export default router
