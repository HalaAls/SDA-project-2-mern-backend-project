import slugify from 'slugify'
import { ObjectId } from 'mongodb'

import { Category, ICategory } from '../models/category'
import { createHttpError } from '../util/createHttpError'

export const getCategories = async (search = ''): Promise<ICategory[]> => {
  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')
  console.log('search is ', search)
  let searchCategory = {
    $or: [
      { title: { $regex: searchRegExpr } },
      { _id: { $eq: ObjectId.isValid(search) ? new ObjectId(search) : null } },
    ],
  }
  const categories = await Category.find(searchCategory)
  console.log(searchCategory.$or)

  return categories
}

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

export const createCategory = async (title: string) => {
  const categoryExist = await Category.exists({ title })

  if (categoryExist) {
    throw createHttpError(409, 'Category already exists with this title')
  }

  const newCategory = new Category({
    title,
    slug: slugify(title),
  })

  await newCategory.save()
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

export const updateCategoryId = async (
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

export const updateCategorySlug = async (
  slug: string,
  updatedCategory: ICategory
): Promise<ICategory> => {
  const category = await Category.findOneAndUpdate({ slug: slug }, updatedCategory, {
    new: true,
  })

  if (!category) {
    const error = createHttpError(404, 'category does not exist with this slug')
    throw error
  }

  return category
}
