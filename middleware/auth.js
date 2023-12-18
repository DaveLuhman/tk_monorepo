import passport from 'passport';
import User from '../models/user.js';
import Customer from '../models/customer.js';



export function checkAuth(req, res, next) {
    if (req.user) {
        console.log('bypassing ')
        res.locals.user = req.user
        return next()
    }
    console.log('Unauthenticated. Redirecting to login page.')
    res.redirect('auth/login')
}
export async function registerUser(req, res, next) {
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

export async function login(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureMessage: true,
        failureRedirect: '/login'
    })(req, res, next)
}

export function logout(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
}