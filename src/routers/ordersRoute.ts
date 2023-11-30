import express from 'express'

import {
  handleProcessPayment,
  getAllOrdersForAdmin,
  getOrderForUser,
  updateOrderStatus,
} from '../controllers/orderController'
import { isAdmin, isLoggedIn } from '../middlewares/auth'

const router = express.Router()

router.get('/all-orders', isLoggedIn, isAdmin, getAllOrdersForAdmin)
router.post('/process-payment', isLoggedIn, handleProcessPayment)
router.get('/:id([0-9a-fA-F]{24})', getOrderForUser)
router.put('/:id([0-9a-fA-F]{24})', isLoggedIn, isAdmin, updateOrderStatus)

export default router
