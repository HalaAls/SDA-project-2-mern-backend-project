import { NextFunction, Request, Response } from 'express'

import * as authService from '../services/authService'
import { generateToken } from '../util/generateToken'
import setAccessTokenCookie from '../util/cookieUtils'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await authService.findUserByEmail(email)
    await authService.isPasswordMatch(user, password)
    await authService.isUserBanned(user)

    const accessToken = generateToken({ _id: user._id })
    setAccessTokenCookie(res, accessToken)

    res.status(200).json({ message: 'User is logged in successfully', payload: user })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken')
    res.status(200).json({ message: 'User is logged out successfully' })
  } catch (error) {
    next(error)
  }
}
