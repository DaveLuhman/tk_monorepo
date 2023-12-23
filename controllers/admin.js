import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'
import { titleCaseAndTrim } from './api/sanitizer.js'

const adminController = {}
export default adminController

adminController.getRoot = async (req, res) => {
    const targetOrThisWeek = req.query.p || moment().locale('US').week() - 1
    const timecards = await Timecard.getThisYears(req.user)
    let filteredTimecards = timecards.filter(timecard => { return timecard.week === targetOrThisWeek })
    res.locals.week = targetOrThisWeek
    res.locals.timecards = filteredTimecards
    res.render('admin/dashboard')
}

adminController.getRoster = async function (req, res) {
    const timecards = await Timecard.getThisYears(req.user)
    if (req.query.empName) {
        const filteredTimecards = timecards.filter(timecard => {
            return titleCaseAndTrim(timecard.empName) === req.query.empName
        })
        res.locals.empName = req.query.empName
        res.locals.timecards = filteredTimecards
    }
    const roster = new Set()
    timecards.forEach(timecard => {
        roster.add(titleCaseAndTrim(timecard.empName))
    })
    res.locals.roster = roster
    res.render('admin/dashboard')
}