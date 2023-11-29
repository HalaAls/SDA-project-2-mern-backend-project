import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import User from '../models/user'
import { createHttpError } from '../util/createHttpError'
import { handelSendEmail } from '../helper/sendEmail'
import * as userService from '../services/userService'
import { UserType } from '../types'
import { generateToken, verifyToken } from '../util/generateToken'
import { deleteImage } from '../helper/deleteImage'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })
    if (isUserExists) {
      // test this case
      imagePath && deleteImage(imagePath, 'users')
      throw createHttpError(409, `User already exist with the email ${email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // test this case
      imagePath && deleteImage(imagePath, 'users')
      return res.status(400).json({ errors: errors.array() })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const tokenPayload: UserType = {
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
    }
    if (imagePath) {
      tokenPayload.image = imagePath
    }
    const token = generateToken(tokenPayload)// Generate activate token
    const emailData = {
      email: email,
      subject: '',
      html: `<h1> Hello ${name} </h1> 
      <p>Please activate your account by clicking on the following link:
      <a href="http://localhost:5050/users/activate/${token} "> click here to activate </a></p>
      `,
    }
    await handelSendEmail(emailData)

    res.status(200).json({
      message: 'Check your email to activate your account',
      token: token,
    })
  } catch (error) {
    next(error)
  }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    if (!token) {
      throw createHttpError(404, `Please provide a token !`)
    }

    const decoded = verifyToken(token)
    await User.create(decoded)

    res.status(201).json({
      message: 'Successfully created user',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Your token has expired!' : 'Invalid token'
      next(createHttpError(401, errorMessage))
    } else {
      next(error)
    }
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUserExists = await User.exists({ email: req.body.email })
    if (isUserExists) {
      req.file?.path && deleteImage(req.file.path, 'users')
      throw createHttpError(409, `User already exist with the email ${req.body.email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.file?.path && deleteImage(req.file.path, 'users')
      return res.status(400).json({ errors: errors.array() })
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

    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 3
    const sort = req.query.sort as string
    const search = req.query.search as string

    const { users, totalPages, currentPage } = await userService.getUsers(page, limit, sort, search)

    if (users.length > 0) {
      res.status(200).send({
        message: 'Successfully retrieved all users.',
        payload: {
          users,
          totalPages,
          currentPage,
        },
      })
    } else {
      res.status(404).send({
        message: 'users is empty',
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.getUser(email)

    res.status(200).json({ message: 'User found successfully', user })
  } catch (error) {
    next(error)
  }
}

export const deleteSingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.deleteUserByEmail(email)

    // to delete the image from the public/images/users folder
    user && deleteImage(user.image, 'users')

    res.status(200).json({ message: 'User deleted successfully', user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params
    const updatedUser = { ...req.body, image: req.file?.path }
    const emailExists = await User.exists({ email: updatedUser.email })

    if (emailExists) {
      updatedUser.image && deleteImage(updatedUser.image, 'users')
      throw createHttpError(409, 'Email already exists')
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      updatedUser.image && deleteImage(updatedUser.image, 'users')
      return res.status(400).json({ errors: errors.array() })
    }

    // to delete the image from the public/images/users folder
    const prevUserData = await User.findOne({ email })
    req.file?.path && prevUserData && deleteImage(prevUserData.image, 'users')

    const user = await userService.updateUserByEmail(email, updatedUser)

    res.status(200).send({ message: 'User is updated', payload: user })
  } catch (error) {
    next(error)
  }
}

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    await userService.updateBanStatus(email, true)
    res.status(200).json({ message: 'Banned the User successfully' })
  } catch (error) {
    next(error)
  }
}

export const unBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    await userService.updateBanStatus(email, false)
    res.status(200).json({ message: 'Unbanned the User successfully' })
  } catch (error) {
    next(error)
  }
}
