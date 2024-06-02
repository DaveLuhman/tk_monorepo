import moment from 'moment'
const currentWeek = moment().isoWeek()
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SG_API_KEY)
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { stringify } from 'csv-stringify'
/**
 *
 *
 * @param {[]} arr // Array to be deduplicated
 * @return {*} // Array with unique values
 */
function distinct(arr) {
  const a = []
  for (let i = 0, l = arr.length; i < l; i++)
    if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i])
  return a
}
/**
 *
 * @param {[]} arr // Array of values to be averaged
 * @returns {Number} // average of values provided
 */
function average(arr) {
  return arr.reduce((a, c) => a + c) / arr.length
}
/**
 * @name sendWeeklyReportEmail
 * @param {templateData} // object containing the template JSON for sendgrid
 */

/**
 * Sends a weekly report email with the provided template data.
 *
 * @param {Object} templateData - The data to be used in the email template.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
async function sendWeeklyReportEmail(templateData) {
  const aggregateReport = readFileSync('/tempWeekly.csv').toString('base64')
  const msg = {
    dynamic_template_data: templateData,
    from: 'donotreply@ado.software',
    templateId: process.env.SG_WEEKLY_REPORT_TEMPLATE_ID,
    to: [process.env.TO_EMAIL, 'reporting@ado.software'],
    attachments: [
      {
        content: aggregateReport,
        filename: 'aggregateReport.csv',
        type: 'text/csv',
        disposition: 'attachment',
      },
    ],
  }
  sgMail
    .send(msg)
    .then(() => {
      console.info('Report sent successfully to ' + process.env.TO_EMAIL)
      deleteWeeklyCSVFile()
    })
    .catch((error) => {
      console.error(error)
    })
}

function deleteWeeklyCSVFile() {
  try {
    unlinkSync('tempWeekly.csv')
  } catch (err) {
    console.error(err)
  }
}

function objectArrayToStringArray(objectArray) {
  const arrayData = []
  for (let w = 0; w < objectArray.length; w++) {
    const {
      week,
      totalTimecards,
      regularHours,
      overtimeHours,
      totalHours,
      avgHours,
    } = objectArray[w]
    arrayData.push([
      week,
      totalTimecards,
      regularHours,
      overtimeHours,
      totalHours,
      avgHours,
    ])
  }
  return arrayData
}

function createCSVReport(arrayData) {
  const columns = [
    'Week Number',
    'Total Timecards',
    'Regular Hours Total',
    'Overtime Hours Total',
    'Total Hours',
    'Average Hours Per Employee',
  ]
  stringify(arrayData, { header: true, columns: columns }, (err, output) => {
    writeFileSync('./tempWeekly.csv', Buffer.from(output), 'uft-8')
  })
}
function createTemplateDataObject(weeklyData, ytdData) {
  const templateDataObject = {
    week: currentWeek,
    weeklyData: weeklyData[currentWeek - 1],
    ytdData,
  }
  return templateDataObject
}
const utilities = {
  distinct,
  average,
  sendWeeklyReportEmail,
  createTemplateDataObject,
  objectArrayToStringArray,
  createCSVReport,
}
export default utilities
