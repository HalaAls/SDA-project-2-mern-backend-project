import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/user'
import { createHttpError } from '../util/createHttpError'

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUserExists = await User.exists({ email: req.body.email })
    if (isUserExists) {
      throw createHttpError(409, `User already exist with the email ${req.body.email}`)
    }

    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      address: address,
      phone: phone,
      image: imagePath,
    })
    await newUser.save()

    // var token = jwt.sign(newUser, dev.app.jwtUserActivationKey);
    res.status(201).json({
      message: 'user is registered',
    })
  } catch (error) {
    next(error)
  }
}

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUserExists = await User.exists({ email: req.body.email })
    if (isUserExists) {
      throw createHttpError(409, `User already exist with the email ${req.body.email}`)
    }

    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      address: address,
      phone: phone,
      image: imagePath,
    })
    await newUser.save()

    res.status(201).json({
      message: 'Successfully created user',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()
    res.status(200).send({
      message: 'Successfully retrieved all users.',
      users,
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params
    const user = await User.findOne(email)
    if (!user) {
      throw createHttpError(404, `User not found with the email ${email}`)
    }

    res.json({ message: 'User found successfully', user })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params

    const user = await User.findOneAndDelete(email)

    if (!user) {
      throw createHttpError(404, `User not found with the email ${email}`)
    }

    res.json({ message: 'User deleted successfully', user })
  } catch (error) {
    next(error)
  }
}

export const updateUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params

    const updatedUser = { ...req.body, image: req.file?.path }

    const emailExists = await User.exists({ email: updatedUser.email })

    if (emailExists) {
      throw createHttpError(409, 'Email already exists')
    }

    const user = await User.findOneAndUpdate({ email }, updatedUser, {
      new: true,
    })

    if (!user) {
      throw createHttpError(404, `User not found with the email ${req.params}`)
    }

    res.send({ message: 'User is updated', payload: user })
  } catch (error) {
    next(error)
  }
}
