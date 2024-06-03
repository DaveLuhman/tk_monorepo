import { readFileSync } from 'fs'
import https from 'https'
import helmet from 'helmet'
import session from 'express-session'
import morgan from 'morgan'
import { default as connectMongoDBSession } from 'connect-mongodb-session'
const MongoDBStore = connectMongoDBSession(session)
const mongoStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
})

/**
 * Configuration for session middleware.
 *
 * @type {Object}
 * @property {string} secret - The secret key used to sign the session ID cookie.
 * @property {boolean} resave - Determines whether the session should be saved to the session store on each request.
 * @property {boolean} saveUninitialized - Determines whether a session should be created for every request, even if it's not modified.
 * @property {Object} cookie - Configuration options for the session cookie.
 * @property {boolean} cookie.secure - Determines whether the session cookie should only be sent over HTTPS.
 * @property {boolean} cookie.httpOnly - Determines whether the session cookie should be accessible only through the HTTP protocol.
 * @property {number} cookie.maxAge - The maximum age of the session cookie in milliseconds.
 * @property {Object} store - The session store used to store session data.
 */
const sessionConfig = session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
  store: mongoStore,
})
export function httpsServer(app) {
  const server = https.createServer(
    {
      key: readFileSync('private/key.pem'),
      cert: readFileSync('private/cert.pem'),
    },
    app
  )
  server.listen(3001, () => {
    console.log('SSL host listening at 3001 for development')
  })
  console.info(
    '[INIT]>>>>> Morgan enabled for logging in this development environment\n http://localhost:' +
      process.env.PORT
  )
}
const helmetCSP = helmet.contentSecurityPolicy({
  directives: {
    'form-action': ["'self'"],
    'default-src': ["'self'", 'ado.software'],
    'script-src': ["'self'", 'ajax.googleapis.com', 'cdn.jsdelivr.net'],
    'connect-src': ["'self'", '*.ado.software', 'timekeeper.site'],
  },
})
const morganConfig = morgan('dev')

export const prodConfig = [sessionConfig, helmetCSP, morganConfig]
