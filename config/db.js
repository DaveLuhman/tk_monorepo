import { connect } from 'mongoose';
import User from '../models/user.js'
import TimeEntry from '../models/timeEntry.js';
import { readFileSync } from 'fs'
import { isUtf8 } from 'buffer';

async function isUsersCollectionEmpty() {
    const user = (await User.find()).length
    return user === 0
}
async function isTimeEntryCollectionEmpty() {
    const timeEntries = (await TimeEntry.find()).length
    console.log(timeEntries)
    return timeEntries === 0
}
async function importSampleTimeEntries() {
    let sampleJson = JSON.parse(Buffer.from(readFileSync('./sampleEntries.json', {encoding: 'utf-8'})))
    console.log(sampleJson)
    sampleJson.map((entry) => {
        TimeEntry.create(entry)
    })
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
const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        console.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
        if (await isUsersCollectionEmpty()) createDefaultUser().catch((err) => {console.log(err)})
        if (await isTimeEntryCollectionEmpty()) importSampleTimeEntries().catch((err) => {console.log(err)})

    } catch (err) {
        console.error(err.red);
        process.exit(1);
    }
}
export default connectDB