import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/user'
import { createHttpError } from '../util/createHttpError'
import generateToken from '../util/generateToken'


export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email ,password} = req.body

    const user = await User.findOne({email})
    if (!user) {
      throw createHttpError(404, `User not found with the email ${email}`)
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    console.log(user.password + " = "+ user.password)
    console.log("isPasswordMatch = "+ isPasswordMatch)

    if (!isPasswordMatch) {
      throw createHttpError(401, `Password doesn't match with this email ${email}`)
    }
    if (user.isBanned) {
      throw createHttpError(403, `User is banned with this email ${email}. Please contact the admin`)
    }
    const accessToken = generateToken({_id: user._id})
    res.cookie('accessToken', accessToken, {maxAge: 5 * 60 * 1000, httpOnly: true , sameSite: 'none'})

    res.status(200).json({ message: 'User is logged in successfully' , payload: user})
  } catch (error) {
    next(error)
  }
}


export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
  res.clearCookie('accessToken')

    res.status(200).json({ message: 'User is logged out successfully'})
  } catch (error) {
    next(error)
  }
}