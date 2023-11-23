import { Schema, model } from 'mongoose'
//test
export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: string
  updatedAt?: string
  _v: number
}

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlenght: [3, 'Category title length must be at least 3 charecters'],
      maxlength: [300, 'Category title length must be at most 100 charecters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'category slug is required'],
    },
  },
  { timestamps: true }
)

// create the model/collections
export const Category = model<ICategory>('Category', categorySchema)
