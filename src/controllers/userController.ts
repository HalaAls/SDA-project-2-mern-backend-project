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

    //var token = jwt.sign(newUser, dev.app.jwtUserActivationKey); I am still working

    res.status(201).json({
      message: 'user is registered',
    })
  } catch (error) {
    next(error)
  }
}
