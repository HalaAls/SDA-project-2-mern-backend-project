//productValidator.ts
import { check , ValidationChain} from "express-validator";


export const updateProductValidator: ValidationChain[] = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product Name should be at least 3-200 characters long'),
  check('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 1 })
    .withMessage('Price must be a positive number'),
];