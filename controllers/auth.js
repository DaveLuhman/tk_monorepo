import adminController from "./admin.js"

const authController = {}
export default authController

authController.getLoginPage = (req, res) => {
    if(req.isAuthenticated()) {adminController.getRoot()}
    req.flash('error', "")
    res.render('auth/login.hbs', { layout: 'main' })
}

authController.getRegisterPage = (req, res) => {
    res.render('auth/register.hbs', { layout: 'main', user: req.user, message: req.flash('error')})
}

authController.submitLogout = (req, res) => {
    res.redirect('/auth/logout')
}