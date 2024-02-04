import { connect } from 'mongoose'
import User from '../models/user.js'
import Timecard from '../models/timecard.js'
import { readFileSync } from 'fs'

async function isUsersCollectionEmpty() {
  const user = (await User.find()).length
  return user === 0
}
async function isTimecardCollectionEmpty() {
  const timeEntries = (await Timecard.find()).length
  return timeEntries === 0
}
async function importSampleTimeEntries() {
  try {
    console.log('No Timecards in database, Importing Sample.json'.red)
    let sampleJson = JSON.parse(
      Buffer.from(readFileSync('./sampleEntries.json', { encoding: 'utf-8' }))
    )
    sampleJson.map((entry) => {
      Timecard.create(entry)
    })
  } catch (error) {
    console.error(error)
  }
}
async function createDefaultUser() {
  console.log('No Users In Database, Createing Default User'.red)
  console.log('User: admin@timekeeper.site'.cyan)
  console.log('password: asdfasdf'.cyan)
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
    const conn = await connect(process.env.MONGO_URI)
    console.info(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    )
    if (await isUsersCollectionEmpty())
      createDefaultUser().catch((err) => {
        console.log(err)
      })
    if (await isTimecardCollectionEmpty())
      importSampleTimeEntries().catch((err) => {
        console.log(err)
      })
  } catch (err) {
    console.error(err.red)
    process.exit(1)
  }
}
export default connectDB
