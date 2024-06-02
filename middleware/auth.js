import passport from 'passport'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import sgMail from '@sendgrid/mail'
import { hash } from 'bcrypt'
sgMail.setApiKey(process.env.SG_API_KEY)

/**
 * Middleware function to check if the user is authenticated.
 * If the user is authenticated, it sets the user object in the response locals and calls the next middleware.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('bypassing ')
    res.locals.user = req.user
    return next()
  }
  console.log('Unauthenticated. Redirecting to login page.')
  res.redirect('/auth/login')
}
/**
 * Registers a new user and associates them with a company.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is registered.
 */
export async function registerUser(req, res, next) {
  const { email, password, companyName } = req.body
  const newUser = await User.register(email, password)
  const newCustomer = await Customer.register(companyName, email)
  newUser.company = newCustomer.id
  newUser.save()
  console.log(
    `User ${email} has been successfully registered for ${companyName}`
  )

  req.login(newUser, (user, err) => {
    if (err) {
      req.flash('error', err.message)
      return next()
    }
    res.user = user
  })
  next()
}

/**
 * Authenticates the user using the 'local' strategy.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the authentication is complete.
 */
export async function login(req, res, next) {
  passport.authenticate('local', {
    failureFlash: true,
  })(req, res, next)
}

/**
 * Logs out the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export function logout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
}

/**
 * Submits a reset password request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the reset password request is submitted.
 */
export async function submitResetPasswordRequest(req, res, next) {
  const { email } = req.body
  const user = await User.findByEmail(email)
  if (!user) {
    req.flash('error', 'No user is registered with that email')
    res.redirect('/auth/login')
    res.end()
  } else {
    user.token = createToken()
    user.tokenExpiry = Date.now() + 3600000
    user.save()
    await sendResetPwEmail(user.email, user.token)
    req.flash(
      'info',
      `An e-mail has been sent to ${user.email} with further instructions.`
    )
    res.redirect('/auth/login')
  }
}

/**
 * Generates a random token.
 *
 * @returns {string} The generated token.
 */
function createToken() {
  return Math.random().toString(36).slice(-8)
}

/**
 * Sends a password reset email to the specified email address.
 *
 * @param {string} email - The email address to send the reset email to.
 * @param {string} token - The password reset token.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
async function sendResetPwEmail(email, token) {
  const resetEmail = {
    to: email,
    from: 'no-reply@ado.software',
    subject: 'Timekeeper Password Reset',
    text: `
            Please click on the following link, or paste this into your browser to complete the password reset:
            http://timekeeper.site/auth/forgotPassword/${token}
            If you did not request this, please ignore this email and your password will remain unchanged.
            This link is valid for 24 hours and will expire after that.
        `,
  }

  await sgMail.send(resetEmail)
}
/**
 * Verifies the reset password request.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the verification is complete.
 */
export async function verifyResetPasswordRequest(req, res, next) {
  const token = req.params.token
  const user = await User.findByToken(token)
  if (!user) {
    req.flash('error', 'Password reset token is invalid')
    res.redirect('/auth/login')
  } else if (user.tokenExpiry < Date.now()) {
    req.flash('error', 'Password reset token is expired')
    res.redirect('/auth/login')
  } else {
    res.locals.token = token
    res.render('auth/forgotPassword')
  }
}
/**
 * Executes a reset password request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the password reset is complete.
 */
export async function executeResetPasswordRequest(req, res, next) {
  const token = req.params.token
  const user = await User.findByToken(token)
  if (!user || user.tokenExpiry < Date.now()) {
    req.flash('error', 'Password reset token is invalid or has expired.')
    res.redirect('/auth/login')
  }
  const { password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match')
    res.redirect(`/auth/forgotPassword/${token}`)
  }
  user.password = await hash(password, 10)
  user.token = undefined
  user.tokenExpiry = undefined
  user.save()
  req.flash(
    'success',
    'Your password has been successfully reset. Please log in with your new password.'
  )
  res.redirect('/auth/login')
}
