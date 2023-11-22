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

const router = Router()

router.get('/', getAllCategories)
// router.get("/:id", getCategoryById);
router.get('/:slug', getCategoryBySlug)
// router.delete("/:id", deleteCategoryById);
router.delete('/:slug', deleteCategoryBySlug)
router.post('/', createNewCategory)
// router.put("/:id", updateCategoryById);
router.put('/:slug', updateCategoryBySlug)

export default router
