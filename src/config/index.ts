import 'dotenv/config'

export const dev = {
  app: {
    port: Number(process.env.PORT) || 5050,
    defaultImagePath: process.env.DEFAULT_IMAGE_PATH || 'public/images/users/default.png',
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'shhhhh',
    smtpUsername: process.env.SMTP_USERNAME || 'amlalgamdi.80@gmail.com',
    smtpPassword: process.env.SMTP_PASSWORD || 'noxo hymh pees teql',
  }, 
  db: {
    url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/sda-ecommerce-db',
  },
}
