import slugify from 'slugify'
import { ObjectId } from 'mongodb'

import { Category, ICategory } from '../models/category'
import { createHttpError } from '../util/createHttpError'
import { sortItems } from '../helper/sortItems'

export const getCategories = async (search = '', sort: string): Promise<ICategory[]> => {
  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')
  console.log('search is ', search)
  let searchCategory = {
    $or: [
      { name: { $regex: searchRegExpr } },
      { _id: { $eq: ObjectId.isValid(search) ? new ObjectId(search) : null } },
    ],
  }

  // sort by name, by date Added
  const sortOption = sortItems(sort)

  const categories = await Category.find(searchCategory)
    // Add collation option for case-insensitive sorting
    .collation({
      locale: 'en',
      strength: 2,
    })
    .sort(sortOption)

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

export const createCategory = async (name: string) => {
  const categoryExist = await Category.exists({ name })

  if (categoryExist) {
    throw createHttpError(409, 'Category already exists with this name')
  }

  const newCategory = new Category({
    name,
    slug: slugify(name),
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
