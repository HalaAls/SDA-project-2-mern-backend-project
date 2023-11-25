import { Router } from 'express'

import {
  CreateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  updateUserByEmail,
  activateUser,
} from '../controllers/userController'
import { uploadImageUser } from '../middlewares/uploadFile'

const router = Router()

router.post('/process-register', uploadImageUser.single('image'), processRegisterUser)
router.post('/activate', uploadImageUser.single('image'), activateUser)
router.post('/', uploadImageUser.single('image'), CreateUser)

router.get('/', getAllUsers)
router.get('/:email', getSingleUser)

router.delete('/:email', deleteUser)
router.put('/:email', uploadImageUser.single('image'), updateUserByEmail)

export default router
