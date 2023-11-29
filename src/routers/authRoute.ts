import { Router } from 'express'

import { handleLogin, handleLogout } from '../controllers/authController'
import { isLoggedOut } from '../middlewares/auth'

const router = Router()

router.post('/login', isLoggedOut, handleLogin)
router.post('/logout', handleLogout)

export default router
