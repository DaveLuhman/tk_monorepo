import helmet from 'helmet'
import session from 'express-session'
import morgan from 'morgan'

const sessionConfig = session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
})
const helmetCSP = helmet.contentSecurityPolicy({
    directives: {
        'form-action': ["'self'"],
        'default-src': ["'self'", 'ado.software'],
        'script-src': ["'self'", 'ajax.googleapis.com', 'cdn.jsdelivr.net', 'unsafe-inline'],
        'connect-src': ["*.ado.software", "timekeeper.site", "'self'"],
    }
})
const morganConfig = morgan('dev')

export const devConfig = [
    sessionConfig,
    helmetCSP,
    morganConfig
]