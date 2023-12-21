import { Schema, model } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import moment from 'moment'

const timeEntrySchema = new Schema(
  {
    archived: {
      type: Boolean,
      default: false,
    },
    empName: {
      type: String,
    },
    empEmail: {
      type: String,
      lowercase: true,
    },
    timeEntries: [
      {
        date: Date,
        jobName: String,
        jobNum: String,
        hours: Number,
        overtime: Number,
      },
    ],
    sourceURL: {
      type: String,
      required: false,
    },
    hoursCount: Number,
    overtimeCount: Number,
    punchCount: Number,
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: false,
  }
  )
  timeEntrySchema.plugin(mongooseAutoPopulate)

  timeEntrySchema.virtual('week').get(function () {
    return moment(this.timeEntries[0].date).get('week')
})

timeEntrySchema.static('getTodaysEntries', async function () {
  const todaysEntries = await model('TimeEntry')
    .find({ createdAt: { $gte: moment().startOf('day') } })
    .sort('empName')
  return todaysEntries
})
timeEntrySchema.static('getThisWeeksEntries', async function () {
  const thisWeek = moment().week()
  const thisYearsTimecards = await model('TimeEntry').find()
  const thisWeeksTimecards = []
  thisYearsTimecards.map((document) => {
    if(document.week === thisWeek) thisWeeksTimecards.push(document)
  })
  return thisWeeksTimecards
})
timeEntrySchema.static('getLastWeeksEntries', async function () {
  const thisWeek = moment().week()
  const thisYearsTimecards = await model('TimeEntry').find()
  const lastWeeksTimecards = []
  thisYearsTimecards.map((document) => {
    if(document.week === (thisWeek-1)) lastWeeksTimecards.push(document)
  })
  return lastWeeksTimecards
})

timeEntrySchema.static('getThisMonthsEntries', async function () {
  const entries = await model('TimeEntry')
    .find({ createdAt: { $gte: moment().startOf('month') } })
    .sort('empName')
  return entries
})
timeEntrySchema.static('getThisYearsEntries', async function () {
  const entries = await model('TimeEntry')
    .find({ createdAt: { $gte: moment().startOf('year') } })
    .sort('empName')
  return entries
})
timeEntrySchema.static('deleteTestEntries', async function() {
  await model('TimeEntry').deleteMany({empName: {$regex: /test/, $options: 'i'}})
})

const TimeEntry =  model('TimeEntry', timeEntrySchema, 'timeEntries')
export default TimeEntry