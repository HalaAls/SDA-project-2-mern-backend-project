import express, { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import mongoose from 'mongoose'

import { Category, ICategory } from '../models/category'
import { createHttpError } from '../util/createHttpError'
import {
  findCategoryById,
  findCategoryBySlug,
  removeCategoryBySlug,
} from '../services/categoryService'

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories: ICategory[] = await Category.find()
    res.send({
      message: 'return all the categoties',
      payload: categories,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      const error = createHttpError(400, 'id format is not valid')
      next(error)
    } else {
      next(error)
    }
  }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const category = await findCategoryById(id)
    res.send({
      message: 'return single product',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug
    const category = await findCategoryBySlug(slug)
    res.send({
      message: 'return single category',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body

    const categoryExist = await Category.exists({ title: title })
    if (categoryExist) {
      const error = createHttpError(404, 'category alredy exist with this title')
      throw error
    }
    const newCategory = new Category({
      title: title,
      slug: slugify(title),
    })
    await newCategory.save()
    res.status(201).send({
      message: 'new category is created',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const responce = await Category.findByIdAndDelete(id)
    if (!responce) {
      const error = createHttpError(404, 'Id does not exist')
      throw error
    }
    res.json({
      message: 'category is deleted',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedSlug = req.params.slug
    const responce = await removeCategoryBySlug(requestedSlug)
    res.json({
      message: 'product is deleted',
      payload: responce,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const updatedCategory = req.body
    const updatedTitle = req.body.title

    if (updatedTitle) {
      req.body.slug = slugify(updatedTitle)
    }

    const category = await Category.findByIdAndUpdate(id, updatedCategory, {
      new: true,
    })

    if (!category) {
      const error = createHttpError(404, 'category does not exist with this id')
      throw error
    }
    res.json({
      message: 'return the updated category',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedSlug = req.params.slug
    const updatedCategory = req.body
    const updatedTitle = req.body.title

    if (updatedTitle) {
      req.body.slug = slugify(updatedTitle)
    }
    const category = await Category.findOneAndUpdate({ slug: requestedSlug }, updatedCategory, {
      new: true,
    })
    if (!category) {
      const error = createHttpError(404, 'category does not exist with this slug')
      throw error
    }
    res.send({
      message: 'return the updated products',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
