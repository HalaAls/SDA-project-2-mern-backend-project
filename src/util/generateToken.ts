import jwt from 'jsonwebtoken'
import { dev } from '../config'
import { UserType } from '../types'

const generateToken = (tokenPayload : UserType) => {
  return jwt.sign(tokenPayload , dev.app.jwtUserActivationKey, {
    expiresIn: '10m',
  })
}

export default generateToken
