import helmet from 'helmet'
import session from 'express-session'
import morgan from 'morgan'
import { readFileSync } from 'fs'
import https from 'https'


const sessionConfig = session({
    secret: process.env.NODE_ENV,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
})
const helmetCSP = helmet.contentSecurityPolicy({
    directives: {
        'form-action': ["'self'"],
        'default-src': ["'self'", 'ado.software'],
        'script-src': ["'self'", 'ajax.googleapis.com', 'cdn.jsdelivr.net'],
        'connect-src': ["*.ado.software", "timekeeper.site"],
    }
})
const morganConfig = morgan('dev')

export function httpsServer() {
    const server = https.createServer({ key: readFileSync('src/\private/\key.pem'), cert: readFileSync('src/\private/\cert.pem') }, app);
    server.listen(3001, () => { console.log('SSL host listening at 3001 for development') })
    console.info(
        '[INIT]>>>>> Morgan enabled for logging in this development environment\n http://localhost:' + process.env.PORT
    );
}
export const devConfig = [
    sessionConfig,
    helmetCSP,
    morganConfig
]