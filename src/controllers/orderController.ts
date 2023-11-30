import { NextFunction, Request, Response } from 'express'
import { IOrder, IOrderProduct, Order } from '../models/order'
import { populate } from 'dotenv'

interface CustomRequest extends Request {
  userId?: string
}

export const getAllOrdersForAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'products',
        populate: { path: 'product', select: 'name price category quantity' },
      })
      .populate('buyer', 'name email phone')
    res.send({ message: 'Orders are returned for the admin', payload: orders })
  } catch (error) {
    next(error)
  }
}

export const handleProcessPayment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItems, payment } = req.body
    const newOrder: IOrder = new Order({
      products:
        cartItems.products.length > 0 &&
        cartItems.products.map((item: IOrderProduct) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      payment: cartItems.payment,
      buyer: req.userId,
    })
    await newOrder.save()
    res.send({ message: 'payment was successful and order is created' })
  } catch (error) {
    next(error)
  }
}

export const getOrderForUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const orders = await Order.find({ buyer: userId })
      .populate({
        path: 'products',
        populate: { path: 'product', select: 'name price category quantity' },
      })
      .populate('buyer', 'name email phone')
    res.send({ message: 'Orders are returned for the user', payload: orders })
  } catch (error) {
    next(error)
  }
}
