import 'dotenv/config'

export const dev = {
  app: { port: Number(process.env.PORT) || 5050 },
  db: {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/sda-ecommerce-db',
  },
}
