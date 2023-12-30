import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'
import { titleCaseAndTrim } from './api/sanitizer.js'

const adminController = {}
export default adminController

function getPopulatedWeeks(timecards) {
    const weeks = new Set()
    timecards.map((timecard) => {
        weeks.add(timecard.week)
    })
    const sortedWeeks = Array.from(weeks)
    return sortedWeeks.sort((a, b) => {return a - b; })
}
function simulateAllWeeks () {
    const weeks = []
    for(let i=1; i<53; i++){
        weeks.push(i)
    }
    return weeks
}
export async function GET_admin (req, res) {
    const targetOrThisWeek = req.query.week || moment().locale('US').week() - 1
    const timecards = await Timecard.getThisYears(req.user)
    let filteredTimecards = timecards.filter(timecard => { return timecard.week == targetOrThisWeek })
    const { trimmedData: finalTimecards, targetPage: page, pageCount } = paginate(filteredTimecards, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.week = targetOrThisWeek
    res.locals.weeks = getPopulatedWeeks(timecards)
    res.locals.timecards = finalTimecards
    res.render('admin/dashboard')
}
export async function GET_roster (req, res) {
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

export async function  GET_updateTimecard (req, res, next) {
    try {
        const timecard = await Timecard.findById(req.params.id).exec()
        res.locals.timecard = timecard
        res.render('admin/editEntry')
    } catch (error) {
        if(error) next(error)
    }
}
export async function  POST_updateTimecard (req, res, next) {
    try {
        const timecard = req.body

    } catch (error) {
        if(error) next(error)
    }
}