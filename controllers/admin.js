import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const rawTimecards = await getUserScopedEntries(req.user)
    rawTimecards.map(function (timecard) {
    })
    const { trimmedData: timecards, targetPage: page, pageCount } = paginate(rawTimecards, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.timecards = timecards
    res.render('admin/dashboard')
}
adminController.getWeeklyGroupView = async function (req, res) {
    const timecards = await getUserScopedEntries(req.user)
    const yearlySortedEntries = groupByYear(timecards)
    let yearlyWeeklySortedEntries = []
    yearlySortedEntries.forEach(function (year) { yearlyWeeklySortedEntries.push(groupByWeek(year)) })
    res.locals.yearlyTimecards = yearlyWeeklySortedEntries
    res.render('admin/dashboard')
}

async function getUserScopedEntries(userId) {
    const user = await User.findById(userId)
    let rawTimecards = []
    if (user.role === 'Admin') { rawTimecards = await Timecard.find() }
    else {
        const userCompany = await Customer.findById(user.company)
        rawTimecards = await Timecard.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }).sort({ dateSubmitted: -1 })
    }
    return rawTimecards
}

function getYears(timecards) {
    const yearsCollection = new Set()
    timecards.forEach((timecard) => {
        yearsCollection.add(moment(timecard.timeEntries[0].date).year())
    })
    return yearsCollection
}
function groupByYear(timecards) {
    const sortedArray = []
    getYears(timecards).forEach(year => {
        sortedArray.push(timecards.filter(function (timecard) {
            return moment(timecard.timeEntries[0].date).year() === year
        }))
    })
    return sortedArray
}
function groupByWeek(timecards) {
    let sortedArray = []
    for (let i = 0; i < 55; i++) { // create 52 empty child arrays
        sortedArray.push({ week: i, timecards: [] })
    }
    timecards.map(timecard => {
        sortedArray[timecard.week].timecards.push(timecard)
        console.log(sortedArray[timecard.week].week);
    })
    sortedArray = sortedArray.filter((week) => { return week.length !== 0 })
    return sortedArray
}