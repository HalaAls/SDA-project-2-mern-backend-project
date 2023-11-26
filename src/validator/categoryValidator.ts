//categoryValidator.ts
import { check, ValidationChain } from 'express-validator'

export const createCategoryValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be at least 3-200 characters long'),
]

export const updateCategoryValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be at least 3-200 characters long'),
]
