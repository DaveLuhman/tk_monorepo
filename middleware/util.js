/*
List of Functions in order (* at beginning means exported)
*rateLimiter
*getPackageVersion
*weeklyDayShift
*/

import rateLimit from 'express-rate-limit';

import moment from 'moment';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export function getEnvironment(_req, res, next) {
  res.locals.backendUrl = process.env.BACKEND_URL
  res.locals.npmPackageVersion = process.env.NPM_PACKAGE_VERSION
  return next()
}

export function exposeUserObject (req, res, next){
  res.locals.user = req.user ? req.user : 'noUser'
  next()
}
export function weeklyDayShift (_req, res, next) {
  let days = {}
  let now = new Date
  now = moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').utcOffset(-5)
  const today = moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day()
  if (today === 0) {
    days = [
      { day: 'Sunday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-7).format('YYYY-MM-DD') },
      { day: 'Monday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-6).format('YYYY-MM-DD') },
      { day: 'Tuesday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-5).format('YYYY-MM-DD') },
      { day: 'Wednesday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-4).format('YYYY-MM-DD') },
      { day: 'Thursday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-3).format('YYYY-MM-DD') },
      { day: 'Friday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-2).format('YYYY-MM-DD') },
      { day: 'Saturday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(-1).format('YYYY-MM-DD') }
    ]
  } else {
    days = [
      { day: 'Sunday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(0).format('YYYY-MM-DD') },
      { day: 'Monday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(1).format('YYYY-MM-DD') },
      { day: 'Tuesday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(2).format('YYYY-MM-DD') },
      { day: 'Wednesday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(3).format('YYYY-MM-DD') },
      { day: 'Thursday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(4).format('YYYY-MM-DD') },
      { day: 'Friday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(5).format('YYYY-MM-DD') },
      { day: 'Saturday', date: moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').day(6).format('YYYY-MM-DD') }
    ]
  }
  res.locals.today = moment(now, 'ddd MMM D YYYY HH:mm:ss ZZ').format('dddd')
  res.locals.weeklyDayShift = days
  return next()
}

export const mw = [weeklyDayShift,getEnvironment,exposeUserObject]