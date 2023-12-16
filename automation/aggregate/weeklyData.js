import moment from 'moment'

const currentDate = new Date()
const startDate = new Date(currentDate.getFullYear(), 0, 1)
const currentWeek = moment().isoWeek()

function aggregateWeeklyData(documents) {
  const weeklyData = []
  for (let w = 1; w <= currentWeek; w++) {
    let regularHours = 0
    let overtimeHours = 0
    let weeklyTimecards = documents.filter((document) => {document.createdAt > startDate})
    weeklyTimecards = documents.filter((document) => document.week === w)
    if (weeklyTimecards.length !== 0) {
      weeklyTimecards.forEach((timecard) => {
        if (
          typeof timecard.hoursCount === NaN ||
          typeof timecard.overtimeCount === NaN
        ) {
          console.error('Hours And Overtime Must Be Expressed As A Number')
        } else {
          regularHours += timecard.hoursCount
          overtimeHours += timecard.overtimeCount
        }
      })
      const totalHours = regularHours + overtimeHours
      weeklyData.push({
        week: w,
        regularHours: Number(regularHours.toFixed(2)),
        overtimeHours: Number(overtimeHours.toFixed(2)),
        totalHours: Number(totalHours.toFixed(2)),
        totalTimecards: weeklyTimecards.length,
        avgHours: Number((totalHours / weeklyTimecards.length).toFixed(2)),
      })
    } else {
      weeklyData.push({
        week: w,
        regularHours: 0,
        overtimeHours: 0,
        totalHours: 0,
        totalTimecards: 0,
        avgHours: 0,
      })
    }
  }
  return weeklyData
}
export default aggregateWeeklyData
