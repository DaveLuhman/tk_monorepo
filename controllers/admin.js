import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const rawTimeEntries = await getUserScopedEntries(req.user)
    rawTimeEntries.map(function (entry) {
    })
    const { trimmedData: timeEntries, targetPage: page, pageCount } = paginate(rawTimeEntries, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.timeEntries = timeEntries
    res.render('admin/dashboard')
}
adminController.getWeeklyGroupView = async function (req, res) {
    const entries = await getUserScopedEntries(req.user)
    const yearlySortedEntries = groupByYear(entries)
    let yearlyWeeklySortedEntries = []
    yearlySortedEntries.forEach(function (year) { yearlyWeeklySortedEntries.push(groupByWeek(year)) })
    res.locals.yearlyTimeEntries = yearlyWeeklySortedEntries
    res.render('admin/dashboard')
}

async function getUserScopedEntries(userId) {
    const user = await User.findById(userId)
    let rawTimeEntries = []
    if (user.role === 'Admin') { rawTimeEntries = await TimeEntry.find() }
    else {
        const userCompany = await Customer.findById(user.company)
        rawTimeEntries = await TimeEntry.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }).sort({ dateSubmitted: -1 })
    }
    return rawTimeEntries
}

function getYears(entries) {
    const yearsCollection = new Set()
    entries.forEach((entry) => {
        yearsCollection.add(moment(entry.timeEntries[0].date).year())
    })
    return yearsCollection
}
function groupByYear(entries) {
    const sortedArray = []
    getYears(entries).forEach(year => {
        sortedArray.push(entries.filter(function (entry) {
            return moment(entry.timeEntries[0].date).year() === year
        }))
    })
    return sortedArray
}
function groupByWeek(entries) {
    let sortedArray = []
    for (let i = 0; i < 55; i++) { // create 52 empty child arrays
        sortedArray.push({ week: i, entries: [] })
    }
    entries.map(entry => {
        sortedArray[entry.week].entries.push(entry)
        console.log(sortedArray[entry.week].week);
    })
    sortedArray = sortedArray.filter((week) => { return week.length !== 0 })
    return sortedArray
}