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
    const yearOrLessOldTimecards = timecards.filter((timecard) => {
        return moment(timecard.dateSubmitted).unix() <= moment().days(365).unix()
    })
    const weeklySortedEntries = groupByWeek(yearOrLessOldTimecards)
    res.locals.weeklyTimecards = weeklySortedEntries
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


function groupByWeek(timecards) {
    let sortedArray = []
    for (let i = 1; i < 53; i++) { // create 52 empty child arrays
        sortedArray.push({ week: i, timecards: timecards.filter(timecard => timecard.week === i) })
    }

    sortedArray = sortedArray.filter((week) => { return week.timecards.length !== 0 })
    return sortedArray
}