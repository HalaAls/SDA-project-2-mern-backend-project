import express, { Application } from 'express'
import morgan from 'morgan'

import { dev } from './config'
// import usersRouter from './routers/users'
import productsRouter from './routers/products'
import ordersRouter from './routers/orders'
// import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import { connectDB } from './config/db'
import { createHttpError } from './util/createHttpError'
import { errorHandler } from './middlewares/errorHandler'

const app: Application = express()
const PORT: number = dev.app.port

app.use(myLogger)
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
// app.use('/api/users', usersRouter)


app.listen(PORT, () => {
  console.log('Server running http://localhost:' + PORT)
  connectDB()
})

// client error
app.use((req, res, next) => {
  const error = createHttpError(404, "Route not found");
  next(error);
});


// it have to be at the bottom of all routes so they can reach to it
app.use(errorHandler);

// app.use(apiErrorHandler)