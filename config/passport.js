import passport from 'passport'
import User from '../models/user.js'
import LocalStrategy from 'passport-local'
import { compare } from 'bcrypt'

const passportConfig = (app) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        console.info(`[AUTH] ${email} attempting login`.blue.bold)
        const user = await User.findOne({ email: { $eq: email } }).exec()
        if (!user) {
          console.log('No User Found')
          return done(
            null,
            false,
            req.flash('error', 'That email is not registered')
          )
        }
        if (user.active === false) {
          console.log('Disabled user')
          return done(
            null,
            false,
            req.flash(
              'error',
              'That user has been disabled. Contact your manager'
            )
          )
        }
        compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            console.log('User Authenticated Successfully')
            return done(null, user)
          } else {
            console.log('bad password')
            return done(null, false, req.flash('error', 'Password incorrect'))
          }
        })
      }
    )
  )

  // stores user to session
  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}

export default passportConfig
