import jwt from 'jsonwebtoken'

import { dev } from '../config'
import { TokenPayload } from '../types'
import { createHttpError } from './createHttpError'

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, dev.app.jwtUserKey, {
    expiresIn: '10m',
  })
}

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, dev.app.jwtUserKey)
  if (!decoded) {
    throw createHttpError(401, 'Invalid token or token expired')
  }
  return decoded
}

// export const createJSONWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
//   try {
//     const token = jwt.sign(tokenPayload, secretKey, {
//       expiresIn: expiresIn,
//     })
//     return token
//   } catch (error) {
//     throw new Error('tokenPayload must be a non-empty object')
//   }
// }

// export const verifyJSONWebToken = (token: string, secretKey: string) => {
//   try {
//     const decoded = jwt.verify(token, secretKey)
//     return decoded
//   } catch (error) {
//     throw new Error('Invalid token')
//   }
// }
