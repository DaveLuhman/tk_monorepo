import aggregateReport from './aggregate/index.js'
import  testEmail from './testEmail/index.js'
import dailyEntries from './dailyEntries/index.js'
/**
 * Array of scheduled tasks.
 * @type {Array<Function>}
 */
const scheduledTasks = [aggregateReport, testEmail, dailyEntries]
export default scheduledTasks