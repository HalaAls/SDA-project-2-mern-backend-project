import { Router } from 'express'

import { CreateUser, deleteUser, getAllUsers, getSingleUser, registerUser, updateUserByEmail } from '../controllers/userController'
import { uploadImageUser } from '../middlewares/uploadFile'

const router = Router()

router.post('/register', uploadImageUser.single('image'), registerUser)
router.post('/', uploadImageUser.single('image'), CreateUser)

router.get('/', getAllUsers)
router.get('/:email',getSingleUser)

router.delete('/:email', deleteUser)
router.put('/:email', uploadImageUser.single('image'), updateUserByEmail)




export default router
