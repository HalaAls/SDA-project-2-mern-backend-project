import { Router } from 'express'

import { handleLogin, handleLogout } from '../controllers/authController'

const router = Router()

router.post('/login', handleLogin)
router.post('/logout', handleLogout)

export default router
