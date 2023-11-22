import { Schema, model, Document } from 'mongoose'

export interface ProductInterface extends Document {
  name: string
  slug: string
  description: string
  quantity: number
  price: number
  // category: CategoryInterface['_id']
  createdAt?: string
  updatedAt?: string
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [300, 'Product name must be at most 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product description must be at least 3 characters long'],
    },
    quantity: {
      type: Number,
      default: 1,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

// create the model/collections
export const Product = model<ProductInterface>('Product', productSchema)
