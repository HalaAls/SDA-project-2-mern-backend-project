import express from 'express'
const router = express.Router()

import {
  handleProcessPayment,
  getAllOrdersForAdmin,
  getOrderForUser,
} from '../controllers/orderController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

router.get('/all-orders', isLoggedIn, isAdmin, getAllOrdersForAdmin)
router.post('/process-payment', isLoggedIn, handleProcessPayment)
router.get('/:id([0-9a-fA-F]{24})', getOrderForUser)

export default router
