import  sgMail from  '@sendgrid/mail'
sgMail.setApiKey(process.env.SG_API_KEY)
import Timecard from '../../models/timecard.js'
import { stringify } from 'csv-stringify/sync'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import moment from 'moment'

/**
 * Compares two weekly employee lists and returns the names of employees missing in the current week.
 *
 * @param {Array<string>} lastWeek - The list of employee names from the last week.
 * @param {Array<string>} thisWeek - The list of employee names from the current week.
 * @returns {Array<string>} - The names of employees missing in the current week.
 */
function compareWeeklyEmpLists(lastWeek, thisWeek) {
  const missingEmpNames = []
  for (let i = 0; i < lastWeek.length; i++) {
    if (!thisWeek.includes(lastWeek[i])) {
      missingEmpNames.push(lastWeek[i])
    }
  }
  return missingEmpNames
}
/**
 * Collects data for the timecard CSV.
 * @returns {Array<Array<string>>} The nested array containing the timecard data.
 */
async function collectDataForTimecardCSV() {
  const nestedArray = []
  const timecards = await Timecard.getThisWeeksEntries()
  timecards.forEach((timecard) => {
    const {
      empName,
      timeEntries,
      hoursCount,
      overtimeCount,
      punchCount,
      createdAt,
    } = timecard
    timeEntries.forEach((entry) => {
      nestedArray.push([
        empName,
        `${hoursCount}`,
        `${overtimeCount}`,
        `${punchCount}`,
        moment(createdAt).format('MM-DD-YYYY'),
        moment(entry.date).format('MM-DD-YYYY'),
        entry.jobName,
        entry.jobNum,
        `${entry.hours}`,
        `${entry.overtime || 0}`,
      ])
    })
  })
  return nestedArray
}

function createCSVReport(arrayData) {
  const stringifiedData = stringify(arrayData)
  writeFileSync('./tempDaily.csv', stringifiedData, 'utf-8')
}
/**
 * @name collectDataForDigest
 * @desc removes test entries, collates the previous two weeks entries, and returns them
 * @return {*}
 */
async function collectDataForDigest() {
  // remove test entries before working with data
  await Timecard.deleteTestEntries()
  const thisWeeksTimecards = await Timecard.getThisWeeksEntries()
  const thisWeeksEmpList = []
  thisWeeksTimecards.forEach((entry) => {
    thisWeeksEmpList.push(entry.empName)
  })
  const lastWeeksEmpList = []
  const lastWeeksTimecards = await Timecard.getLastWeeksEntries()
  lastWeeksTimecards.map((entry) => {
    lastWeeksEmpList.push(entry.empName)
  })
  return {
    lastWeeksEmpList,
    thisWeeksEmpList,
  }
}
function capitalizeNames(empNameList) {
  const returnNames = []
  empNameList.forEach((name) => {
    name = name.trim()
    let names = name.split(' ')
    for (let i = 0; i < names.length; i++) {
      names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1)
    }
    returnNames.push(names.join(' '))
  })
  return returnNames
}

function organizeDataForReport(data) {
  const lastWeeksEmpList = capitalizeNames(data.lastWeeksEmpList)
  const thisWeeksEmpList = capitalizeNames(data.thisWeeksEmpList)
  const missingEmpNames = compareWeeklyEmpLists(
    lastWeeksEmpList,
    thisWeeksEmpList
  )
  return {
    lastWeeksEmpList: lastWeeksEmpList.sort(),
    thisWeeksEmpList: thisWeeksEmpList.sort(),
    lastWeeksTotal: lastWeeksEmpList.length,
    thisWeeksTotal: thisWeeksEmpList.length,
    missingEmpNames: missingEmpNames.sort(),
    missingEmpCount: missingEmpNames.length,
  }
}

function deleteCSVFile() {
  try {
    unlinkSync('./tempDaily.csv')
  } catch (err) {
    console.error(err)
  }
}

export default async function sendDailyReport() {
  createCSVReport(await collectDataForTimecardCSV())
  const msg = {
    dynamic_template_data: organizeDataForReport(await collectDataForDigest()),
    from: 'donotreply@ado.software',
    to: ['reporting@ado.software', process.env.TO_EMAIL],
    subject: 'Timekeeper Weekend Digest',
    templateId: process.env.SG_DAILY_DIGEST_TEMPLATE_ID,
    attachments: [
      {
        content: readFileSync('./tempDaily.csv').toString('base64'),
        filename: 'ThisWeeksEntries.csv',
        type: 'text/csv',
        disposition: 'attachment',
      },
    ],
  }
  sgMail
    .send(msg)
    .then(() => {
      console.info('Daily Digest sent successfully.')
      deleteCSVFile()
    })
    .catch((error) => {
      console.error(error.errors)
    })
}
