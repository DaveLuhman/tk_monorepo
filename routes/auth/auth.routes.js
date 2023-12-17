import authController from '../../controllers/auth.js'
import { Router } from 'express'
import auth from '../../middleware/auth.js'

export const authRouter = Router()
authRouter.get('/login', authController.getLoginPage)

authRouter.post('/login', auth.login, (req, res) => {
    res.redirect('/admin/')
})

authRouter.get('/register', authController.getRegisterPage)

authRouter.post('/register', auth.registerUser, (req, res) => {
    res.redirect('/admin/')
})
authRouter.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});