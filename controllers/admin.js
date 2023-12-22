import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import Customer from '../models/customer.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'

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
    if (user.role === 'Admin') { rawTimecards = await Timecard.find() }
    else {
        const userCompany = await Customer.findById(user.company)
        rawTimecards = await Timecard.find({ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }).sort({ dateSubmitted: -1 })
    }
    return rawTimecards
}
adminController.getRoster = async function (req, res) {
    const user = await User.findById(req.user)
    const userCompany = await Customer.findById(user.company)
    const timecards = await Timecard.find({ $and: [{ sourceURL: { $eq: 'time.' + userCompany.rootDomain } }, { dateSubmitted: { $gte: moment().day(-365) } }] }).select(['id', 'empName'])
    const roster = new Set()
    timecards.forEach(timecard => {
        roster.add(timecard.empName)
    })
    res.locals.roster = roster
    res.render('admin/dashboard')
}