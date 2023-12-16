import { connect } from 'mongoose';
import User from '../models/user.js'

const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        console.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
    } catch (err) {
        console.error(err.red);
        process.exit(1);
    }
}
export default connectDB

async function isUsersCollectionEmpty() {
    const user = await User.count()
    return user === 0
}

async function createDefaultUser() {
    try {
        const user = await User.create({
            password: '$2b$10$cDCSqQ17sAbWloBElfevMO9NmjORalQP/1VJ7WY6BwvB7PsuNM./m',
            role: 'Admin',
            email: 'admin@timekeeper.site',
        })
        return user
    } catch (error) {
        console.log(error)
    }
}
if (await isUsersCollectionEmpty()) createDefaultUser().catch((err) => {console.log(err)})