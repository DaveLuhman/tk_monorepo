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
    cookie: { secure: false, httpOnly: false, maxAge: 1000 * 60 * 60 * 24 },
    store:mongoStore
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

export const devConfig = [
    sessionConfig,
    helmetCSP,
    morganConfig
]