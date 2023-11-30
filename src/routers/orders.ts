import express from 'express'
const router = express.Router()

import { handleProcessPayment, getAllOrders } from '../controllers/orderController' 
import { isLoggedIn, isLoggedOut } from '../middlewares/auth'

router.get('/', getAllOrders)
router.post('/process-payment', isLoggedIn, isLoggedOut, handleProcessPayment)

export default router
