import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import mongoose, { ObjectId } from 'mongoose'

import { createHttpError } from '../util/createHttpError'
import * as categoryService from '../services/categoryService'

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string
    console.log(search)
    const categories = await categoryService.getCategories(search)
    res.status(200).send({
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
    const category = await categoryService.findCategoryById(id)
    res.status(200).send({
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
    const category = await categoryService.findCategoryBySlug(slug)
    res.status(200).send({
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
    await categoryService.createCategory(title)

    res.status(201).send({ message: 'New category is created' })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const responce = await categoryService.removeCategoryById(id)
    res.status(200).send({
      message: 'category is deleted',
      payload: responce,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedSlug = req.params.slug
    const responce = await categoryService.removeCategoryBySlug(requestedSlug)
    res.status(200).send({
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

    const category = await categoryService.updateCategoryId(id, updatedCategory)

    res.status(200).send({
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
    const category = await categoryService.updateCategorySlug(requestedSlug, updatedCategory)

    res.status(200).send({
      message: 'return the updated products',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
