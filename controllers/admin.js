import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'
import { titleCaseAndTrim } from './api/sanitizer.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const targetOrThisWeek = req.query.p || moment().locale('US').week() - 1
    const rawTimecards = await getUserScopedEntries(req.user)
    let filteredTimecards = rawTimecards.filter(timecard => { return timecard.week === targetOrThisWeek })
    res.locals.week = targetOrThisWeek
    res.locals.timecards = filteredTimecards
    res.render('admin/dashboard')
}
async function getUserScopedEntries(userId) {
    const user = await User.findById(userId)
    let rawTimecards = []
    if (user.role === 'Admin') { rawTimecards = await Timecard.getThisYears(userId) }
    else {
        rawTimecards = await Timecard.getThisYears(userId).sort({ dateSubmitted: -1 })
    }
    return rawTimecards
}
adminController.getRoster = async function (req, res) {
    const timecards = await Timecard.getThisYears(req.user)
    if (req.query.empName) {
        const filteredTimecards = timecards.filter(timecard => {
            return titleCaseAndTrim(timecard.empName) === req.query.empName
        })
        res.locals.timecards = filteredTimecards
    }
    const roster = new Set()
    timecards.forEach(timecard => {
        roster.add(titleCaseAndTrim(timecard.empName))
    })
    res.locals.roster = roster
    res.render('admin/dashboard')
}