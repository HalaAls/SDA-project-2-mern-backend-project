import { Category, ICategory } from '../models/category'
import { createHttpError } from '../util/createHttpError'

export const findCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findOne({ _id: id })
  if (!category) {
    const error = createHttpError(404, 'category does not exist with this id')
    throw error
  }
  return category
}

export const findCategoryBySlug = async (slug: string): Promise<ICategory> => {
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    const error = createHttpError(404, 'category is not found with this slug')
    throw error
  }
  return category
}

export const removeCategoryById = async (requestedId: string) => {
  console.log(requestedId)
  const category = await Category.findByIdAndDelete(requestedId)
  console.log(category)
  if (!category) {
    const error = createHttpError(404, 'category is not found with this id')
    throw error
  }
  return category
}

export const removeCategoryBySlug = async (requestedSlug: string) => {
  const category = await Category.findOneAndDelete({ slug: requestedSlug })
  if (!category) {
    const error = createHttpError(404, 'category is not found with this slug')
    throw error
  }
  return category
}

export const updateCategory = async (
  id: string,
  updatedCategory: ICategory
): Promise<ICategory> => {
  const category = await Category.findByIdAndUpdate(id, updatedCategory, {
    new: true,
  })

  if (!category) {
    const error = createHttpError(404, 'category does not exist with this id')
    throw error
  }

  return category
}
