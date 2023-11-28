import fs from 'fs/promises'

import User, { IUser } from '../models/user'
import { createHttpError } from '../util/createHttpError'
import { dev } from '../config'
import { sortItems } from '../helper/sortItems'

export const getUsers = async (page = 1, limit = 3, sort: string, search = '') => {
  const count = await User.countDocuments()
  const totalPages = Math.ceil(count / limit)

  if (page > totalPages) {
    page = totalPages
  }

  const skip = (page - 1) * limit

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
  const update = { isBanned: isBanned };
  const user = await User.findOneAndUpdate({ email: email }, update, { new: true });

  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`);
  }

  return user;
};

