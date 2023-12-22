import cron from 'node-cron'
import automation from './index.js'

// const weeklyReportJob = cron.schedule(
//     '00 23 * * 0',
//     function () {
//         automation.aggregateReport()
//     },
//     { scheduled: false, timezone: 'America/Chicago' }
// )
// const sundayNoonDigestJob = cron.schedule(
//     '00 12 * * 0',
//     function () {
//         automation.dailyEntries()
//     },
//     { scheduled: false, timezone: 'America/Chicago' }
// )
// const sundayOneAmDigestJob = cron.schedule(
//     '00 01 * * 0',
//     function () {
//         automation.dailyEntries()
//     },
//     { scheduled: false, timezone: 'America/Chicago' }
// )

const weeklyTestEmailNotificationJob = cron.schedule(
    '00 08 * * 5',
    function() {
        automation.testEmail()
    },
    { scheduled: false, timezone: 'America/Chicago'}
)

const allJobs = [weeklyReportJob, weeklyTestEmailNotificationJob, sundayNoonDigestJob, sundayOneAmDigestJob]
export const scheduledTasks = () => {
    console.info(`A total of ${allJobs.length} jobs are running automatically.`.blue.bold)
    allJobs.forEach((job) => {
        job.start()
    })
}


