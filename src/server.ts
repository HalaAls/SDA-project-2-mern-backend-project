//server.ts
import express, { Application } from 'express'
import morgan from 'morgan'

import { dev } from './config'
import usersRouter from './routers/users'
import productsRouter from './routers/products'
import ordersRouter from './routers/orders'
import categoryRouter from './routers/category'

// import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import { errorHandler } from './middlewares/errorHandler'

import { connectDB } from './config/db'
import { createHttpError } from './util/createHttpError'


const app: Application = express()
const PORT: number = dev.app.port

app.use(myLogger)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
  connectDB()
})

// client error
app.use((req, res, next) => {
  const error = createHttpError(404, 'Route not found')
  next(error)
})

// it have to be at the bottom of all routes so they can reach to it
app.use(errorHandler)

// app.use(apiErrorHandler)
