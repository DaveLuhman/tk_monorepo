import moment from 'moment'
import util from './util.js'

export default function aggregateYearlyData(weeklyData) {
  try {
    let annualRegularHoursTotal = 0
    let annualOvertimeHoursTotal = 0
    let overtimeWeekCount = 0
    let weeklyAvgHours = []
    const currentWeek = moment().isoWeek()
    weeklyData.map((week) => {
      annualRegularHoursTotal += week.regularHours
      annualOvertimeHoursTotal += week.overtimeHours
      if (week.overtimeHours != 0) {
        overtimeWeekCount++
      }
      weeklyAvgHours.push(week.avgHours)
    })
    const annualAvgWeeklyHoursPerEmp = Number(
      util.average(weeklyAvgHours).toFixed(2)
    )
    return {
      annualRegularHoursTotal,
      annualOvertimeHoursTotal,
      annualAvgWeeklyHoursPerEmp,
      overtimeWeekCount,
    }
  } catch (error) {
    console.error('Unable to calculate reporting' + error.message)
    return { error: { error: true, message: error.message } }
  }
}
