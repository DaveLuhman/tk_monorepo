import Timecard from '../models/timecard.js'
import User from '../models/user.js'
import { paginate } from '../middleware/util.js'
import moment from 'moment'
import sanitizeSubmission, { titleCaseAndTrim } from './api/sanitizer.js'
import {writeFile, writeFileSync} from 'node:fs'

const adminController = {}
export default adminController

function getPopulatedWeeks(timecards) {
    const weeks = new Set()
    timecards.map((timecard) => {
        weeks.add(timecard.week)
    })
    const sortedWeeks = Array.from(weeks)
    return sortedWeeks.sort((a, b) => { return a - b; })
}
function simulateAllWeeks() {
    const weeks = []
    for (let i = 1; i < 53; i++) {
        weeks.push(i)
    }
    return weeks
}
function determineWeekNumber(week) {
    if (week === undefined) {
        week = moment().locale('US').week()
        if (week === 1) return 52
        else { return week - 1 }
    }
    else if (week === 1) return 52
    else return Number(week)
}
export async function GET_admin(req, res) {
    const targetOrThisWeek = determineWeekNumber(req.query.week)
    const timecards = await Timecard.getLast12Mo(req.user)
    let filteredTimecards = timecards.filter(timecard => { return timecard.week == targetOrThisWeek })
    const { trimmedData: finalTimecards, targetPage: page, pageCount } = paginate(filteredTimecards, req.query.p || 1, 10)
    res.locals.pagination = { page, pageCount }
    res.locals.week = targetOrThisWeek
    res.locals.weeks = getPopulatedWeeks(timecards)
    res.locals.totalTimecardCount = filteredTimecards.length
    res.locals.timecards = finalTimecards
    if(process.env.NODE_ENV == 'DEVELOPMENT'){
        writeFile('./private/locals.log ', JSON.stringify(res.locals), (err) => {
            if(err) throw new Error(err)
        })
    }
    res.render('admin/dashboard')
}
export async function GET_roster(req, res) {
    const timecards = await Timecard.getLast12Mo(req.user)
    if (req.query.empName) {
        const filteredTimecards = timecards.filter(timecard => {
            return titleCaseAndTrim(timecard.empName) === req.query.empName
        })
        const { trimmedData: finalTimecards, targetPage: page, pageCount } = paginate(filteredTimecards, req.query.p || 1, 10)
        res.locals.pagination = { page, pageCount }
        res.locals.empName = req.query.empName
        res.locals.totalTimecardCount = filteredTimecards.length
        res.locals.timecards = finalTimecards
    }
    const roster = new Set()
    timecards.forEach(timecard => {
        roster.add(titleCaseAndTrim(timecard.empName))
    })
    res.locals.roster = roster
    res.render('admin/dashboard')
}

export async function GET_updateTimecard(req, res, next) {
    try {
        const timecard = await Timecard.findById(req.params.id).exec()
        res.locals.timecard = timecard
        res.render('admin/editEntry')
    } catch (error) {
        if (error) next(error)
    }
}
export async function POST_updateTimecard(req, res, next) {
    try {
        const { punchCount, hoursCount, overtimeCount, empName, empEmail } = req.body
        const timeEntries = []
        for (let i = 0; i < punchCount; i++) {
            timeEntries.push({
                date: req.body[`te-date-${i}`],
                jobName: req.body[`te-jobName-${i}`],
                jobNum: req.body[`te-jobNum-${i}`] || '',
                hours: req.body[`te-hours-${i}`] || 0,
                overtime: req.body[`te-overtime-${i}`] || 0,
            })
        }
        const preparedTimecard = sanitizeSubmission({
            empName,
            empEmail,
            timeEntries,
            punchCount,
            overtimeCount,
            hoursCount,
        })
        await Timecard.findByIdAndUpdate(req.params.id, preparedTimecard, { new: true }).exec()
        res.locals.message = 'Timecard Successfully Updated.'
        res.redirect('/admin')
    } catch (error) {
        if (error) next(error)
    }
}

export async function POST_deleteTimecard(req, res, next) {
    try {
        const timecard = await Timecard.findByIdAndDelete(req.params.id).exec()
        res.redirect('/admin')
    } catch (error) {
        if (error) next(error)
    }
}
