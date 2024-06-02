import calculateWeeklyData from './weeklyData.js'
import calculateYtdData from './ytdData.js'
import utilities from './util.js'
import moment from 'moment'
import Timecard from '../../models/timecard.js'

/**
 *
 *
 * @return {object} Returns All TimeEntries for the current calendar year
 */
async function ytdDocuments() {
  const startDate = moment().startOf('year').toISOString()
  return await Timecard.find({ createdAt: { $gte: startDate } })
}

/**
 *
 * @name weeklyReport
 * @desc sends a report to the ENV target containing the weekly aggregate statistics
 */
async function weeklyReport() {
  const docs = await ytdDocuments()
  const weeklyData = calculateWeeklyData(docs)
  utilities.createCSVReport(utilities.objectArrayToStringArray(weeklyData))
  const ytdData = calculateYtdData(weeklyData)
  const templateData = utilities.createTemplateDataObject(weeklyData, ytdData)
  try {
    const response = await utilities.sendWeeklyReportEmail(templateData)
    console.info(
      'The Weekly Aggregate Report Has Been Sent: ' + moment().toString()
    )
    return response
  } catch (error) {
    console.error(error)
  }
}

export default weeklyReport
