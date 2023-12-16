import aggregateReport from './aggregate/index.js'
import  testEmail from './testEmail/index.js'
import dailyEntries from './dailyEntries/index.js'
const scheduledTasks = [aggregateReport, testEmail, dailyEntries]
export default scheduledTasks