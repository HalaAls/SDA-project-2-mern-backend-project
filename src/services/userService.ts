import fs from 'fs/promises'
import bcrypt from 'bcrypt'

import User, { IUser } from '../models/user'
import { createHttpError } from '../util/createHttpError'
import { dev } from '../config'
import { sortItems } from '../helper/sortItems'
import { UserType } from '../types'

export const getUsers = async (page = 1, limit = 3, sort: string, search = '') => {
  const count = await User.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  let skip = 0
  // to check if users is empty or not
  if (count > 0) {
    skip = (page - 1) * limit
  }

  const searchRegExpr = new RegExp('.*' + search + '.*', 'i')
  let filterUsers = {
    isAdmin: { $ne: true },
    $or: [
      { name: { $regex: searchRegExpr } },
      { email: { $regex: searchRegExpr } },
      { phone: { $regex: searchRegExpr } },
    ],
  }
  let filterOptions = { password: 0, __v: 0 }

  // sort by name, by date Added
  const sortOption = sortItems(sort)

  const users: IUser[] = await User.find(filterUsers, filterOptions)
    .skip(skip)
    .limit(limit)
    .sort(sortOption)

  return {
    users,
    totalPages,
    currentPage: page,
  }
}

export const getUser = async (email: string) => {
  const user = await User.findOne({ email: email }, { password: 0, __v: 0 })
  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }
  return user
}

export const deleteUserByEmail = async (email: string) => {
  const user = await User.findOneAndDelete({ email: email }, { password: 0, __v: 0 })

  // To delete the old image from the public folder
  if (user?.image !== dev.app.defaultImagePath) {
    user && fs.unlink(user.image)
  }

  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }
  return user
}

export const updateUserByEmail = async (email: string, updatedUser: IUser): Promise<IUser> => {
  const user = await User.findOneAndUpdate({ email }, updatedUser, {
    new: true,
  })

  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }
  return user
}

export const updateBanStatus = async (email: string, isBanned: boolean) => {
  const update = { isBanned: isBanned }
  const user = await User.findOneAndUpdate({ email: email }, update, { new: true })

  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }

  return user
}

export const createTokenPayload = async (userData: IUser, imagePath?: string): Promise<UserType> => {
  const { name, email, password, address, phone } = userData
  const hashedPassword = await bcrypt.hash(password, 10)

  const tokenPayload: UserType = {
    name: name,
    email: email,
    password: hashedPassword,
    address: address,
    phone: phone,
  };
  if (imagePath) {
    tokenPayload.image = imagePath;
  }
  return tokenPayload;
};

export const createEmailData = (name: string, email: string, token: string): { email: string; subject: string; html: string } => {
  return {
    email: email,
    subject: '',
    html: `<h1> Hello ${name} </h1> 
      <p>Please activate your account by clicking on the following link:
      <a href="http://localhost:5050/users/activate/${token} "> click here to activate </a></p>
    `,
  };
};