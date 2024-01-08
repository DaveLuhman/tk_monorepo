import { readFileSync } from 'fs'
import https from 'https'
import helmet from 'helmet'
import session from 'express-session'
import morgan from 'morgan'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
const mongoStore = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

const sessionConfig = session({
    secret: process.env.NODE_ENV,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
    store: mongoStore
})
export function httpsServer(app) {
    const server = https.createServer({ key: readFileSync('private/\key.pem'), cert: readFileSync('private/\cert.pem') }, app);
    server.listen(3001, () => { console.log('SSL host listening at 3001 for development') })
    console.info(
        '[INIT]>>>>> Morgan enabled for logging in this development environment\n http://localhost:' + process.env.PORT
    );
}
const helmetCSP = helmet.contentSecurityPolicy({
    directives: {
        'form-action': ["'self'"],
        'default-src': ["'self'", 'ado.software'],
        'script-src': ["'self'", 'ajax.googleapis.com', 'cdn.jsdelivr.net'],
        'connect-src': ["'self'","*.ado.software", "timekeeper.site"],
    }
})
const morganConfig = morgan('dev')

export const prodConfig =  [sessionConfig, helmetCSP, morganConfig]