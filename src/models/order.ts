import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
},
{ timestamps: true })

export default mongoose.model<OrderDocument>('Order', orderSchema)
