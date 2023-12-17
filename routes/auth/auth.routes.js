import authController from '../../controllers/auth.js'
import { Router } from 'express'
import {login, registerUser, logout} from '../../middleware/auth.js'

export const authRouter = Router()
authRouter.get('/login', authController.getLoginPage)

authRouter.post('/login', login, (req, res) => {
    res.redirect('/admin/')
})

authRouter.get('/register', authController.getRegisterPage)

authRouter.post('/register', registerUser, (req, res) => {
    res.redirect('/admin/')
})
authRouter.post('/logout', logout);