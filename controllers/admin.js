import TimeEntry from '../models/timeEntry.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const rawTimeEntries = await getUserScopedEntries(req.user)
    const { trimmedData: timeEntries, targetPage: page, pageCount } = paginate(rawTimeEntries, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.timeEntries = timeEntries
    res.render('admin/dashboard')
}
adminController.getWeeklyGroupView = function (req, res) {
    const entries = getUserScopedEntries(req.user)
    const yearlySortedEntries = groupByYear(entries)
    let weeklySortedEntries
    yearlySortedEntries.forEach(function(year) {weeklySortedEntries.push(groupByWeek(year))})
    res.send(weeklySortedEntries)
}

async function getUserScopedEntries(userId) {
    const user = await User.findById(userId)
    let rawTimeEntries = []
    if (user.role === 'Admin') { rawTimeEntries = await TimeEntry.find()}
    else {
        const userCompany = await Customer.findById(user.company)
        rawTimeEntries = await TimeEntry.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }).sort({ dateSubmitted: -1 })
    }
    return rawTimeEntries
}

function getYears([entries]) {
    const yearsCollection = new Set()
    entries.forEach((entry) => {
        yearsCollection.add(moment(entry.dateSubmitted).year())
    })
    return yearsCollection
}
function groupByYear(entries) {
    const sortedArray = []
    getYears(entries).forEach(year => {
        sortedArray.push(entries.filter(function (entry) {
            return moment(entry.dateSubmitted).year() === year
        }))
    })
    return sortedArray
}
function groupByWeek(entries) {
    const sortedArray = []
    for (i = 0; i < 52; i++) { // create 52 empty child arrays
        sortedArray.push([])
    }
    entries.map(entry => {
        sortedArray[entry.week].push(entry)
    })
    return sortedArray
}