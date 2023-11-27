import { Router } from 'express'

import {
  createUser,
  deleteSingUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  updateUser,
  activateUser,
  banUser,
  unBanUser,
} from '../controllers/userController'
import { uploadImageUser } from '../middlewares/uploadFile'
import { userValidator } from '../validator/userValidator'

const router = Router()

router.post(
  '/process-register',
  uploadImageUser.single('image'),
  userValidator,
  processRegisterUser
)
router.post('/activate', uploadImageUser.single('image'), activateUser)
router.post('/', uploadImageUser.single('image'), userValidator, createUser)

router.get('/', getAllUsers)
router.get('/:email', getSingleUser)

router.delete('/:email', deleteSingUser)
router.put('/:email', uploadImageUser.single('image'), userValidator, updateUser)
router.put('/ban/:email', banUser)
router.put('/unban/:email', unBanUser)

export default router
