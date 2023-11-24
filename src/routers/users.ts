import { Router } from 'express'

import { registerUser } from '../controllers/userController'
import { uploadImageUser } from '../middlewares/uploadFile'

const router = Router()

router.post('/register', uploadImageUser.single('image'), registerUser)

export default router
