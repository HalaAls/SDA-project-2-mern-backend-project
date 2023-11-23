import { check } from "express-validator";

export const productValidation = [
  check('slug').isString().withMessage('Product slug must be a string')
];

export const validateCreateProduct = [
  check('name')
    .trim()
    .notEmpty().withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Product Name should be 3-200 characters long'),
  check('price')
    .trim()
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  check('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 3 }).withMessage('Description should be at least 3 characters long'),
  check('quantity')
    .trim()
    .isNumeric().withMessage('Quantity must be a number')
    .optional({ nullable: true }),
  check('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category id'),
];

export const validateUpdateProduct = [
  check('name')
    .trim()
    .optional({ nullable: true })
    .isLength({ min: 3, max: 200 }).withMessage('Product Name should be 3-200 characters long'),
  check('price')
    .trim()
    .optional({ nullable: true })
    .isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  check('description')
    .trim()
    .optional({ nullable: true })
    .isLength({ min: 3 }).withMessage('Description should be at least 3 characters long'),
  check('quantity')
    .trim()
    .optional({ nullable: true })
    .isNumeric().withMessage('Quantity must be a number'),
  check('category')
    .trim()
    .optional({ nullable: true })
    .isMongoId().withMessage('Invalid category id'),
];
