import jwt from 'jsonwebtoken'
import { dev } from '../config'
import { TokenPayload } from '../types'

const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, dev.app.jwtUserActivationKey, {
    expiresIn: '10m',
  })
}

export default generateToken
