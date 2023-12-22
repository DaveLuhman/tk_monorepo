import { Schema, model } from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'
import moment from 'moment'

const timecardSchema = new Schema(
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
  timecardSchema.plugin(mongooseAutoPopulate)

  timecardSchema.virtual('week').get(function () {
    return moment(this.timeEntries[0].date).locale('US').week()
})

timecardSchema.static('getTodaysEntries', async function () {
  const todaysTimecards = await model('Timecard')
    .find({ createdAt: { $gte: moment().startOf('day') } })
    .sort('empName')
  return todaysTimecards
})
timecardSchema.static('getThisWeeksEntries', async function () {
  const thisWeek = moment().locale('US').week()
  const thisYearsTimecards = await model('Timecard').find()
  const thisWeeksTimecards = []
  thisYearsTimecards.map((document) => {
    if(document.week === thisWeek) thisWeeksTimecards.push(document)
  })
  return thisWeeksTimecards
})
timecardSchema.static('getLastWeeksEntries', async function () {
  const thisWeek = moment().locale('US').week()
  const thisYearsTimecards = await model('Timecard').find()
  const lastWeeksTimecards = []
  thisYearsTimecards.map((document) => {
    if(document.week === (thisWeek-1)) lastWeeksTimecards.push(document)
  })
  return lastWeeksTimecards
})

timecardSchema.static('getThisMonthsEntries', async function () {
  const timecards = await model('Timecard')
    .find({ createdAt: { $gte: moment().startOf('month') } })
    .sort('empName')
  return timecards
})
timecardSchema.static('getThisYearsEntries', async function () {
  const timecards = await model('Timecard')
    .find({ createdAt: { $gte: moment().startOf('year') } })
    .sort('empName')
  return timecards
})
timecardSchema.static('deleteTestEntries', async function() {
  await model('Timecard').deleteMany({empName: {$regex: /test/, $options: 'i'}})
})

const Timecard =  model('Timecard', timecardSchema, 'timecards')
export default Timecard