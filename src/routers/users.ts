// import express from 'express'

// import ApiError from '../errors/ApiError'
// import User from '../models/user'
// const router = express.Router()

// router.param('userId', (req, res, next, userId) => {
//   const user = users.find((user) => user.id === userId)
//   if (!user) {
//     next(ApiError.badRequest('user id is required.'))
//     return
//   }
//   req.user = user
//   next()
// })

// router.delete('/:userId', (req, res) => {
//   const updatedUsers = users.filter((user) => user.id !== req.user.id)
//   res.json({ users: updatedUsers })
// })
// router.put('/:userId', (req, res) => {
//   const { first_name } = req.body

//   const updatedUsers = users.map((user) => {
//     if (user.id === req.user.id) {
//       return {
//         ...user,
//         first_name,
//       }
//     }
//     return user
//   })
//   res.json({ users: updatedUsers })
// })

// router.post('/', (req, res, next) => {
//   const { id, first_name } = req.body

//   if (!id || !first_name) {
//     next(ApiError.badRequest('id and username are required'))
//     return
//   }
//   const updatedUsers = [{ id, first_name }, ...users]
//   res.json({
//     msg: 'done',
//     users: updatedUsers,
//   })
// })

// router.get('/:userId/page/:page', (req, res) => {
//   res.json({
//     msg: 'done',
//     user: req.user,
//   })
// })

// router.get('/', async (_, res) => {
//   const users = await User.find().populate('order')
//   res.json({
//     users,
//   })
// })

// export default router

// const users = [
//   { id: 'e539c0be-b51c-4462-8162-55cf584d9589', first_name: 'ksoutherton0' },
//   { id: '18db4fe3-a4b5-4720-af13-f98f00f22cc2', first_name: 'kmackowle1' },
//   { id: 'f03070b4-a084-4f94-b19e-40df0d6907c7', first_name: 'osmorthit2' },
//   { id: '6ac16842-a7ca-4942-b33d-6ec9407dac86', first_name: 'mlongland3' },
//   { id: '0d1491be-8415-4831-9566-742773751967', first_name: 'sgingles4' },
//   { id: 'fd4c2e80-4d14-48f9-8116-0a83617c45e3', first_name: 'msayward5' },
//   { id: '411cb4a0-63a2-48ec-924c-1008940b65b4', first_name: 'zedmons6' },
//   { id: '1e9a180e-2573-49ce-8a38-6692cb3948c2', first_name: 'kaymes7' },
//   { id: '1e1eaa42-d50d-48b3-a516-7df28e3eb605', first_name: 'jboyse8' },
//   { id: '9250cfcd-9789-418d-9826-2536d6d6ad39', first_name: 'jnockolds9' },
// ]
