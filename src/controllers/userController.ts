import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import User from '../models/user'
import { createHttpError } from '../util/createHttpError'
import { dev } from '../config'
import { handelSendEmail } from '../helper/sendEmail'
import * as userService from '../services/userService'

import { UserType } from '../types'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })
    if (isUserExists) {
      throw createHttpError(409, `User already exist with the email ${email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
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
    const token = jwt.sign(tokenPayload, dev.app.jwtUserActivationKey, { expiresIn: '10m' })
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

    const decoded = jwt.verify(token, dev.app.jwtUserActivationKey)
    if (!decoded) {
      throw createHttpError(404, `Invalid token !`)
    }
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
export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUserExists = await User.exists({ email: req.body.email })
    if (isUserExists) {
      throw createHttpError(409, `User already exist with the email ${req.body.email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
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

    res.status(200).send({
      message: 'Successfully retrieved all users.',
      payload: {
        users,
        totalPages,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.getUser(email)

    res.json({ message: 'User found successfully', user })
  } catch (error) {
    next(error)
  }
}

export const deleteSingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.deleteUserByEmail(email)
    res.json({ message: 'User deleted successfully', user })
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
      throw createHttpError(409, 'Email already exists')
    }
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // To delete the old image from the public folder
    const prevUserData = await User.findOne({ email })
    if (req.file?.path && prevUserData?.image !== 'public/images/users/default.png')
      prevUserData && fs.unlink(prevUserData.image)

    const user = await userService.updateUserByEmail(email ,updatedUser )

    res.send({ message: 'User is updated', payload: user })
  } catch (error) {
    next(error)
  }
}

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.banUserByEmail(req.params.email)
    res.json({ message: 'Banned the User successfully' })
  } catch (error) {
    next(error)
  }
}

export const unBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.unBanUserByEmail(req.params.email)
    res.json({ message: 'Unbanned the User successfully' })
  } catch (error) {
    next(error)
  }
}
