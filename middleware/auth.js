import passport from 'passport';
import User from '../models/user.js';
import Customer from '../models/customer.js';

const auth = {}

auth.checkAuth = function checkAuth(req, res, next) {
    console.log(req.isAuthenticated)
    if (req.isAuthenticated) {
        res.locals.user = req.user
        return next()
    }
    res.locals.message = 'You must be logged in to access that page'
    console.log('Unauthenticated. Redirecting to login page.')
    res.redirect('auth/login')
}
auth.registerUser = async function (req, res, next) {
    const { email, password, companyName } = req.body
    const newUser = await User.register(email, password)
    const newCustomer = await Customer.register(companyName, email)
    newUser.company = newCustomer.id
    newUser.save()
    console.log(`User ${email} has been successfully registered for ${companyName}`);

    req.login(newUser, (user, err) => {
        if (err) { req.flash(err.message); return next(); }
        res.user = user;
    })
    next()
}

auth.login = async function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureMessage: true,
        failureRedirect: '/login'
    })(req, res, next)
}

auth.logout = function logout(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect(req.headers.hostname + '/')
    })
}

export default auth